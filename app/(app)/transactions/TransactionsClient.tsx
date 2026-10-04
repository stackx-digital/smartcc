'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { Transaction, CreditCard } from '@/types'
import { toast } from 'sonner'
import { Plus, Trash2, CreditCard as CardIcon, TrendingDown, TrendingUp, Filter, Pencil, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// Note: modal form uses native <select> to avoid Radix portal z-index issues
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'food', label: 'Makan & Minum' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'utilities', label: 'Utiliti & Bil' },
  { value: 'transport', label: 'Transport' },
  { value: 'health', label: 'Kesihatan' },
  { value: 'entertainment', label: 'Hiburan' },
  { value: 'travel', label: 'Travel' },
  { value: 'payment', label: 'Bayaran Kad' },
  { value: 'others', label: 'Lain-lain' },
]

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-100 text-orange-700',
  petrol: 'bg-yellow-100 text-yellow-700',
  grocery: 'bg-green-100 text-green-700',
  shopping: 'bg-pink-100 text-pink-700',
  utilities: 'bg-blue-100 text-blue-700',
  transport: 'bg-cyan-100 text-cyan-700',
  health: 'bg-red-100 text-red-700',
  entertainment: 'bg-purple-100 text-purple-700',
  travel: 'bg-indigo-100 text-indigo-700',
  payment: 'bg-emerald-100 text-emerald-700',
  others: 'bg-slate-100 text-slate-600',
}

interface Props {
  initialTransactions: Transaction[]
  cards: Pick<CreditCard, 'id' | 'name' | 'bank' | 'color' | 'current_balance'>[]
  userId: string
}

function TransactionModal({
  open, onClose, onSuccess, cards, userId, editTx,
}: {
  open: boolean
  onClose: () => void
  onSuccess: (tx: Transaction, oldTx?: Transaction) => void
  cards: Props['cards']
  userId: string
  editTx?: Transaction
}) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    card_id: editTx?.card_id ?? '',
    description: editTx?.description ?? '',
    amount: editTx?.amount?.toString() ?? '',
    category: editTx?.category ?? 'others',
    type: (editTx?.type ?? 'debit') as 'debit' | 'payment',
    transaction_date: editTx?.transaction_date ?? new Date().toISOString().split('T')[0],
  })

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.card_id) { toast.error('Pilih kad kredit'); return }
    setLoading(true)
    const supabase = createClient()
    const amount = parseFloat(form.amount)
    const category = form.type === 'payment' ? 'payment' : form.category

    if (editTx) {
      // Edit mode
      const { data: tx, error } = await supabase
        .from('transactions')
        .update({
          card_id: form.card_id,
          description: form.description,
          amount,
          category,
          type: form.type,
          transaction_date: form.transaction_date,
        })
        .eq('id', editTx.id)
        .select('*, credit_cards(name, color, bank)')
        .single()

      if (error) { toast.error(error.message); setLoading(false); return }

      // Recalculate balance: reverse old, apply new
      // If card changed, need to update both cards
      const oldCard = cards.find(c => c.id === editTx.card_id)
      const newCard = cards.find(c => c.id === form.card_id)

      if (oldCard) {
        // Reverse old transaction on old card
        const { data: oldCardData } = await supabase.from('credit_cards').select('current_balance').eq('id', editTx.card_id).single()
        const oldBalance = oldCardData?.current_balance ?? oldCard.current_balance
        const reversedBalance = editTx.type === 'payment'
          ? oldBalance + editTx.amount
          : Math.max(0, oldBalance - editTx.amount)

        if (form.card_id === editTx.card_id) {
          // Same card: apply new transaction on reversed balance
          const finalBalance = form.type === 'payment'
            ? Math.max(0, reversedBalance - amount)
            : reversedBalance + amount
          await supabase.from('credit_cards').update({ current_balance: finalBalance }).eq('id', editTx.card_id)
        } else {
          // Different card: update old card with reversed balance
          await supabase.from('credit_cards').update({ current_balance: reversedBalance }).eq('id', editTx.card_id)
          // Apply new transaction to new card
          if (newCard) {
            const { data: newCardData } = await supabase.from('credit_cards').select('current_balance').eq('id', form.card_id).single()
            const newBalance = newCardData?.current_balance ?? newCard.current_balance
            const finalBalance = form.type === 'payment'
              ? Math.max(0, newBalance - amount)
              : newBalance + amount
            await supabase.from('credit_cards').update({ current_balance: finalBalance }).eq('id', form.card_id)
          }
        }
      }

      toast.success('Transaksi dikemaskini!')
      onSuccess(tx, editTx)
      onClose()
    } else {
      // Add mode
      const { data: tx, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          card_id: form.card_id,
          description: form.description,
          amount,
          category,
          type: form.type,
          transaction_date: form.transaction_date,
        })
        .select('*, credit_cards(name, color, bank)')
        .single()

      if (error) { toast.error(error.message); setLoading(false); return }

      const card = cards.find(c => c.id === form.card_id)
      if (card) {
        const newBalance = form.type === 'payment'
          ? Math.max(0, card.current_balance - amount)
          : card.current_balance + amount
        await supabase.from('credit_cards').update({ current_balance: newBalance }).eq('id', form.card_id)
      }

      toast.success('Transaksi direkod!')
      onSuccess(tx)
      onClose()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-visible">
        <DialogHeader>
          <DialogTitle>{editTx ? 'Edit Transaksi' : 'Tambah Transaksi'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Kad Kredit</Label>
            <select
              value={form.card_id}
              onChange={e => update('card_id', e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Pilih kad...</option>
              {cards.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Jenis</Label>
              <select
                value={form.type}
                onChange={e => update('type', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="debit">Perbelanjaan</option>
                <option value="payment">Bayaran Kad</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Amaun (RM)</Label>
              <Input type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={e => update('amount', e.target.value)} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Penerangan</Label>
            <Input placeholder="e.g. McDonald's Sunway" value={form.description} onChange={e => update('description', e.target.value)} required />
          </div>

          {form.type === 'debit' && (
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <select
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.filter(c => c.value !== 'payment').map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Tarikh</Label>
            <Input type="date" value={form.transaction_date} onChange={e => update('transaction_date', e.target.value)} required />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={loading}>Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function TransactionsClient({ initialTransactions, cards, userId }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [cardBalances, setCardBalances] = useState<Record<string, number>>(
    Object.fromEntries(cards.map(c => [c.id, c.current_balance]))
  )
  const [showAdd, setShowAdd] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | undefined>(undefined)
  const [filterCard, setFilterCard] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filtered = useMemo(() => transactions.filter(tx => {
    if (filterCard !== 'all' && tx.card_id !== filterCard) return false
    if (filterType !== 'all' && tx.type !== filterType) return false
    return true
  }), [transactions, filterCard, filterType])

  const totalSpent = useMemo(() =>
    filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0), [filtered])

  const totalPaid = useMemo(() =>
    filtered.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0), [filtered])

  function handleAdded(tx: Transaction) {
    setTransactions(prev => [tx, ...prev])
    const card = cards.find(c => c.id === tx.card_id)
    if (card) {
      setCardBalances(prev => ({
        ...prev,
        [tx.card_id]: tx.type === 'payment'
          ? Math.max(0, (prev[tx.card_id] ?? card.current_balance) - tx.amount)
          : (prev[tx.card_id] ?? card.current_balance) + tx.amount,
      }))
    }
  }

  function handleEdited(tx: Transaction, oldTx?: Transaction) {
    setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t))
    // Refresh card balances from DB would require a page reload; for now reflect local change
  }

  async function handleDelete(tx: Transaction) {
    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', tx.id)
    if (error) { toast.error(error.message); return }

    const card = cards.find(c => c.id === tx.card_id)
    if (card) {
      const current = cardBalances[tx.card_id] ?? card.current_balance
      const reversed = tx.type === 'payment' ? current + tx.amount : Math.max(0, current - tx.amount)
      setCardBalances(prev => ({ ...prev, [tx.card_id]: reversed }))
      await supabase.from('credit_cards').update({ current_balance: reversed }).eq('id', tx.card_id)
    }

    setTransactions(prev => prev.filter(t => t.id !== tx.id))
    toast.success('Transaksi dipadam.')
  }

  function handleExportCSV() {
    const headers = ['Tarikh', 'Keterangan', 'Kategori', 'Jenis', 'Jumlah', 'Kad']
    const rows = filtered.map(tx => [
      tx.transaction_date,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.category,
      tx.type,
      tx.amount.toFixed(2),
      `"${(tx.credit_cards?.name ?? '').replace(/"/g, '""')}"`,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const tx of filtered) {
      const key = tx.transaction_date
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(tx)
    }
    return [...map.entries()]
  }, [filtered])

  function formatDate(d: string) {
    return new Date(d + 'T00:00:00').toLocaleDateString('ms-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Rekod perbelanjaan kad kredit anda</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportCSV} size="sm" variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setShowAdd(true)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingDown className="h-4 w-4 text-red-500" /> Perbelanjaan
          </div>
          <p className="text-xl font-bold text-red-600">RM{totalSpent.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4 text-green-500" /> Bayaran
          </div>
          <p className="text-xl font-bold text-green-600">RM{totalPaid.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
        </div>
        <Select value={filterCard} onValueChange={setFilterCard}>
          <SelectTrigger className="h-8 text-xs w-auto min-w-[120px]"><SelectValue placeholder="Semua Kad" /></SelectTrigger>
          <SelectContent position="item-aligned" className="z-[9999]">
            <SelectItem value="all">Semua Kad</SelectItem>
            {cards.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="h-8 text-xs w-auto min-w-[120px]"><SelectValue placeholder="Semua Jenis" /></SelectTrigger>
          <SelectContent position="item-aligned" className="z-[9999]">
            <SelectItem value="all">Semua Jenis</SelectItem>
            <SelectItem value="debit">Perbelanjaan</SelectItem>
            <SelectItem value="payment">Bayaran Kad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction list */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CardIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Tiada transaksi lagi.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAdd(true)}>
            Tambah transaksi pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([date, txs]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{formatDate(date)}</p>
              <div className="space-y-2">
                {txs.map(tx => {
                  const catLabel = CATEGORIES.find(c => c.value === tx.category)?.label ?? tx.category
                  const catColor = CATEGORY_COLORS[tx.category] ?? CATEGORY_COLORS.others
                  return (
                    <div key={tx.id} className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
                      <div
                        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: tx.credit_cards?.color ?? '#3b82f6' + '22' }}
                      >
                        {tx.type === 'payment'
                          ? <TrendingUp className="h-4 w-4 text-green-600" />
                          : <TrendingDown className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{tx.description}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-muted-foreground">{tx.credit_cards?.name}</span>
                          <span className="text-muted-foreground/40">·</span>
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', catColor)}>{catLabel}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={cn('text-sm font-semibold', tx.type === 'payment' ? 'text-green-600' : 'text-red-600')}>
                          {tx.type === 'payment' ? '-' : '+'}RM{tx.amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-1.5 justify-end mt-0.5">
                          <button
                            onClick={() => setEditTx(tx)}
                            className="text-muted-foreground/40 hover:text-blue-400 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx)}
                            className="text-muted-foreground/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <TransactionModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={handleAdded}
        cards={cards}
        userId={userId}
      />

      {editTx && (
        <TransactionModal
          open={!!editTx}
          onClose={() => setEditTx(undefined)}
          onSuccess={handleEdited}
          cards={cards}
          userId={userId}
          editTx={editTx}
        />
      )}
    </div>
  )
}
