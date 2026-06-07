import { calculateFloat, getNextStatementDate, getDueDate } from './float'

describe('calculateFloat', () => {
  it('Purchase 29 Jan, statementDay 28 → ~47 float days', () => {
    const purchaseDate = new Date(2024, 0, 29) // 29 Jan 2024
    const result = calculateFloat(purchaseDate, 28)
    // nextStatement: 28 Feb 2024, dueDate: 19 Mar 2024
    expect(result.nextStatementDate).toEqual(new Date(2024, 1, 28))
    expect(result.dueDate).toEqual(new Date(2024, 2, 19))
    expect(result.floatDays).toBe(50) // 19 Mar - 29 Jan = 50 days
  })

  it('Purchase on statement day moves to next month', () => {
    const purchaseDate = new Date(2024, 0, 8) // 8 Jan 2024
    const result = calculateFloat(purchaseDate, 8)
    expect(result.nextStatementDate).toEqual(new Date(2024, 1, 8))
    expect(result.floatDays).toBe(31)
  })

  it('Purchase just after statement day gets full float', () => {
    const purchaseDate = new Date(2024, 0, 9) // 9 Jan 2024, statementDay = 8
    const result = calculateFloat(purchaseDate, 8)
    expect(result.nextStatementDate).toEqual(new Date(2024, 1, 8))
    expect(result.floatDays).toBe(30)
  })
})
