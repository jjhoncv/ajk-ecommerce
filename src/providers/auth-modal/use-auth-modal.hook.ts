// hooks/useAuthModal.ts
import { useContext } from 'react'
import { AuthModalContext } from './AuthModal.context'

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}
