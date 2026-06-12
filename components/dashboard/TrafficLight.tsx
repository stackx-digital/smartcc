'use client'
import { CardWithFloat } from '@/types'
import { cn } from '@/lib/utils'

const statusConfig = {
  green: { bg: 'bg-[#EAF3DE]', text: 'text-[#3B6D11]', dot: 'bg-[#3B6D11]' },
  yellow: { bg: 'bg-[#FAEEDA]', text: 'text-[#854F0B]', dot: 'bg-[#854F0B]' },
  red: { bg: 'bg-[#FCEBEB]', text: 'text-[#A32D2D]', dot: 'bg-[#A32D2D]' },
}

interface TrafficLightProps {
  cards: CardWithFloat[]
}

export function TrafficLightSection({ cards }: TrafficLightProps) {
  const activeCards = cards.filter(c => c.is_active)

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Card Status Today</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeCards.map(card => {
          const { status, label, description } = card.trafficLight
          const config = statusConfig[status]
          return (
            <div key={card.id} className={cn('rounded-lg p-4 flex items-start gap-3', config.bg)}>
              <div className={cn('mt-1 h-3 w-3 rounded-full flex-shrink-0', config.dot)} />
              <div>
                <p className={cn('font-semibold text-sm', config.text)}>{card.name}</p>
                <p className={cn('font-bold', config.text)}>{label}</p>
                <p className={cn('text-xs mt-0.5', config.text, 'opacity-80')}>{description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
