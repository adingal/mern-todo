import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import PasswordField from '../components/auth/PasswordField'
import { useLoginForm } from '../hooks/useLoginForm'
import { MIN_PASSWORD_LENGTH } from '../utils/validation'

interface LoginProps {
  onSuccess?: () => void
}

export default function Login({ onSuccess }: LoginProps) {
  const {
    values,
    serverError,
    isSubmitting,
    getError,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useLoginForm(onSuccess)

  return (
    <AuthLayout>
      <form
        id='login'
        noValidate
        onSubmit={handleSubmit}
        className='w-full lg:max-w-[380px] flex flex-col gap-[18px] lg:gap-5'
      >
        <div>
          <h1 className='font-heading font-semibold text-[32px] lg:text-[36px] leading-tight tracking-tight'>
            Log in
          </h1>
          <p className='text-sm text-neutral-700'>
            Welcome back. Enter your details to continue.
          </p>
        </div>

        {serverError && (
          <p role='alert' className='text-sm text-danger'>
            {serverError}
          </p>
        )}

        <FormField
          id='email'
          label='Email'
          type='email'
          autoComplete='email'
          placeholder='you@example.com'
          required
          value={values.email}
          error={getError('email')}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <PasswordField
          id='password'
          label='Password'
          autoComplete='current-password'
          placeholder='••••••••'
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={values.password}
          error={getError('password')}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <button
          type='submit'
          disabled={isSubmitting}
          className='blueprint focus-ring h-[52px] lg:h-11 bg-accent border-accent text-ground font-heading font-semibold text-[17px] lg:text-base uppercase tracking-[0.04em] transition-colors hover:bg-accent-600 active:bg-accent-700 disabled:opacity-45'
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className='mt-auto lg:mt-0 text-sm text-neutral-700 text-center'>
          No account yet?{' '}
          <a
            href='/signup'
            className='focus-ring text-accent-700 hover:text-accent-800 underline underline-offset-2'
          >
            Create one
          </a>
        </p>
      </form>
    </AuthLayout>
  )
}
