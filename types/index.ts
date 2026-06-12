export interface CreditCard {
  id: string
  user_id: string
  name: string
  bank: string
  card_type: string
  last_four: string
  credit_limit: number
  current_balance: number
  statement_day: number
  due_day_offset: number
  color: string
  is_active: boolean
  shared_limit_group: string | null
  created_at: string
}

export interface FloatCalculation {
  id: string
  user_id: string
  card_id: string
  item_name: string
  purchase_date: string
  amount: number
  float_days: number
  statement_date: string
  due_date: string
  was_recommended: boolean
  created_at: string
  credit_cards?: Pick<CreditCard, 'name' | 'color'> | null
}

export interface Profile {
  id: string
  full_name: string
  email: string
  plan: 'free' | 'pro'
  created_at: string
}

export interface CardWithFloat extends CreditCard {
  floatDays: number
  nextStatementDate: Date
  dueDate: Date
  trafficLight: import('@/lib/float').TrafficLight
  utilizationPct: number
  daysUntilDue: number
}
