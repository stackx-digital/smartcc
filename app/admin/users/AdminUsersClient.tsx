'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Search } from 'lucide-react'

type User = { id: string; full_name: string | null; email: string | null; plan: string; created_at: string }

export default function AdminUsersClient({ users: initial }: { users: User[] }) {
  const [users, setUsers] = useState(initial)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'free' | 'pro'>('all')

  const filtered = users.filter(u => {
    const matchSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.plan === filter
    return matchSearch && matchFilter
  })

  async function togglePlan(user: User) {
    const newPlan = user.plan === 'pro' ? 'free' : 'pro'
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ plan: newPlan }).eq('id', user.id)
    if (error) { toast.error('Gagal kemaskini plan'); return }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, plan: newPlan } : u))
    toast.success(`${user.email} → ${newPlan}`)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} pengguna berdaftar</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'free', 'pro'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Daftar</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-medium text-gray-900">{u.full_name || '—'}</td>
                  <td className="px-6 py-3 text-gray-600">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${u.plan === 'pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString('ms-MY')}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => togglePlan(u)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${u.plan === 'pro' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                    >
                      {u.plan === 'pro' ? 'Turun ke Free' : 'Naik ke Pro'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Tiada hasil</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
