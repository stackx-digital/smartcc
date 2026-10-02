import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { TransactionsClient } from './TransactionsClient'

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: transactions }, { data: cards }] = await Promise.all([
    supabase
      .from('transactions')
      .select('*, credit_cards(name, color, bank)')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('credit_cards')
      .select('id, name, bank, color, current_balance')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
  ])

  return (
    <TransactionsClient
      initialTransactions={transactions || []}
      cards={cards || []}
      userId={user.id}
    />
  )
}
