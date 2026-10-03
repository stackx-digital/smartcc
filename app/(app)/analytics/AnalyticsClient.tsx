'use client'
import { useMemo } from 'react'
import { Transaction, CreditCard } from '@/types'
import { TrendingDown, TrendingUp, BarChart2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { useLang } from '@/components/LanguageProvider'

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
  const { t } = useLang()
  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)

  const thisMonthTxs = useMemo(() =>
    transactions.filter(tx => tx.transaction_date.startsWith(thisMonth)), [transactions, thisMonth])

  const totalSpentThisMonth = useMemo(() =>
    thisMonthTxs.filter(tx => tx.type === 'debit').reduce((s, tx) => s + tx.amount, 0), [thisMonthTxs])

  const totalPaidThisMonth = useMemo(() =>
    thisMonthTxs.filter(tx => tx.type === 'payment').reduce((s, tx) => s + tx.amount, 0), [thisMonthTxs])

  // Spending by category (all 180 days, debit only)
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

  // Spending by card (all 180 days, debit only)
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

  // Monthly trend: last 6 months
  const monthlyTrend = useMemo(() => {
    const months: { label: string; key: string }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toISOString().slice(0, 7)
      const label = d.toLocaleDateString('ms-MY', { month: 'short', year: '2-digit' })
      months.push({ key, label })
    }
    return months.map(({ key, label }) => ({
      label,
      total: transactions
        .filter(tx => tx.type === 'debit' && tx.transaction_date.startsWith(key))
        .reduce((s, tx) => s + tx.amount, 0),
    }))
  }, [transactions])

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-blue-500" /> {t('analyticsTitle')}
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">{t('analyticsSubtitle')}</p>
      </div>

      {/* This month summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingDown className="h-4 w-4 text-red-500" /> {t('spentThisMonth')}
          </div>
          <p className="text-xl font-bold text-red-600">{fmt(totalSpentThisMonth)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4 text-green-500" /> {t('paidThisMonth')}
          </div>
          <p className="text-xl font-bold text-green-600">{fmt(totalPaidThisMonth)}</p>
        </div>
      </div>

      {/* 6-month trend — AreaChart with gradient */}
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold mb-4">{t('trend6Month')}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyTrend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={60}
              tickFormatter={v => 'RM' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)} />
            <Tooltip formatter={(v) => [fmt(Number(v)), t('spending')]} />
            <Legend />
            <Area
              type="monotone"
              dataKey="total"
              name={t('spending')}
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorTotal)"
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* By category — PieChart donut */}
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold mb-4">{t('byCategory')}</h2>
        {byCategory.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">{t('noData')}</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="total"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [fmt(Number(v)), t('total')]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* By card — horizontal BarChart */}
      <div className="rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold mb-4">{t('byCard')}</h2>
        {byCard.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">{t('noData')}</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(120, byCard.length * 44)}>
            <BarChart data={byCard} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => 'RM' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={(v) => [fmt(Number(v)), t('total')]} />
              <Bar dataKey="total" name={t('total')} radius={[0, 6, 6, 0]}>
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
