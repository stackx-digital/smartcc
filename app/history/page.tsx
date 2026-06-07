import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { HistoryClient } from './HistoryClient'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: history } = await supabase
    .from('float_calculations')
    .select('*, credit_cards(name, color)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: cards } = await supabase
    .from('credit_cards')
    .select('id, name')
    .eq('user_id', user.id)

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  return (
    <HistoryClient
      initialHistory={history || []}
      cards={cards || []}
      plan={profile?.plan || 'free'}
    />
  )
}
