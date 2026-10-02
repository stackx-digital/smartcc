import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Delete user data first (cascade may handle this, but be explicit)
  await supabase.from('credit_cards').delete().eq('user_id', user.id)
  await supabase.from('float_calculations').delete().eq('user_id', user.id)
  await supabase.from('push_subscriptions').delete().eq('user_id', user.id)
  await supabase.from('profiles').delete().eq('id', user.id)

  // Delete auth user via service role key
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
