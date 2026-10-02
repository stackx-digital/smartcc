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
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set(cards.map(c => c.id)))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editItemName, setEditItemName] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cards.length === 0) {
      toast.error('No active cards. Please add a card first.')
      return
    }
    setLoading(true)

    const date = new Date(purchaseDate + 'T00:00:00')
    const selectedCards = cards.filter(c => selectedCardIds.has(c.id))
    if (selectedCards.length === 0) {
      toast.error('Please select at least one card.')
      setLoading(false)
      return
    }
    const cardResults: CardResult[] = selectedCards
      .map(card => ({ card, ...calculateFloat(date, card.statement_day, card.due_day_offset) }))
      .sort((a, b) => b.floatDays - a.floatDays)
    setResults(cardResults)

    await saveCalculations(cardResults)
    await refreshHistory()

    toast.success(`Use ${cardResults[0].card.name} for the best float!`)
    setLoading(false)
  }

  async function saveCalculations(cardResults: CardResult[]) {
    const supabase = createClient()
    const rows = cardResults.map((r, i) => ({
      user_id: userId,
      card_id: r.card.id,
      item_name: itemName || 'Unnamed',
      purchase_date: purchaseDate,
      amount: parseFloat(amount) || 0,
      float_days: r.floatDays,
      statement_date: format(r.nextStatementDate, 'yyyy-MM-dd'),
      due_date: format(r.dueDate, 'yyyy-MM-dd'),
      was_recommended: i === 0,
    }))
    const { error } = await supabase.from('float_calculations').insert(rows)
    if (error) toast.error('Failed to save calculation: ' + error.message)
  }

  async function refreshHistory() {
    const { data } = await createClient()
      .from('float_calculations')
      .select('*, credit_cards(name, color)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    setHistory(data || [])
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
      toast.error('Failed to delete: ' + error.message)
    } else {
      setHistory(prev => prev.filter(h => h.id !== id))
      toast.success('Record deleted.')
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
      .update({ item_name: editItemName || 'Unnamed', amount: parseFloat(editAmount) || 0 })
      .eq('id', id)
    if (error) {
      toast.error('Failed to update: ' + error.message)
    } else {
      setHistory(prev => prev.map(h => h.id === id ? { ...h, item_name: editItemName || 'Unnamed', amount: parseFloat(editAmount) || 0 } : h))
      toast.success('Record updated.')
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
        <p className="text-muted-foreground text-sm mt-1">Find the best card for your purchase</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enter Purchase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={e => setPurchaseDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  placeholder="e.g. Laptop, Phone..."
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (RM)</Label>
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
            {/* Card selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Cards to Compare</Label>
                <div className="flex gap-2 text-xs">
                  <button type="button" onClick={() => setSelectedCardIds(new Set(cards.map(c => c.id)))} className="text-blue-500 hover:underline">All</button>
                  <span className="text-slate-300">|</span>
                  <button type="button" onClick={() => setSelectedCardIds(new Set())} className="text-slate-400 hover:underline">None</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cards.map(card => {
                  const selected = selectedCardIds.has(card.id)
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        setSelectedCardIds(prev => {
                          const next = new Set(prev)
                          selected ? next.delete(card.id) : next.add(card.id)
                          return next
                        })
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selected
                          ? 'border-transparent text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                      style={selected ? { background: card.color } : undefined}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: selected ? 'rgba(255,255,255,0.6)' : card.color }} />
                      {card.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button type="submit" disabled={loading || cards.length === 0 || selectedCardIds.size === 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calculate Float
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <div className="rounded-lg p-4 bg-[#EAF3DE] border border-[#3B6D11]/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-[#3B6D11]" />
              <span className="font-bold text-[#3B6D11] text-lg">Best Recommendation!</span>
            </div>
            <p className="text-[#3B6D11] font-medium">
              Use <strong>{results[0].card.name}</strong>! Get{' '}
              <strong>{results[0].floatDays} days float</strong>
              {results.length > 1 && (
                <span className="font-normal"> ({results[0].floatDays - results[results.length - 1].floatDays} days more than {results[results.length - 1].card.name})</span>
              )}
            </p>
            <p className="text-sm text-[#3B6D11]/80 mt-1">
              Due: {format(results[0].dueDate, 'dd MMM yyyy')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Float Comparison — All Cards</CardTitle>
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
                        {r.floatDays} days
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
            <CardTitle className="text-base">Recent Calculations</CardTitle>
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
                        placeholder="Item name"
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
                          <span className="ml-2 text-xs text-yellow-600">⭐ Recommended</span>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(h.purchase_date), 'dd MMM yyyy')} •{' '}
                          {h.credit_cards?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getFloatBadgeColor(h.float_days)}`}>
                            {h.float_days} days
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
                          title="Delete"
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
