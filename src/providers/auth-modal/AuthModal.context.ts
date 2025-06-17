import { createContext } from 'react'
import { AuthModalContextType } from './AuthModal.types'

export const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
)
