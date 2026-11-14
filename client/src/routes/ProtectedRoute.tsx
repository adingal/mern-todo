import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'loading') return null // or a spinner
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
