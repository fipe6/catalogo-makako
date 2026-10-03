export function formatCLP(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('es-CL')
}

export function monthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleString('es-CL', { month: 'long', year: 'numeric' })
}

export function toYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7)
}
