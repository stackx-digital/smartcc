import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { calculateFloat, getTrafficLight } from '@/lib/float'
import { differenceInDays } from 'date-fns'
import { CreditCard, CardWithFloat } from '@/types'
import { CardDisplay } from '@/components/dashboard/CardDisplay'
import { DashboardOverview, DashTx } from '@/components/dashboard/DashboardOverview'
import { DueReminder } from '@/components/dashboard/DueReminder'
import { PushSubscriber } from '@/components/PushSubscriber'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: cards } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const today = new Date()
  const allCards = cards || []
  const cardsWithFloat: CardWithFloat[] = allCards.map((card: CreditCard) => {
    const { floatDays, nextStatementDate, dueDate } = calculateFloat(today, card.statement_day, card.due_day_offset)
    const trafficLight = getTrafficLight(card.statement_day)
    const groupBalance = card.shared_limit_group
      ? allCards.filter((c: CreditCard) => c.shared_limit_group === card.shared_limit_group).reduce((s: number, c: CreditCard) => s + c.current_balance, 0)
      : card.current_balance
    const utilizationPct = Math.round((groupBalance / card.credit_limit) * 100)
    const daysUntilDue = differenceInDays(dueDate, today)
    return { ...card, floatDays, nextStatementDate, dueDate, trafficLight, utilizationPct, daysUntilDue }
  })

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const since = new Date(today)
  since.setDate(since.getDate() - 56)
  const { data: txs } = await supabase
    .from('transactions')
    .select('amount, type, transaction_date')
    .eq('user_id', user.id)
    .gte('transaction_date', since.toISOString().slice(0, 10))
  const firstName = profile?.full_name?.split(' ')[0] ?? ''

  const highUtilCards = cardsWithFloat.filter(c => c.utilizationPct >= 80)

  return (
    <div className="p-5 md:p-8 space-y-7">
      <DueReminder cards={cardsWithFloat} />
      {highUtilCards.length > 0 && (
        <div className="rounded-2xl p-4 bg-red-50 border border-red-200 space-y-1">
          {highUtilCards.map(c => (
            <div key={c.id} className="flex items-center gap-2 text-sm text-red-700 font-medium">
              <span>⚠️</span>
              <span>
                <strong>{c.name}</strong> hampir mencapai had kredit
                {c.utilizationPct >= 100 ? ' — had kredit penuh!' : ` (${c.utilizationPct}%)`}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end -mb-4"><PushSubscriber /></div>
      <DashboardOverview cards={cardsWithFloat} transactions={(txs ?? []) as DashTx[]} firstName={firstName} />

      {cardsWithFloat.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Kad Kredit Saya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardsWithFloat.map(card => (
              <CardDisplay key={card.id} card={card} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
          <p className="text-lg">Belum ada kad kredit.</p>
          <p className="text-sm mt-1">
            <a href="/cards" className="text-[#2c7a7b] font-medium hover:underline">Tambah kad anda</a> untuk mula.
          </p>
        </div>
      )}

      {/* Tip Banner */}
      <div className="rounded-2xl p-4 bg-[#2c7a7b]/5 border border-[#2c7a7b]/15 text-[#1f5f60] text-sm flex gap-3 items-start">
        <span className="text-xl mt-0.5">💡</span>
        <p className="leading-relaxed">
          <strong>Tip:</strong> Sentiasa bayar <em>Baki Penyata</em> (bukan Baki Tertunggak) untuk elak caj faedah.
        </p>
      </div>
    </div>
  )
}
