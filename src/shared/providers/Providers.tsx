'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

import { ThemeProvider } from './ThemeProvider'

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  )
}
