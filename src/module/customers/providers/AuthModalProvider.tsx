'use client'
import { AuthModals } from '@/module/customers/components/auth'
import React, { useState } from 'react'
import { AuthModalContext } from './AuthModal.context'
import { type AuthCallbacks } from './AuthModal.types'

interface AuthModalProviderProps {
  children: React.ReactNode
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [currentCallbacks, setCurrentCallbacks] = useState<AuthCallbacks>({})

  const openLogin = (callbacks: AuthCallbacks = {}) => {
    console.log(
      '🔐 Opening login modal with callbacks:',
      Object.keys(callbacks)
    )
    setCurrentCallbacks(callbacks)
    setIsLoginOpen(true)
    setIsRegisterOpen(false)
  }

  const openRegister = (callbacks: AuthCallbacks = {}) => {
    console.log(
      '📝 Opening register modal with callbacks:',
      Object.keys(callbacks)
    )
    setCurrentCallbacks(callbacks)
    setIsRegisterOpen(true)
    setIsLoginOpen(false)
  }

  const closeAll = () => {
    console.log('❌ Closing all auth modals')
    setIsLoginOpen(false)
    setIsRegisterOpen(false)

    // Ejecutar callback de cierre si existe
    if (currentCallbacks.onClose) {
      console.log('🔄 Executing onClose callback')
      currentCallbacks.onClose()
    }

    setCurrentCallbacks({})
  }

  const switchToRegister = () => {
    console.log('🔄 Switching to register')
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const switchToLogin = () => {
    console.log('🔄 Switching to login')
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const handleLoginSuccess = () => {
    console.log('✅ Login successful')
    setIsLoginOpen(false)

    // Ejecutar callback de éxito de login si existe
    if (currentCallbacks.onLoginSuccess) {
      console.log('🎯 Executing onLoginSuccess callback')
      currentCallbacks.onLoginSuccess()
    }

    setCurrentCallbacks({})
  }

  const handleRegisterSuccess = () => {
    console.log('✅ Register successful')
    setIsRegisterOpen(false)

    // Ejecutar callback de éxito de registro si existe
    if (currentCallbacks.onRegisterSuccess) {
      console.log('🎯 Executing onRegisterSuccess callback')
      currentCallbacks.onRegisterSuccess()
    }

    setCurrentCallbacks({})
  }

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister }}>
      {children}

      {/* 👈 MODAL DE LOGIN - Usando tu Modal con Portal */}
      <AuthModals
        closeAll={closeAll}
        isLoginOpen={isLoginOpen}
        isRegisterOpen={isRegisterOpen}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToRegister={switchToRegister}
        onSwitchToLogin={switchToLogin}
      />
    </AuthModalContext.Provider>
  )
}
