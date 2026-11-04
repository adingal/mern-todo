import type { InputHTMLAttributes, ReactNode } from 'react'
import { AlertIcon } from '../../assets/icons'

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string | undefined
  // Optional element placed inside the input box, e.g. a show/hide button
  action?: ReactNode
}

export default function FormField({
  id,
  label,
  error,
  action,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor={id} className='text-xs text-neutral-700'>
        {label}
      </label>

      <div className='relative'>
        <input
          id={id}
          name={id}
          // Let screen readers announce the error with the input
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={action ? 'input pr-12' : 'input'}
          {...inputProps}
        />
        {action}
      </div>

      {error && (
        <p
          id={errorId}
          role='alert'
          className='flex items-center gap-1.5 text-xs text-danger'
        >
          <AlertIcon className='w-3.5 h-3.5' />
          {error}
        </p>
      )}
    </div>
  )
}
