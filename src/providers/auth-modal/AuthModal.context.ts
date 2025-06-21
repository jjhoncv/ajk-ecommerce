import { createContext } from 'react'
import { type AuthModalContextType } from './AuthModal.types'

export const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
)
