export interface LoginValues {
  email: string
  password: string
}

// One optional message per field
export type LoginErrors = Partial<Record<keyof LoginValues, string>>

export const MIN_PASSWORD_LENGTH = 8

// Simple format check. The server runs the real validation.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin({ email, password }: LoginValues): LoginErrors {
  const errors: LoginErrors = {}

  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }

  return errors
}
