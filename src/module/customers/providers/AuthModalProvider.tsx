'use client'
import { Modal, ModalContent } from '@/module/shared/components/Modal'
import { UnifiedAuthForm } from '@/module/customers/components/auth/UnifiedAuthForm'
import { SetPasswordModal } from '@/module/customers/components/auth/SetPasswordModal'
import React, { useState, useRef } from 'react'
import { AuthModalContext } from './AuthModal.context'
import { type AuthCallbacks } from './AuthModal.types'

interface AuthModalProviderProps {
  children: React.ReactNode
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false)
  const [currentCallbacks, setCurrentCallbacks] = useState<AuthCallbacks>({})
  // Ref para rastrear si hay callbacks de redirección (checkout flow)
  const hasRedirectCallbackRef = useRef(false)

  const openLogin = (callbacks: AuthCallbacks = {}) => {
    setCurrentCallbacks(callbacks)
    // Guardar si hay callbacks de redirección
    hasRedirectCallbackRef.current = !!(callbacks.onLoginSuccess || callbacks.onRegisterSuccess)
    setIsAuthOpen(true)
  }

  // openRegister ahora es lo mismo que openLogin (flujo unificado)
  const openRegister = (callbacks: AuthCallbacks = {}) => {
    setCurrentCallbacks(callbacks)
    hasRedirectCallbackRef.current = !!(callbacks.onLoginSuccess || callbacks.onRegisterSuccess)
    setIsAuthOpen(true)
  }

  const closeAll = () => {
    setIsAuthOpen(false)

    if (currentCallbacks.onClose) {
      currentCallbacks.onClose()
    }

    setCurrentCallbacks({})
    hasRedirectCallbackRef.current = false
  }

  const handleAuthSuccess = () => {
    setIsAuthOpen(false)

    // Ejecutar callback de éxito
    if (currentCallbacks.onLoginSuccess) {
      currentCallbacks.onLoginSuccess()
    } else if (currentCallbacks.onRegisterSuccess) {
      currentCallbacks.onRegisterSuccess()
    }

    setCurrentCallbacks({})
  }

  const handleNeedsPasswordSetup = () => {
    // Solo mostrar modal de contraseña si no hay callbacks de redirección
    // (es decir, si el usuario NO viene del flujo de compra/checkout)
    if (!hasRedirectCallbackRef.current) {
      setIsSetPasswordOpen(true)
    }

    // Resetear el ref
    hasRedirectCallbackRef.current = false
  }

  const handleSetPasswordSuccess = () => {
    setIsSetPasswordOpen(false)
  }

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister }}>
      {children}

      {/* Modal de autenticación unificado */}
      <Modal
        isOpen={isAuthOpen}
        onClose={closeAll}
        className="max-w-xl"
      >
        <ModalContent className="p-6">
          <UnifiedAuthForm
            onSuccess={handleAuthSuccess}
            onClose={closeAll}
            onNeedsPasswordSetup={handleNeedsPasswordSetup}
          />
        </ModalContent>
      </Modal>

      {/* Modal para configurar contraseña */}
      <SetPasswordModal
        isOpen={isSetPasswordOpen}
        onClose={() => setIsSetPasswordOpen(false)}
        onSuccess={handleSetPasswordSuccess}
      />
    </AuthModalContext.Provider>
  )
}
