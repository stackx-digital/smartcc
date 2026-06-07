'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calculator, CreditCard, History, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/planner', label: 'Planner', icon: Calculator },
  { href: '/cards', label: 'Cards', icon: CreditCard },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium transition-colors',
            pathname === href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="h-5 w-5 mb-1" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
