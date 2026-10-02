'use client'
import { useMemo } from 'react'
import { Transaction, CreditCard } from '@/types'
import { TrendingDown, TrendingUp, BarChart2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

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

const BAR_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#f97316', '#84cc16', '#6366f1', '#14b8a6',
]

interface Props {
  transactions: Transaction[]
  cards: Pick<CreditCard, 'id' | 'name' | 'bank' | 'color' | 'current_balance'>[]
}

function fmt(n: number) {
  return 'RM' + n.toLocaleString('ms-MY', { minimumFractionDigits: 2 })
}

export function AnalyticsClient({ transactions, cards }: Props) {
  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)

  const thisMonthTxs = useMemo(() =>
    transactions.filter(t => t.transaction_date.startsWith(thisMonth)), [transactions, thisMonth])

  const totalSpentThisMonth = useMemo(() =>
    thisMonthTxs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0), [thisMonthTxs])

  const totalPaidThisMonth = useMemo(() =>
    thisMonthTxs.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0), [thisMonthTxs])

  // Spending by category (all 90 days, debit only)
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const tx of transactions) {
      if (tx.type !== 'debit') continue
      map[tx.category] = (map[tx.category] ?? 0) + tx.amount
    }
    return Object.entries(map)
      .map(([cat, total]) => ({
        name: CATEGORIES.find(c => c.value === cat)?.label ?? cat,
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)
  }, [transactions])

  // Spending by card (all 90 days, debit only)
  const byCard = useMemo(() => {
    const map: Record<string, { name: string; total: number }> = {}
    for (const tx of transactions) {
      if (tx.type !== 'debit') continue
      if (!map[tx.card_id]) {
        map[tx.card_id] = { name: tx.credit_cards?.name ?? 'Unknown', total: 0 }
      }
      map[tx.card_id].total += tx.amount
    }
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [transactions])

  // Monthly trend: last 3 months
  const monthlyTrend = useMemo(() => {
    const months: { label: string; key: string }[] = []
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toISOString().slice(0, 7)
      const label = d.toLocaleDateString('ms-MY', { month: 'short', year: '2-digit' })
      months.push({ key, label })
    }
    return months.map(({ key, label }) => ({
      label,
      total: transactions
        .filter(t => t.type === 'debit' && t.transaction_date.startsWith(key))
        .reduce((s, t) => s + t.amount, 0),
    }))
  }, [transactions])

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-blue-500" /> Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Analisis perbelanjaan 90 hari lepas</p>
      </div>

      {/* This month summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingDown className="h-4 w-4 text-red-500" /> Perbelanjaan Bulan Ini
          </div>
          <p className="text-xl font-bold text-red-600">{fmt(totalSpentThisMonth)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4 text-green-500" /> Bayaran Bulan Ini
          </div>
          <p className="text-xl font-bold text-green-600">{fmt(totalPaidThisMonth)}</p>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold mb-4">Trend 3 Bulan</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthlyTrend} barCategoryGap="30%">
            <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={60}
              tickFormatter={v => 'RM' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)} />
            <Tooltip formatter={(v: number) => [fmt(v), 'Perbelanjaan']} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {monthlyTrend.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* By category */}
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold mb-4">Perbelanjaan Mengikut Kategori</h2>
        {byCategory.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Tiada data</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(180, byCategory.length * 36)}>
            <BarChart data={byCategory} layout="vertical" barCategoryGap="20%">
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => 'RM' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip formatter={(v: number) => [fmt(v), 'Jumlah']} />
              <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* By card */}
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold mb-4">Perbelanjaan Mengikut Kad</h2>
        {byCard.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Tiada data</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(120, byCard.length * 44)}>
            <BarChart data={byCard} layout="vertical" barCategoryGap="20%">
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => 'RM' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={(v: number) => [fmt(v), 'Jumlah']} />
              <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                {byCard.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[(i + 3) % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
