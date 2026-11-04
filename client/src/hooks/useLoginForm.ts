import { useState } from 'react'
import type { ChangeEvent, FocusEvent, FormEvent } from 'react'
import { login } from '../api/auth'
import { validateLogin } from '../utils/validation'
import type { LoginValues } from '../utils/validation'

const INITIAL_VALUES: LoginValues = { email: '', password: '' }

type Touched = Partial<Record<keyof LoginValues, boolean>>

export function useLoginForm(onSuccess?: () => void) {
  const [values, setValues] = useState<LoginValues>(INITIAL_VALUES)
  const [touched, setTouched] = useState<Touched>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived on every render, so it never gets out of sync with `values`
  const errors = validateLogin(values)

  // Only show a field's error after the user has left it (or tried to submit)
  const getError = (name: keyof LoginValues) =>
    touched[name] ? errors[name] : undefined

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setServerError(null) // clear the old server message once they edit
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Reveal every error, then stop if anything is invalid
    setTouched({ email: true, password: true })
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    setServerError(null)

    try {
      await login(values)
      onSuccess?.()
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    serverError,
    isSubmitting,
    getError,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
