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
    <div className="p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Selamat datang{profile?.full_name ? `, ${profile.full_name}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {today.toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <SummaryStats cards={cardsWithFloat} />

      {cardsWithFloat.length > 0 ? (
        <>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Kad Kredit Saya</h2>
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
      <div className="rounded-lg p-4 bg-[#E6F1FB] text-[#185FA5] text-sm flex gap-2">
        <span className="text-lg">💡</span>
        <p>
          <strong>Tips:</strong> Sentiasa bayar <em>Statement Balance</em> (bukan Outstanding Balance) untuk elak faedah.
        </p>
      </div>
    </div>
  )
}
