// types/auth-modal.ts
export interface AuthCallbacks {
  onLoginSuccess?: () => void
  onRegisterSuccess?: () => void
  onClose?: () => void
}

export interface AuthModalContextType {
  openLogin: (callbacks?: AuthCallbacks) => void
  openRegister: (callbacks?: AuthCallbacks) => void
}
