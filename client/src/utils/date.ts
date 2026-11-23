// Turns an ISO string into "19 Nov 2026", or a dash when there's no valid date
export const formatDate = (iso?: string): string => {
  if (!iso) return '—'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
