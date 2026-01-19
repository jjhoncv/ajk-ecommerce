// providers/Providers.tsx
'use client'
import { MiniCart } from '@/module/cart/components'
import { CartProvider } from '@/module/cart/providers'
import { AuthModalProvider } from '@/module/customers/providers'
import { ThemeProvider } from '@/module/shared/providers'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { type JSX, type ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}
export function Providers({ children }: ProvidersProps): JSX.Element {
  const pathname = usePathname()

  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <ThemeProvider>
      {isAdminRoute ? (
        <SessionProvider basePath="/api/auth/admin">
          <main>{children}</main>
        </SessionProvider>
      ) : (
        <SessionProvider basePath="/api/auth">
          <AuthModalProvider>
            <CartProvider>
              <main>
                {children}
                <MiniCart />
              </main>
            </CartProvider>
          </AuthModalProvider>
        </SessionProvider>
      )}
    </ThemeProvider>
  )
}
