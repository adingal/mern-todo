interface DateLabelProps {
  date?: Date
}

function DateLabel({ date = new Date() }: DateLabelProps) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value

  return (
    <p className='uppercase text-accent text-xs md:text-sm'>
      {get('weekday')}, {get('day')} {get('month')}
    </p>
  )
}

export default DateLabel
