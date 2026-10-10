'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calculator, CreditCard, Receipt, BookOpen, Settings,
  LogOut, ShieldCheck, BarChart2, History, Lightbulb, Search, type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { Logo } from '@/components/brand/Logo'

type NavItem = { href: string; label: string; icon: LucideIcon }

const sections: { title: string; items: NavItem[] }[] = [
  { title: 'Ringkasan', items: [
    { href: '/dashboard', label: 'Papan Pemuka', icon: LayoutDashboard },
  ] },
  { title: 'Kad', items: [
    { href: '/cards', label: 'Kad Saya', icon: CreditCard },
    { href: '/planner', label: 'Perancang Pembelian', icon: Calculator },
    { href: '/history', label: 'Sejarah Float', icon: History },
  ] },
  { title: 'Kewangan', items: [
    { href: '/transactions', label: 'Transaksi', icon: Receipt },
    { href: '/analytics', label: 'Analitik', icon: BarChart2 },
  ] },
  { title: 'Sumber', items: [
    { href: '/compare', label: 'Bandingkan Kad', icon: Search },
    { href: '/tips', label: 'Tip Kewangan', icon: Lightbulb },
    { href: '/tutorial', label: 'Panduan', icon: BookOpen },
  ] },
  { title: 'Konfigurasi', items: [
    { href: '/settings', label: 'Tetapan', icon: Settings },
  ] },
]

const ADMIN_EMAIL = 'stackxdigital@gmail.com'

function NavLink({ href, label, icon: Icon, active }: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-[#2c7a7b]/10 text-[#1f5f60] font-semibold'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      <Icon className={cn('h-4 w-4', active ? 'text-[#2c7a7b]' : 'text-slate-400')} />
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
      setUserName(data.user?.user_metadata?.full_name ?? null)
    })
  }, [])

  async function handleLogout() {
    await createClient().auth.signOut()
    router.push('/auth/login')
  }

  const initials = userName
    ? userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : userEmail?.[0]?.toUpperCase() ?? '?'

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen fixed top-0 left-0 z-40 bg-white border-r border-slate-200">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <Logo size="sm" />
        <p className="text-[11px] text-slate-400 mt-1">Urus & optimumkan kad kredit anda</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map(section => (
          <div key={section.title}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{section.title}</p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink key={item.href} {...item} active={pathname === item.href} />
              ))}
            </div>
          </div>
        ))}
        {userEmail === ADMIN_EMAIL && (
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Admin</p>
            <Link href="/admin" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-amber-700 hover:bg-amber-50">
              <ShieldCheck className="h-4 w-4" /> Panel Admin
            </Link>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-[#2c7a7b] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{userName || 'Pengguna'}</p>
            <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
          </div>
          <button onClick={handleLogout} title="Log Keluar" className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
