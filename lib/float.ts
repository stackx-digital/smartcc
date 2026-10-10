import { addDays, differenceInDays } from 'date-fns'

export interface FloatResult {
  floatDays: number
  nextStatementDate: Date
  dueDate: Date
}

export type TrafficStatus = 'green' | 'yellow' | 'red'

export interface TrafficLight {
  status: TrafficStatus
  label: string
  description: string
}

export function getNextStatementDate(purchaseDate: Date, statementDay: number): Date {
  const d = new Date(purchaseDate)
  // Compare calendar dates only (strip time) so a purchase on the statement day
  // itself uses the current month's statement date, not next month's.
  const todayMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  let result = new Date(d.getFullYear(), d.getMonth(), statementDay)
  if (result < todayMidnight) {
    result = new Date(d.getFullYear(), d.getMonth() + 1, statementDay)
  }
  return result
}

export function getDueDate(statementDate: Date, offset = 20): Date {
  return addDays(statementDate, offset)
}

export function calculateFloat(purchaseDate: Date, statementDay: number, dueDayOffset = 20): FloatResult {
  const nextStatementDate = getNextStatementDate(purchaseDate, statementDay)
  const dueDate = getDueDate(nextStatementDate, dueDayOffset)
  const floatDays = differenceInDays(dueDate, purchaseDate)
  return { floatDays, nextStatementDate, dueDate }
}

export function getTrafficLight(statementDay: number): TrafficLight {
  const today = new Date()
  const dayOfMonth = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysBefore = (statementDay - dayOfMonth + daysInMonth) % daysInMonth
  const daysAfter = ((dayOfMonth - statementDay) % daysInMonth + daysInMonth) % daysInMonth
  const { floatDays } = calculateFloat(today, statementDay)

  if (daysBefore >= 1 && daysBefore <= 3) {
    return {
      status: 'red',
      label: 'Tahan Dulu!',
      description: `${daysBefore} hari sebelum penyata — float < 25 hari`,
    }
  }
  if (daysAfter >= 1 && daysAfter <= 5) {
    return {
      status: 'green',
      label: 'Masa Terbaik!',
      description: `${daysAfter} hari selepas penyata — float > 40 hari`,
    }
  }
  if (floatDays >= 30) {
    return { status: 'green', label: 'Masa Sesuai', description: `${floatDays} hari float tersedia` }
  }
  if (floatDays >= 25) {
    return { status: 'yellow', label: 'Float Sederhana', description: `${floatDays} hari float` }
  }
  return { status: 'red', label: 'Float Rendah', description: `Hanya ${floatDays} hari float` }
}
