'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Trophy, Loader2, Pencil, Trash2, Check, X } from 'lucide-react'
import { calculateFloat } from '@/lib/float'
import { createClient } from '@/lib/supabase'
import { CreditCard, FloatCalculation } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FloatBarChart } from '@/components/planner/FloatBarChart'
import { toast } from 'sonner'

interface CardResult {
  card: CreditCard
  floatDays: number
  nextStatementDate: Date
  dueDate: Date
}

interface PlannerClientProps {
  cards: CreditCard[]
  initialHistory: FloatCalculation[]
  userId: string
}

export function PlannerClient({ cards, initialHistory, userId }: PlannerClientProps) {
  const [purchaseDate, setPurchaseDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [itemName, setItemName] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CardResult[]>([])
  const [history, setHistory] = useState<FloatCalculation[]>(initialHistory)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editItemName, setEditItemName] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cards.length === 0) {
      toast.error('Tiada kad aktif. Sila tambah kad dahulu.')
      return
    }
    setLoading(true)

    const date = new Date(purchaseDate + 'T00:00:00')
    const cardResults: CardResult[] = cards.map(card => {
      const result = calculateFloat(date, card.statement_day, card.due_day_offset)
      return { card, ...result }
    })
    cardResults.sort((a, b) => b.floatDays - a.floatDays)
    setResults(cardResults)

    const best = cardResults[0]
    const supabase = createClient()

    const inserts = cardResults.map((r, i) => ({
      user_id: userId,
      card_id: r.card.id,
      item_name: itemName || 'Tanpa nama',
      purchase_date: purchaseDate,
      amount: parseFloat(amount) || 0,
      float_days: r.floatDays,
      statement_date: format(r.nextStatementDate, 'yyyy-MM-dd'),
      due_date: format(r.dueDate, 'yyyy-MM-dd'),
      was_recommended: i === 0,
    }))

    const { error: insertError } = await supabase.from('float_calculations').insert(inserts)
    if (insertError) toast.error('Gagal simpan kiraan: ' + insertError.message)

    const { data: newHistory } = await supabase
      .from('float_calculations')
      .select('*, credit_cards(name, color)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    setHistory(newHistory || [])
    toast.success(`Gunakan ${best.card.name} untuk float terbaik!`)
    setLoading(false)
  }

  const chartData = results.map(r => ({
    name: r.card.name,
    floatDays: r.floatDays,
    color: r.card.color,
  }))

  async function handleDelete(id: string) {
    setDeletingId(id)
    const supabase = createClient()
    const { error } = await supabase.from('float_calculations').delete().eq('id', id)
    if (error) {
      toast.error('Gagal padam: ' + error.message)
    } else {
      setHistory(prev => prev.filter(h => h.id !== id))
      toast.success('Rekod dipadam.')
    }
    setDeletingId(null)
  }

  function startEdit(h: FloatCalculation) {
    setEditingId(h.id)
    setEditItemName(h.item_name)
    setEditAmount(h.amount > 0 ? String(h.amount) : '')
  }

  async function handleEditSave(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('float_calculations')
      .update({ item_name: editItemName || 'Tanpa nama', amount: parseFloat(editAmount) || 0 })
      .eq('id', id)
    if (error) {
      toast.error('Gagal kemaskini: ' + error.message)
    } else {
      setHistory(prev => prev.map(h => h.id === id ? { ...h, item_name: editItemName || 'Tanpa nama', amount: parseFloat(editAmount) || 0 } : h))
      toast.success('Rekod dikemaskini.')
      setEditingId(null)
    }
  }

  function getFloatBadgeColor(days: number) {
    if (days >= 35) return 'bg-[#EAF3DE] text-[#3B6D11]'
    if (days >= 25) return 'bg-[#FAEEDA] text-[#854F0B]'
    return 'bg-[#FCEBEB] text-[#A32D2D]'
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Purchase Planner</h1>
        <p className="text-muted-foreground text-sm mt-1">Cari kad terbaik untuk pembelian anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Masukkan Maklumat Pembelian</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Tarikh Pembelian</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={e => setPurchaseDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemName">Nama Item</Label>
                <Input
                  id="itemName"
                  placeholder="Contoh: Laptop, Telefon..."
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (RM)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading || cards.length === 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kira Float
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <div className="rounded-lg p-4 bg-[#EAF3DE] border border-[#3B6D11]/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-[#3B6D11]" />
              <span className="font-bold text-[#3B6D11] text-lg">Cadangan Terbaik!</span>
            </div>
            <p className="text-[#3B6D11] font-medium">
              Gunakan <strong>{results[0].card.name}</strong>! Dapat{' '}
              <strong>{results[0].floatDays} hari float</strong>
              {results.length > 1 && (
                <span className="font-normal"> ({results[0].floatDays - results[results.length - 1].floatDays} hari lebih berbanding {results[results.length - 1].card.name})</span>
              )}
            </p>
            <p className="text-sm text-[#3B6D11]/80 mt-1">
              Due: {format(results[0].dueDate, 'dd MMM yyyy')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Perbandingan Float Semua Kad</CardTitle>
            </CardHeader>
            <CardContent>
              <FloatBarChart data={chartData} />
              <div className="mt-4 space-y-2">
                {results.map((r, i) => (
                  <div key={r.card.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      <div className="w-3 h-3 rounded-full" style={{ background: r.card.color }} />
                      <span className="text-sm font-medium">{r.card.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{format(r.dueDate, 'dd MMM')}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getFloatBadgeColor(r.floatDays)}`}>
                        {r.floatDays} hari
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kiraan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map(h => (
                <div key={h.id} className="py-2 border-b last:border-0 text-sm">
                  {editingId === h.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editItemName}
                        onChange={e => setEditItemName(e.target.value)}
                        placeholder="Nama item"
                        className="h-7 text-xs flex-1"
                      />
                      <Input
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                        placeholder="RM"
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-7 text-xs w-24"
                      />
                      <button onClick={() => handleEditSave(h.id)} className="text-green-600 hover:text-green-700">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{h.item_name}</span>
                        {h.was_recommended && (
                          <span className="ml-2 text-xs text-yellow-600">⭐ Disyorkan</span>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(h.purchase_date), 'dd MMM yyyy')} •{' '}
                          {h.credit_cards?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getFloatBadgeColor(h.float_days)}`}>
                            {h.float_days} hari
                          </span>
                          {h.amount > 0 && (
                            <p className="text-xs text-muted-foreground mt-0.5">RM{h.amount.toLocaleString()}</p>
                          )}
                        </div>
                        <button
                          onClick={() => startEdit(h)}
                          className="text-slate-400 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(h.id)}
                          disabled={deletingId === h.id}
                          className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Padam"
                        >
                          {deletingId === h.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
