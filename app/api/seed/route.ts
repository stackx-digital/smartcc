import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seedCards = [
    { name: 'Al-Taslif', bank: 'Al-Rajhi Bank', card_type: 'Visa', last_four: '2891', credit_limit: 5000, current_balance: 1850, statement_day: 8, due_day_offset: 20, color: '#378ADD', is_active: true },
    { name: 'Maybank', bank: 'Maybank', card_type: 'Mastercard', last_four: '4472', credit_limit: 15000, current_balance: 4320, statement_day: 28, due_day_offset: 20, color: '#E24B4A', is_active: true },
  ]

  const { error } = await supabase
    .from('credit_cards')
    .insert(seedCards.map(c => ({ ...c, user_id: user.id })))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
