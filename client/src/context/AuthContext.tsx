import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getMe, logout as logoutRequest } from '../api/auth'
import { ApiError } from '../api/request'
import type { AuthUser } from '../api/auth'

type Status = 'loading' | 'in' | 'out' | 'error'

interface AuthContextValue {
  user: AuthUser | null
  status: Status
  signIn: (user: AuthUser) => void // call after a successful login
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  // Ask the server who we are once, when the app loads.
  // The jwt cookie is httpOnly, so this is the only way to know.
  useEffect(() => {
    let cancelled = false

    getMe()
      .then(({ user }) => {
        if (cancelled) return
        setUser(user)
        setStatus('in')
      })
      .catch((err) => {
        if (cancelled) return
        // 401 means logged out; anything else is a server or network problem
        setStatus(
          err instanceof ApiError && err.status === 401 ? 'out' : 'error',
        )
      })

    return () => {
      cancelled = true
    }
  }, [])

  const signIn = (user: AuthUser) => {
    setUser(user)
    setStatus('in')
  }

  const signOut = async () => {
    await logoutRequest() // the server clears the cookie
    setUser(null)
    setStatus('out')
  }

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook that fails loudly if a component is used outside the provider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
