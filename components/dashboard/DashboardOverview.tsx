'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Gauge, Plus, CalendarClock } from 'lucide-react'
import { CardWithFloat } from '@/types'
import { cn } from '@/lib/utils'

export interface DashTx { amount: number; type: 'debit' | 'payment'; transaction_date: string }

const TEAL = '#2c7a7b'
const GREEN = '#3f8f5f'

const rm = (n: number) => n >= 1000 ? `RM ${(n / 1000).toFixed(1)}k` : `RM ${Math.round(n).toLocaleString()}`

function weekly(txs: DashTx[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = new Date(today); end.setDate(end.getDate() - 7 * (7 - i))
    const start = new Date(end); start.setDate(start.getDate() - 6)
    return { label: `Mg${i + 1}`, start, end, belanja: 0, bayaran: 0 }
  })
  for (const t of txs) {
    const d = new Date(t.transaction_date + 'T00:00:00')
    const w = weeks.find(w => d >= w.start && d <= w.end)
    if (!w) continue
    if (t.type === 'debit') w.belanja += t.amount
    else w.bayaran += t.amount
  }
  return weeks.map(({ label, belanja, bayaran }) => ({ label, belanja, bayaran }))
}

function Spark({ data, k, color }: { data: Record<string, number | string>[]; k: string; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sp-${k}-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={k} stroke={color} strokeWidth={1.75} fill={`url(#sp-${k}-${color})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function Kpi({ title, value, badge, children, highlight }: { title: string; value: string; badge?: string; children?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn('rounded-2xl p-4 border shadow-sm', highlight ? 'bg-[#2c7a7b] border-[#2c7a7b] text-white' : 'bg-white border-slate-200')}>
      <p className={cn('text-xs', highlight ? 'text-white/80' : 'text-slate-500')}>{title}</p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
        <span className="text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap">{value}</span>
        {badge && (
          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap', highlight ? 'bg-white/20' : 'bg-emerald-50 text-emerald-700')}>{badge}</span>
        )}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

const COLUMNS = [
  { status: 'green', title: 'Masa Terbaik', dot: 'bg-emerald-500', hint: 'Guna kad ini sekarang' },
  { status: 'yellow', title: 'Boleh Guna', dot: 'bg-amber-500', hint: 'Float sederhana' },
  { status: 'red', title: 'Tahan Dulu', dot: 'bg-red-500', hint: 'Dekat tarikh penyata' },
] as const

export function DashboardOverview({ cards, transactions, firstName }: { cards: CardWithFloat[]; transactions: DashTx[]; firstName: string }) {
  const active = cards.filter(c => c.is_active)
  const series = useMemo(() => weekly(transactions), [transactions])

  const totalLimit = active.reduce((s, c) => s + c.credit_limit, 0)
  const totalBalance = active.reduce((s, c) => s + c.current_balance, 0)
  const util = totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0
  const spent8w = series.reduce((s, w) => s + w.belanja, 0)
  const thisWeek = series[7].belanja, lastWeek = series[6].belanja
  const weekDelta = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null
  const best = active.reduce<CardWithFloat | null>((p, c) => (!p || c.floatDays > p.floatDays ? c : p), null)
  const nextDue = active.reduce<CardWithFloat | null>((p, c) => (!p || c.daysUntilDue < p.daysUntilDue ? c : p), null)
  const byUtil = [...active].sort((a, b) => b.utilizationPct - a.utilizationPct)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Papan Pemuka</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ringkasan kad kredit anda — guna kad yang betul pada masa yang betul, {firstName}.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/planner" className="text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700">Rancang Pembelian</Link>
          <Link href="/transactions" className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-[#2c7a7b] hover:bg-[#256a6b] text-white">
            <Plus className="h-4 w-4" /> Transaksi
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi title="Baki tertunggak" value={rm(totalBalance)} badge={`${util}% had`} highlight>
          <div className="h-1.5 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(util, 100)}%` }} />
          </div>
          <p className="text-[11px] text-white/75 mt-1.5">daripada {rm(totalLimit)} had kredit</p>
        </Kpi>
        <Kpi title="Belanja 8 minggu" value={rm(spent8w)} badge={weekDelta !== null ? `${weekDelta > 0 ? '+' : ''}${weekDelta}% mgg` : undefined}>
          <Spark data={series} k="belanja" color={TEAL} />
        </Kpi>
        <Kpi title="Float terbaik hari ini" value={best ? `${best.floatDays} hari` : '—'}>
          <p className="text-xs text-slate-500 truncate">{best ? best.name : 'Tambah kad untuk mula'}</p>
        </Kpi>
        <Kpi title="Bayaran seterusnya" value={nextDue ? `${nextDue.daysUntilDue} hari` : '—'}>
          <p className={cn('text-xs truncate', nextDue && nextDue.daysUntilDue <= 5 ? 'text-red-600 font-medium' : 'text-slate-500')}>
            {nextDue ? `${nextDue.name} · ${nextDue.dueDate.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}` : 'Tiada kad aktif'}
          </p>
        </Kpi>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-lg bg-[#2c7a7b]/10 flex items-center justify-center"><TrendingUp className="h-4 w-4 text-[#2c7a7b]" /></span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Belanja vs Bayaran</p>
              <p className="text-xs text-slate-400">8 minggu lepas</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={series} margin={{ top: 5, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={TEAL} stopOpacity={0.25} /><stop offset="100%" stopColor={TEAL} stopOpacity={0} /></linearGradient>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={GREEN} stopOpacity={0.18} /><stop offset="100%" stopColor={GREEN} stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f2" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} tickFormatter={v => (v >= 1000 ? `${v / 1000}k` : `${v}`)} />
              <Tooltip formatter={(v, n) => [`RM ${Number(v).toLocaleString()}`, n === 'belanja' ? 'Belanja' : 'Bayaran']} />
              <Area type="monotone" dataKey="belanja" stroke={TEAL} strokeWidth={2.5} fill="url(#gB)" />
              <Area type="monotone" dataKey="bayaran" stroke={GREEN} strokeWidth={2.5} fill="url(#gP)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: TEAL }} />Belanja</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: GREEN }} />Bayaran</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-lg bg-[#2c7a7b]/10 flex items-center justify-center"><Gauge className="h-4 w-4 text-[#2c7a7b]" /></span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Penggunaan Had</p>
              <p className="text-xs text-slate-400">Ikut kad</p>
            </div>
          </div>
          {byUtil.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">Tiada kad aktif</p>
          ) : (
            <div className="space-y-3">
              {byUtil.map(c => {
                const pct = Math.min(c.utilizationPct, 100)
                const color = c.utilizationPct > 70 ? '#c0504d' : c.utilizationPct > 30 ? '#c9a227' : '#3f8f5f'
                return (
                  <div key={c.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 truncate pr-2">{c.name}</span>
                      <span className="font-semibold text-slate-800">{c.utilizationPct}%</span>
                    </div>
                    <div className="h-5 rounded-md bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-md flex items-center justify-end pr-1.5 text-[10px] text-white font-semibold" style={{ width: `${Math.max(pct, 8)}%`, background: color }}>
                        {pct >= 20 && rm(c.current_balance)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#2c7a7b]" />
          <p className="text-sm font-semibold text-slate-900">Status Kad Hari Ini</p>
          <span className="text-xs text-slate-400">{active.length} kad</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {COLUMNS.map(col => {
            const list = active.filter(c => c.trafficLight.status === col.status)
            return (
              <div key={col.status} className="bg-slate-50 rounded-2xl border border-slate-200 p-3">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span className={cn('w-2 h-2 rounded-full', col.dot)} />{col.title}
                  </span>
                  <span className="text-xs text-slate-400">{list.length}</span>
                </div>
                <p className="text-[11px] text-slate-400 px-1 mb-2">{col.hint}</p>
                <div className="space-y-2">
                  {list.length === 0 && <p className="text-xs text-slate-300 text-center py-4">—</p>}
                  {list.map(c => (
                    <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{c.name}</p>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#2c7a7b]/10 text-[#1f5f60] whitespace-nowrap">{c.floatDays} hari</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{c.trafficLight.description}</p>
                      <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" /> Bayar dalam {c.daysUntilDue} hari · {c.bank}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
