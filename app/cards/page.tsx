import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { CardsClient } from './CardsClient'

export default async function CardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: cards } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  return (
    <CardsClient
      initialCards={cards || []}
      userId={user.id}
      plan={profile?.plan || 'free'}
    />
  )
}
