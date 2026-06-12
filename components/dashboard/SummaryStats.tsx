'use client'
import { differenceInDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CardWithFloat } from '@/types'
import { cn } from '@/lib/utils'

interface SummaryStatsProps {
  cards: CardWithFloat[]
}

export function SummaryStats({ cards }: SummaryStatsProps) {
  const activeCards = cards.filter(c => c.is_active)

  const nextDue = activeCards.reduce<CardWithFloat | null>((prev, card) => {
    if (!prev) return card
    return card.daysUntilDue < prev.daysUntilDue ? card : prev
  }, null)

  const totalLimit = activeCards.reduce((sum, c) => sum + c.credit_limit, 0)
  const totalBalance = activeCards.reduce((sum, c) => sum + c.current_balance, 0)
  const totalUtilization = totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0

  const maxFloat = activeCards.reduce<CardWithFloat | null>((prev, card) => {
    if (!prev) return card
    return card.floatDays > prev.floatDays ? card : prev
  }, null)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Nearest Due Date</CardTitle>
        </CardHeader>
        <CardContent>
          {nextDue ? (
            <>
              <div className={cn('text-2xl font-bold', nextDue.daysUntilDue <= 5 ? 'due-urgent' : '')}>
                {nextDue.daysUntilDue} days left
              </div>
              <p className="text-xs text-muted-foreground mt-1">{nextDue.name} — {nextDue.dueDate.toLocaleDateString('en-MY')}</p>
            </>
          ) : (
            <div className="text-2xl font-bold text-muted-foreground">—</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Credit Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn('text-2xl font-bold', totalUtilization > 70 ? 'text-red-600' : totalUtilization > 30 ? 'text-amber-600' : 'text-green-600')}>
            {totalUtilization}%
          </div>
          <Progress
            value={totalUtilization}
            className={cn('mt-2 h-2', totalUtilization > 70 ? '[&>div]:bg-red-500' : totalUtilization > 30 ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500')}
          />
          <p className="text-xs text-muted-foreground mt-1">RM{totalBalance.toLocaleString()} / RM{totalLimit.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Maximum Float Today</CardTitle>
        </CardHeader>
        <CardContent>
          {maxFloat ? (
            <>
              <div className="text-2xl font-bold text-green-600">{maxFloat.floatDays} days</div>
              <p className="text-xs text-muted-foreground mt-1">{maxFloat.name} — {maxFloat.bank}</p>
            </>
          ) : (
            <div className="text-2xl font-bold text-muted-foreground">—</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
