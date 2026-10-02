/**
 * Recurring Transactions Processor
 *
 * TODO: Run the following migration on the Supabase project (wzagmkppxcgclrtbwohs) before using:
 *
 * alter table public.transactions add column if not exists is_recurring boolean not null default false;
 * alter table public.transactions add column if not exists recurring_day int;
 *
 * Set up a daily cron job (e.g. Vercel Cron) to POST to /api/recurring/process
 * with Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  // Auth check: require CRON_SECRET bearer token
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const todayDay = new Date().getDate()
  const todayDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // Find all recurring transactions due today
  const { data: recurringTxns, error: fetchError } = await supabase
    .from('transactions')
    .select('*')
    .eq('is_recurring', true)
    .eq('recurring_day', todayDay)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!recurringTxns || recurringTxns.length === 0) {
    return NextResponse.json({ processed: 0 })
  }

  let processed = 0
  const errors: string[] = []

  for (const txn of recurringTxns) {
    // Create a new transaction copy for today
    const { error: insertError } = await supabase.from('transactions').insert({
      user_id: txn.user_id,
      card_id: txn.card_id,
      description: txn.description,
      amount: txn.amount,
      category: txn.category,
      type: txn.type,
      transaction_date: todayDate,
      is_recurring: false, // copies are not themselves recurring
      recurring_day: null,
    })

    if (insertError) {
      errors.push(`txn ${txn.id}: ${insertError.message}`)
      continue
    }

    // Update card balance (debit increases balance, payment decreases it)
    const balanceDelta = txn.type === 'debit' ? txn.amount : -txn.amount
    const { error: balanceError } = await supabase.rpc('increment_card_balance', {
      p_card_id: txn.card_id,
      p_delta: balanceDelta,
    })

    // Fallback: manual balance update if RPC not available
    if (balanceError) {
      const { data: cardData } = await supabase
        .from('credit_cards')
        .select('current_balance')
        .eq('id', txn.card_id)
        .single()

      if (cardData) {
        const newBalance = Math.max(0, (cardData.current_balance ?? 0) + balanceDelta)
        await supabase
          .from('credit_cards')
          .update({ current_balance: newBalance })
          .eq('id', txn.card_id)
      }
    }

    processed++
  }

  if (errors.length > 0) {
    return NextResponse.json({ processed, errors }, { status: 207 })
  }

  return NextResponse.json({ processed })
}
