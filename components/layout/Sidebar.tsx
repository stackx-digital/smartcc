'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calculator, CreditCard, History,
  BookOpen, Settings, LogOut, ShieldCheck, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { Logo } from '@/components/brand/Logo'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/planner', label: 'Purchase Planner', icon: Calculator },
  { href: '/cards', label: 'My Cards', icon: CreditCard },
  { href: '/history', label: 'History', icon: History },
  { href: '/tutorial', label: 'Guide', icon: BookOpen },
]

const ADMIN_EMAIL = 'stackxdigital@gmail.com'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
      setUserName(data.user?.user_metadata?.full_name ?? null)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const initials = userName
    ? userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : userEmail?.[0]?.toUpperCase() ?? '?'

  return (
    <aside className="hidden md:flex flex-col w-[240px] min-h-screen fixed top-0 left-0 z-40 bg-slate-950 border-r border-white/5">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/5">
        <Logo size="sm" className="[&_span]:text-white [&_svg_rect]:fill-blue-500" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className={cn(
                'flex items-center justify-center w-7 h-7 rounded-lg transition-all',
                active ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
              )}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          )
        })}

        <div className="my-3 border-t border-white/5" />

        <Link
          href="/settings"
          className={cn(
            'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
            pathname === '/settings'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          )}
        >
          <span className={cn(
            'flex items-center justify-center w-7 h-7 rounded-lg transition-all',
            pathname === '/settings' ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
          )}>
            <Settings className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1">Settings</span>
          {pathname === '/settings' && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
        </Link>

        {userEmail === ADMIN_EMAIL && (
          <Link
            href="/admin"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-white/5 transition-all duration-150"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400/10 group-hover:bg-amber-400/20 transition-all">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1">Admin Panel</span>
          </Link>
        )}
      </nav>

      {/* User profile footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userName || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5">
            <LogOut className="h-3.5 w-3.5" />
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
