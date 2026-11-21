import type { LoginValues } from '../utils/validation'
import { request } from './request'

export interface AuthUser {
  id: string
  name: string
  email: string
  userType: 'user' | 'admin'
}

// Login
export const login = (values: LoginValues) =>
  request<{ user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: values.email.trim(),
      password: values.password,
    }),
  })

// Logout
export const logout = () =>
  request<unknown>('/api/auth/logout', { method: 'POST' })

// Get logged in user
export const getMe = () => request<{ user: AuthUser }>('/api/auth/me')
