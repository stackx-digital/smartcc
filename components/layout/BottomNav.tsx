'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calculator, CreditCard, Store, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/planner', label: 'Planner', icon: Calculator },
  { href: '/cards', label: 'Cards', icon: CreditCard },
  { href: '/hub', label: 'Card Hub', icon: Store },
  { href: '/tutorial', label: 'Guide', icon: BookOpen },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/5 px-2 pb-safe">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center py-3 gap-1 transition-all duration-150',
              active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <span className={cn(
              'flex items-center justify-center w-9 h-7 rounded-lg transition-all',
              active ? 'bg-blue-500/20' : ''
            )}>
              <Icon className={cn('transition-all', active ? 'h-5 w-5' : 'h-4.5 w-4.5')} strokeWidth={active ? 2.5 : 2} />
            </span>
            <span className={cn('text-[10px] font-medium', active ? 'text-blue-400' : '')}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
