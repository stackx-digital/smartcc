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
        if (card.daysUntilDue <= (card.reminder_days_before ?? 3) && card.daysUntilDue >= 0) {
          new Notification(`💳 ${card.name} — Due dalam ${card.daysUntilDue} hari`, {
            body: `Bayar RM${card.current_balance.toLocaleString()} sebelum tarikh due.`,
            icon: '/icon-192.png',
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
