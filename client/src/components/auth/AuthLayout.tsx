import type { ReactNode } from 'react'
import logo from '../../assets/logo_daymark.png'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-dvh flex flex-col lg:grid lg:grid-cols-2'>
      <aside className='relative flex flex-col justify-between gap-6 px-6 pt-6 pb-5 h-[200px] lg:h-auto lg:p-12 border-b lg:border-b-0 lg:border-r border-rule bg-grid bg-[length:40px_40px] lg:bg-[length:60px_60px] bg-[position:-1px_-1px]'>
        <a
          href='/'
          className='focus-ring self-start flex items-center gap-2.5 font-heading font-semibold text-lg lg:text-[22px] uppercase tracking-wide'
        >
          <img className='max-w-full h-10' src={logo} alt='Daymark' />
        </a>

        <div className='blueprint self-start bg-ground px-3.5 py-3 lg:p-7 lg:pb-5 lg:max-w-[440px]'>
          <p className='text-[10px] lg:text-[11px] tracking-[0.12em] uppercase text-accent-700 mb-1 lg:mb-2.5'>
            Today
          </p>
          <p className='font-heading font-semibold uppercase tracking-tight leading-[0.95] text-[34px] lg:text-[64px]'>
            Every task,
            <br />
            drawn to spec.
          </p>
          <p className='hidden lg:block mt-4 text-[15px] text-neutral-700 max-w-[340px]'>
            Plan the day in lists, check things off, and pick up where you left
            off on any device.
          </p>
        </div>

        <p className='hidden lg:block text-[11px] tracking-[0.08em] uppercase text-neutral-600'>
          v1.0 · © {new Date().getFullYear()} Daymark
        </p>
      </aside>

      <main className='flex-1 flex lg:items-center lg:justify-center px-6 pt-7 pb-6 lg:p-12'>
        {children}
      </main>
    </div>
  )
}
