import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { icon: 28, text: 'text-base' },
  md: { icon: 36, text: 'text-xl' },
  lg: { icon: 48, text: 'text-3xl' },
}

export function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const s = sizes[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Icon */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="40" height="40" rx="10" fill="#1D4ED8" />
        {/* Card outline */}
        <rect x="7" y="11" width="26" height="18" rx="3" stroke="white" strokeWidth="1.8" fill="none" opacity="0.9" />
        {/* Card stripe */}
        <rect x="7" y="17" width="26" height="4" fill="white" opacity="0.3" />
        {/* Chip */}
        <rect x="10" y="13" width="6" height="4" rx="1" fill="#FCD34D" />
        <line x1="11.5" y1="13" x2="11.5" y2="17" stroke="#F59E0B" strokeWidth="1" />
        <line x1="14" y1="13" x2="14" y2="17" stroke="#F59E0B" strokeWidth="1" />
        <line x1="10" y1="15" x2="16" y2="15" stroke="#F59E0B" strokeWidth="1" />
        {/* Arrow up */}
        <path
          d="M25.5 27 L25.5 21 M22 23.5 L25.5 21 L29 23.5"
          stroke="#34D399"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark */}
      {!iconOnly && (
        <span className={cn('font-bold leading-none', s.text)}>
          <span className="text-gray-900">smart</span>
          <span className="text-blue-600">cc</span>
        </span>
      )}
    </div>
  )
}
