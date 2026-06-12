'use client'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Download, Lock } from 'lucide-react'
import { FloatCalculation } from '@/types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface HistoryClientProps {
  initialHistory: FloatCalculation[]
  cards: { id: string; name: string }[]
  plan: string
}

export function HistoryClient({ initialHistory, cards, plan }: HistoryClientProps) {
  const [filterCard, setFilterCard] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return initialHistory.filter(h => {
      if (filterCard !== 'all' && h.card_id !== filterCard) return false
      if (dateFrom && h.purchase_date < dateFrom) return false
      if (dateTo && h.purchase_date > dateTo) return false
      return true
    })
  }, [initialHistory, filterCard, dateFrom, dateTo])

  function getFloatClass(days: number) {
    if (days >= 35) return 'bg-[#EAF3DE] text-[#3B6D11]'
    if (days >= 25) return 'bg-[#FAEEDA] text-[#854F0B]'
    return 'bg-[#FCEBEB] text-[#A32D2D]'
  }

  function handleExport() {
    if (plan === 'free') return
    const rows = [
      ['Date', 'Item', 'Amount (RM)', 'Card', 'Float Days', 'Due Date'],
      ...filtered.map(h => [
        h.purchase_date,
        h.item_name,
        h.amount,
        h.credit_cards?.name || '',
        h.float_days,
        h.due_date,
      ]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'float-history.csv'
    a.click()
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Float History</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={plan === 'free'}
          className="gap-2"
        >
          {plan === 'free' ? <Lock className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-auto min-w-[180px]">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Filter by Card</Label>
          <Select value={filterCard} onValueChange={setFilterCard}>
            <SelectTrigger>
              <SelectValue placeholder="All Cards" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cards</SelectItem>
              {cards.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">From Date</Label>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-auto" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">To Date</Label>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-auto" />
        </div>
      </div>

      <div className="rounded-lg border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Card</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Float Days</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map(h => (
                <tr key={h.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">{format(new Date(h.purchase_date), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3">
                    {h.item_name}
                    {h.was_recommended && <span className="ml-1 text-yellow-500">⭐</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {h.amount > 0 ? `RM${h.amount.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: h.credit_cards?.color || '#ccc' }} />
                      {h.credit_cards?.name || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getFloatClass(h.float_days)}`}>
                      {h.float_days} days
                    </span>
                  </td>
                  <td className="px-4 py-3">{format(new Date(h.due_date), 'dd MMM yyyy')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
