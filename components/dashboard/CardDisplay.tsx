'use client'
import { useState } from 'react'
import { CardWithFloat } from '@/types'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { CheckCircle2, Loader2, Bell, BellOff } from 'lucide-react'
import { toast } from 'sonner'

interface CardDisplayProps {
  card: CardWithFloat
}

function lightenColor(hex: string, amount: number) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff) + amount)
  return `rgb(${r},${g},${b})`
}

const REMINDER_OPTIONS = [
  { label: '1 day', value: 1 },
  { label: '3 days', value: 3 },
  { label: '5 days', value: 5 },
  { label: '7 days', value: 7 },
]

export function CardDisplay({ card }: CardDisplayProps) {
  const [balance, setBalance] = useState(card.current_balance)
  const [paying, setPaying] = useState(false)
  const [reminderDays, setReminderDays] = useState<number | null>(card.reminder_days_before ?? null)
  const [showReminderPicker, setShowReminderPicker] = useState(false)

  const utilPct = card.credit_limit > 0 ? Math.round((balance / card.credit_limit) * 100) : 0
  const isUrgent = card.daysUntilDue <= 5
  const utilColor = utilPct > 70 ? '#ef4444' : utilPct > 30 ? '#f59e0b' : '#22c55e'
  const isPaid = balance === 0

  async function handleSetReminder(days: number | null) {
    const supabase = createClient()
    const { error } = await supabase
      .from('credit_cards')
      .update({ reminder_days_before: days })
      .eq('id', card.id)
    if (error) {
      toast.error('Failed to set reminder: ' + error.message)
      return
    }
    setReminderDays(days)
    setShowReminderPicker(false)
    if (days === null) {
      toast.success('Reminder turned off.')
    } else {
      if ('Notification' in window && Notification.permission !== 'denied') {
        await Notification.requestPermission()
      }
      toast.success(`Reminder set ${days} days before due date.`)
    }
  }

  async function handleMarkPaid() {
    if (isPaid) return
    setPaying(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('credit_cards')
      .update({ current_balance: 0 })
      .eq('id', card.id)
    if (error) {
      toast.error('Failed to update: ' + error.message)
    } else {
      setBalance(0)
      toast.success(`${card.name} — bill marked as paid!`)
    }
    setPaying(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/60 bg-white flex flex-col">
      {/* Card face */}
      <div
        className="relative p-5 pb-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${card.color} 0%, ${lightenColor(card.color, 40)} 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20" style={{ background: 'white' }} />
        <div className="absolute -right-2 top-10 w-16 h-16 rounded-full opacity-10" style={{ background: 'white' }} />

        {/* Top row: bank + chip */}
        <div className="flex justify-between items-start relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">{card.bank}</p>
          {/* EMV Chip */}
          <div className="w-9 h-7 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-inner flex items-center justify-center">
            <div className="w-6 h-4 rounded border border-yellow-600/40 grid grid-cols-3 grid-rows-2 gap-px p-0.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-yellow-500/50 rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Card name */}
        <p className="mt-4 text-base font-bold text-white leading-tight relative z-10 drop-shadow-sm">{card.name}</p>

        {/* Card number */}
        <p className="mt-2 text-sm text-white/70 tracking-widest font-mono relative z-10">•••• •••• •••• {card.last_four}</p>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
            {card.card_type}
          </span>
          <div className="text-right">
            <p className="text-[10px] text-white/60 uppercase tracking-wide">Float</p>
            <p className="text-sm font-bold text-white">{card.floatDays} days</p>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="p-4 space-y-4 flex-1 bg-white">
        {/* Utilization */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-slate-400 font-medium">Credit Utilization</span>
            <div className="flex items-center gap-1.5">
              <span
                className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                  utilPct <= 30 ? 'bg-green-100 text-green-700' :
                  utilPct <= 70 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                )}
              >
                {utilPct <= 30 ? '✓ Good' : utilPct <= 70 ? '⚠ Moderate' : '✕ High'}
              </span>
              <span className="text-xs font-bold" style={{ color: utilColor }}>{utilPct}%</span>
            </div>
          </div>
          {/* Progress bar with 30% marker */}
          <div className="relative w-full h-2 rounded-full bg-slate-100 overflow-visible">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(utilPct, 100)}%`, background: utilColor }}
            />
            {/* 30% target marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3.5 rounded-full bg-blue-400"
              style={{ left: '30%' }}
              title="30% limit for good credit score"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>RM{balance.toLocaleString()}</span>
            <span className="text-blue-400 font-medium">30% = RM{Math.round(card.credit_limit * 0.3).toLocaleString()}</span>
            <span>RM{card.credit_limit.toLocaleString()}</span>
          </div>
          {utilPct > 30 && (
            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
              💡 Reduce balance to <span className="text-blue-500 font-semibold">RM{Math.round(card.credit_limit * 0.3).toLocaleString()}</span> for a better credit score.
            </p>
          )}
        </div>

        {/* Mark paid button */}
        <button
          onClick={handleMarkPaid}
          disabled={isPaid || paying}
          className={cn(
            'w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all',
            isPaid
              ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
              : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
          )}
        >
          {paying ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          {isPaid ? 'Bill Paid' : 'Mark as Paid'}
        </button>

        {/* Reminder */}
        <div className="relative">
          <button
            onClick={() => setShowReminderPicker(p => !p)}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all border',
              reminderDays
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
            )}
          >
            {reminderDays ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
            {reminderDays ? `Reminder: ${reminderDays} days before due` : 'Set Due Date Reminder'}
          </button>
          {showReminderPicker && (
            <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-10 flex flex-col gap-1">
              {REMINDER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSetReminder(opt.value)}
                  className={cn(
                    'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    reminderDays === opt.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-slate-50 text-slate-700'
                  )}
                >
                  🔔 {opt.label} before due date
                </button>
              ))}
              {reminderDays && (
                <button
                  onClick={() => handleSetReminder(null)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  🔕 Turn off reminder
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Statement</p>
            <p className="text-sm font-bold text-slate-700">Day {card.statement_day}</p>
          </div>
          <div className={cn('rounded-xl px-3 py-2.5', isUrgent ? 'bg-red-50' : 'bg-slate-50')}>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Due</p>
            <p className={cn('text-sm font-bold', isUrgent ? 'text-red-600' : 'text-slate-700')}>
              {isUrgent && '⚠ '}{card.daysUntilDue} days left
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
