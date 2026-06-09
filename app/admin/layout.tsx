import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { LayoutDashboard, Users, FileText, ArrowLeft } from 'lucide-react'

const ADMIN_EMAIL = 'stackxdigital@gmail.com'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-5 border-b border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">smartcc</p>
          <p className="text-sm font-semibold text-white">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            <Users className="h-4 w-4" /> Users
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            <FileText className="h-4 w-4" /> Blog
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3 w-3" /> Kembali ke App
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  )
}
