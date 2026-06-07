import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { PlannerClient } from './PlannerClient'

export default async function PlannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: cards } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const { data: history } = await supabase
    .from('float_calculations')
    .select('*, credit_cards(name, color)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return <PlannerClient cards={cards || []} initialHistory={history || []} userId={user.id} />
}
