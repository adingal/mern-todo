import type { InputHTMLAttributes } from 'react'
import { SearchIcon } from '../../assets/icons'

interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search tasks',
  className = '',
  ...inputProps
}: SearchInputProps) {
  return (
    <div
      className={`flex items-center gap-2.5 h-10 px-3.5 rounded-sm bg-neutral-200 border border-neutral-300 text-neutral-600 transition-colors focus-within:border-neutral-500 focus-within:ring-2 focus-within:ring-neutral-400/40 ${className}`}
    >
      <SearchIcon className='w-[18px] h-[18px] shrink-0' />
      <input
        type='search'
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 outline-none'
        {...inputProps}
      />
    </div>
  )
}
