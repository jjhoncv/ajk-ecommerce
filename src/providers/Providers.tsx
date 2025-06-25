// providers/Providers.tsx
'use client'
import MiniCart from '@/components/ui/MiniCart'
import { AuthModalProvider } from '@/providers/auth-modal'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { type JSX, type ReactNode } from 'react'
import { CartProvider } from './cart/CartProvider'
import { ThemeProvider } from './theme/ThemeProvider'

interface ProvidersProps {
  children: ReactNode
}
export function Providers({ children }: ProvidersProps): JSX.Element {
  const pathname = usePathname()

  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <ThemeProvider>
      {/* 🔧 Usar el mismo basePath para ambos */}
      <SessionProvider basePath="/api/auth">
        {isAdminRoute ? (
          // 🚫 Admin: Solo lo esencial
          <main>{children}</main>
        ) : (
          // ✅ Commerce: Stack completo
          <AuthModalProvider>
            <CartProvider>
              <main>
                {children}
                <MiniCart />
              </main>
            </CartProvider>
          </AuthModalProvider>
        )}
      </SessionProvider>
    </ThemeProvider>
  )
}
