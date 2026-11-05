import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { ApiError, getMe } from '../api/auth'

type Status = 'loading' | 'in' | 'out' | 'error'

export default function ProtectedRoute() {
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    // Ignore the result if the component unmounts mid-request
    let cancelled = false

    getMe()
      .then(() => !cancelled && setStatus('in'))
      .catch((err) => {
        if (cancelled) return
        // 401 means not logged in; anything else is a server or network problem
        setStatus(
          err instanceof ApiError && err.status === 401 ? 'out' : 'error',
        )
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'loading') return null
  if (status === 'out') return <Navigate to='/login' replace />

  if (status === 'error') {
    return (
      <p role='alert' className='p-6 text-sm text-danger'>
        Can't reach the server. Check your connection and refresh the page.
      </p>
    )
  }

  return <Outlet />
}
