import { useState } from 'react'
import FormField from './FormField'
import type { FormFieldProps } from './FormField'
import { EyeIcon, EyeOffIcon } from '../../assets/icons'

type PasswordFieldProps = Omit<FormFieldProps, 'type' | 'action'>

export default function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const iconClass = 'w-5 h-5 lg:w-[18px] lg:h-[18px]'

  return (
    <FormField
      {...props}
      type={visible ? 'text' : 'password'}
      action={
        <button
          type='button'
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          className='focus-ring absolute right-0 top-0 grid place-items-center w-12 h-12 lg:w-10 lg:h-10 text-neutral-600 hover:text-accent-700'
        >
          {visible ? (
            <EyeOffIcon className={iconClass} />
          ) : (
            <EyeIcon className={iconClass} />
          )}
        </button>
      }
    />
  )
}
