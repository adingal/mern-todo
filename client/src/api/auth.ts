import type { LoginValues } from '../utils/validation'

export interface AuthUser {
  id: string
  name: string
  email: string
  userType: 'user' | 'admin'
}

// Shared fetch wrapper: JSON in, JSON out, errors become thrown Errors.
// Relative URLs go through the Vite proxy in dev, so the jwt cookie is same-origin.
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // Some responses (e.g. a plain-text 429) aren't JSON, so don't let parsing throw
  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(body?.message ?? 'Something went wrong. Try again.')
  }

  return body.data as T
}

export const login = (values: LoginValues) =>
  request<{ user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: values.email.trim(),
      password: values.password,
    }),
  })
