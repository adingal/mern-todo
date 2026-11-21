import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/user'
import { LogoutIcon } from '../../assets/icons'

function UserDetails() {
  const { user, signOut } = useAuth()
  const initials = getInitials(user?.name ?? '')

  return (
    <div className='mt-auto flex flex-row items-center justify-between gap-4 border-t border-t-gray-200 pt-8'>
      <div className='flex flex-row items-center justify-start gap-4'>
        <div className='border border-gray-200 flex flex-row items-center justify-center max-w-1/4 py-3 px-6'>
          <p className='upcase font-bold font-heading'>{initials}</p>
        </div>
        <div>
          <p className='capitalize text-neutral-400'>{user?.name}</p>
          <p className='text-neutral-500 text-xs'>{user?.email}</p>
        </div>
      </div>
      <div className='flex flex-row items-center'>
        <button
          onClick={signOut}
          className='w-full cursor-pointer'
          type='button'
        >
          <LogoutIcon className='w-full h-6 text-neutral-500' />
        </button>
      </div>
    </div>
  )
}

export default UserDetails
