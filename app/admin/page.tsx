import { createClient } from '@/lib/supabase-server'
import { Users, CreditCard, TrendingUp, FileText } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: freeUsers },
    { count: proUsers },
    { count: totalCards },
    { count: totalCalcs },
    { count: publishedPosts },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'free'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro'),
    supabase.from('credit_cards').select('*', { count: 'exact', head: true }),
    supabase.from('float_calculations').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('profiles').select('id, full_name, email, plan, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const stats = [
    { label: 'Jumlah User', value: totalUsers ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Free Plan', value: freeUsers ?? 0, icon: Users, color: 'text-gray-600', bg: 'bg-gray-50' },
    { label: 'Pro Plan', value: proUsers ?? 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Jumlah Kad', value: totalCards ?? 0, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Float Dikira', value: totalCalcs ?? 0, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Blog Aktif', value: publishedPosts ?? 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Gambaran keseluruhan smartcc</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
            </div>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent signups */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Signup Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(recentUsers ?? []).map((u: { id: string; full_name: string | null; email: string | null; plan: string; created_at: string }) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-medium text-gray-900">{u.full_name || '—'}</td>
                  <td className="px-6 py-3 text-gray-600">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${u.plan === 'pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString('ms-MY')}</td>
                </tr>
              ))}
              {(recentUsers ?? []).length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Tiada user lagi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
