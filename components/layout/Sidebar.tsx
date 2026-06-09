'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calculator, CreditCard, History, Lightbulb, Settings, LogOut, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { Logo } from '@/components/brand/Logo'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/planner', label: 'Purchase Planner', icon: Calculator },
  { href: '/cards', label: 'My Cards', icon: CreditCard },
  { href: '/history', label: 'History', icon: History },
  { href: '/tips', label: 'Smart Tips', icon: Lightbulb },
]

const ADMIN_EMAIL = 'stackxdigital@gmail.com'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useState(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null))
  })

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-[220px] min-h-screen border-r bg-background px-3 py-4 fixed top-0 left-0 z-40">
      <div className="mb-6 px-2">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
              pathname === href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <div className="my-2 border-t" />
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            pathname === '/settings' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>

      {userEmail === ADMIN_EMAIL && (
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ShieldCheck className="h-4 w-4" />
          Admin Panel
        </Link>
      )}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mt-auto"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  )
}
