'use client'
import { useEffect } from 'react'
import { CardWithFloat } from '@/types'

interface DueReminderProps {
  cards: CardWithFloat[]
}

export function DueReminder({ cards }: DueReminderProps) {
  useEffect(() => {
    const cardsWithReminder = cards.filter(c => c.reminder_days_before != null)
    if (cardsWithReminder.length === 0) return

    if (!('Notification' in window)) return

    const check = () => {
      cardsWithReminder.forEach(card => {
        // FIXED: skip cards already paid (balance 0) to avoid stale reminder after mark-as-paid
        if (card.current_balance === 0) return
        if (card.daysUntilDue <= (card.reminder_days_before ?? 3) && card.daysUntilDue >= 0) {
          new Notification(`💳 ${card.name} — Due in ${card.daysUntilDue} days`, {
            body: `Pay RM${card.current_balance.toLocaleString()} before the due date.`,
            icon: '/icons/icon-192.png',
            tag: `due-${card.id}`,
          })
        }
      })
    }

    if (Notification.permission === 'granted') {
      check()
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(p => { if (p === 'granted') check() })
    }
  }, [cards])

  return null
}
