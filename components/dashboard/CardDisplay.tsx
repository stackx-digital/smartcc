'use client'
import { CardWithFloat } from '@/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface CardDisplayProps {
  card: CardWithFloat
}

export function CardDisplay({ card }: CardDisplayProps) {
  const utilPct = Math.round((card.current_balance / card.credit_limit) * 100)
  const isUrgent = card.daysUntilDue <= 5

  return (
    <div className="rounded-xl overflow-hidden shadow-md border">
      {/* Card visual */}
      <div
        className="relative p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)` }}
      >
        {/* Chip */}
        <div className="absolute top-4 right-4 w-8 h-6 rounded bg-yellow-300/80 flex items-center justify-center">
          <div className="w-6 h-4 rounded border border-yellow-500/50 grid grid-cols-2 gap-px p-0.5">
            <div className="bg-yellow-400/60 rounded-sm" />
            <div className="bg-yellow-400/60 rounded-sm" />
            <div className="bg-yellow-400/60 rounded-sm" />
            <div className="bg-yellow-400/60 rounded-sm" />
          </div>
        </div>
        <p className="text-sm font-medium opacity-90">{card.bank}</p>
        <p className="text-lg font-bold mt-1">{card.name}</p>
        <p className="text-sm opacity-75 mt-2">•••• •••• •••• {card.last_four}</p>
        <div className="flex items-center justify-between mt-3">
          <Badge variant="outline" className="text-white border-white/50 bg-white/10 text-xs">
            {card.card_type}
          </Badge>
          <span className="text-xs opacity-75">Float: {card.floatDays}h</span>
        </div>
      </div>

      {/* Card details */}
      <div className="p-4 bg-background space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Baki / Had</span>
            <span className={cn('font-medium', utilPct > 70 ? 'text-red-600' : utilPct > 30 ? 'text-amber-600' : 'text-green-600')}>
              {utilPct}%
            </span>
          </div>
          <Progress
            value={utilPct}
            className={cn('h-1.5', utilPct > 70 ? '[&>div]:bg-red-500' : utilPct > 30 ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500')}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>RM{card.current_balance.toLocaleString()}</span>
            <span>RM{card.credit_limit.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Statement Hari</p>
            <p className="font-medium">{card.statement_day}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Bayaran Due</p>
            <p className={cn('font-medium', isUrgent ? 'due-urgent' : '')}>
              {isUrgent && '⚠ '}
              {card.daysUntilDue} hari lagi
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
