import { createClient } from './supabase'

export const seedCards = [
  {
    name: 'Al-Taslif',
    bank: 'Al-Rajhi Bank',
    card_type: 'Visa',
    last_four: '2891',
    credit_limit: 5000,
    current_balance: 1850,
    statement_day: 8,
    due_day_offset: 20,
    color: '#378ADD',
    is_active: true,
  },
  {
    name: 'Maybank',
    bank: 'Maybank',
    card_type: 'Mastercard',
    last_four: '4472',
    credit_limit: 15000,
    current_balance: 4320,
    statement_day: 28,
    due_day_offset: 20,
    color: '#E24B4A',
    is_active: true,
  },
]

export async function seedUserCards(userId: string) {
  const supabase = createClient()
  const cards = seedCards.map(c => ({ ...c, user_id: userId }))
  const { error } = await supabase.from('credit_cards').insert(cards)
  return error
}
