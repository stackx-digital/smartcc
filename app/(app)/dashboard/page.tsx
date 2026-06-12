import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { calculateFloat, getTrafficLight } from '@/lib/float'
import { differenceInDays } from 'date-fns'
import { CreditCard, CardWithFloat } from '@/types'
import { SummaryStats } from '@/components/dashboard/SummaryStats'
import { CardDisplay } from '@/components/dashboard/CardDisplay'
import { TrafficLightSection } from '@/components/dashboard/TrafficLight'
import { Skeleton } from '@/components/ui/skeleton'

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
  const cardsWithFloat: CardWithFloat[] = (cards || []).map((card: CreditCard) => {
    const { floatDays, nextStatementDate, dueDate } = calculateFloat(today, card.statement_day, card.due_day_offset)
    const trafficLight = getTrafficLight(card.statement_day)
    const utilizationPct = Math.round((card.current_balance / card.credit_limit) * 100)
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
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Selamat datang{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {today.toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <SummaryStats cards={cardsWithFloat} />

      {cardsWithFloat.length > 0 ? (
        <>
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-700">Kad Kredit Saya</h2>
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
          <p className="text-lg">Tiada kad kredit lagi.</p>
          <p className="text-sm mt-1">
            <a href="/cards" className="text-primary hover:underline">Tambah kad anda</a> untuk bermula.
          </p>
        </div>
      )}

      {/* Tip Banner */}
      <div className="rounded-2xl p-4 bg-blue-50 border border-blue-100 text-blue-800 text-sm flex gap-3 items-start">
        <span className="text-xl mt-0.5">💡</span>
        <p className="leading-relaxed">
          <strong>Tips:</strong> Sentiasa bayar <em>Statement Balance</em> (bukan Outstanding Balance) untuk elak faedah.
        </p>
      </div>
    </div>
  )
}
