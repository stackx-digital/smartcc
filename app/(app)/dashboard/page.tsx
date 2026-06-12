import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { calculateFloat, getTrafficLight } from '@/lib/float'
import { differenceInDays } from 'date-fns'
import { CreditCard, CardWithFloat } from '@/types'
import { SummaryStats } from '@/components/dashboard/SummaryStats'
import { CardDisplay } from '@/components/dashboard/CardDisplay'
import { TrafficLightSection } from '@/components/dashboard/TrafficLight'
import { DueReminder } from '@/components/dashboard/DueReminder'

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

  return (
    <div className="p-5 md:p-8 space-y-7">
      <DueReminder cards={cardsWithFloat} />
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {today.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <SummaryStats cards={cardsWithFloat} />

      {cardsWithFloat.length > 0 ? (
        <>
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-700">My Credit Cards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cardsWithFloat.map(card => (
                <CardDisplay key={card.id} card={card} />
              ))}
            </div>
          </div>

          <TrafficLightSection cards={cardsWithFloat} />
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No credit cards yet.</p>
          <p className="text-sm mt-1">
            <a href="/cards" className="text-primary hover:underline">Add your card</a> to get started.
          </p>
        </div>
      )}

      {/* Tip Banner */}
      <div className="rounded-2xl p-4 bg-blue-50 border border-blue-100 text-blue-800 text-sm flex gap-3 items-start">
        <span className="text-xl mt-0.5">💡</span>
        <p className="leading-relaxed">
          <strong>Tip:</strong> Always pay your <em>Statement Balance</em> (not the Outstanding Balance) to avoid interest charges.
        </p>
      </div>
    </div>
  )
}
