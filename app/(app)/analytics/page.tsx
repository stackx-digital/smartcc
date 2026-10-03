import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { AnalyticsClient } from './AnalyticsClient'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 180)
  const since = ninetyDaysAgo.toISOString().split('T')[0]

  const [{ data: transactions }, { data: cards }] = await Promise.all([
    supabase
      .from('transactions')
      .select('*, credit_cards(name, color, bank)')
      .eq('user_id', user.id)
      .gte('transaction_date', since)
      .order('transaction_date', { ascending: false }),
    supabase
      .from('credit_cards')
      .select('id, name, bank, color, current_balance')
      .eq('user_id', user.id)
      .eq('is_active', true),
  ])

  return (
    <AnalyticsClient
      transactions={transactions || []}
      cards={cards || []}
    />
  )
}
