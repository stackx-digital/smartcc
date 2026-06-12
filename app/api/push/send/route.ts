import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase-server'
import { calculateFloat } from '@/lib/float'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  // FIXED: guard against undefined CRON_SECRET making endpoint publicly accessible
  if (!cronSecret || req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: cards } = await supabase
    .from('credit_cards')
    .select('id, name, due_day_offset, statement_day, current_balance, user_id, reminder_days_before')
    .not('reminder_days_before', 'is', null)
    .eq('is_active', true)

  if (!cards?.length) return NextResponse.json({ sent: 0 })

  const today = new Date()
  let sent = 0

  for (const card of cards) {
    // FIXED: use calculateFloat() — same logic as the rest of the app — instead of broken inline calc
    const { dueDate } = calculateFloat(today, card.statement_day, card.due_day_offset)
    const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000)

    if (daysUntil > (card.reminder_days_before ?? 3)) continue

    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', card.user_id)

    for (const sub of subs || []) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: `💳 ${card.name} — Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
            body: `Pay RM${card.current_balance.toLocaleString()} before your due date.`,
            tag: `due-${card.id}`,
            url: '/dashboard',
          })
        )
        sent++
      } catch {
        // Subscription expired — remove it
        await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
      }
    }
  }

  return NextResponse.json({ sent })
}
