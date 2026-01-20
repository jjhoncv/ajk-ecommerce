'use client'
import { LoginCustomerForm, RegisterCustomerForm } from '@/module/customers/components/auth'
import { Modal, ModalContent, ModalTitle } from '@/module/shared/components/Modal'
import { cn } from '@/lib/utils'
import { type JSX } from 'react'

interface AuthModalsProps {
  isLoginOpen: boolean
  isRegisterOpen: boolean
  closeAll: () => void
  onLoginSuccess: () => void
  onRegisterSuccess: () => void
  onSwitchToRegister: () => void
  onSwitchToLogin: () => void
}

export function AuthModals({
  isLoginOpen,
  isRegisterOpen,
  closeAll,
  onLoginSuccess,
  onRegisterSuccess,
  onSwitchToRegister,
  onSwitchToLogin
}: AuthModalsProps): JSX.Element {
  // Un solo modal abierto cuando cualquiera de los dos está activo
  const isOpen = isLoginOpen || isRegisterOpen
  const isLogin = isLoginOpen

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAll}
      className={cn(
        'transition-[max-width] duration-200',
        isLogin ? 'max-w-lg' : 'max-w-2xl'
      )}
    >
      <ModalTitle
        onClose={closeAll}
        title={isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
      />
      <ModalContent>
        {isLogin ? (
          <LoginCustomerForm
            onSuccess={onLoginSuccess}
            onClose={closeAll}
            onSwitchToRegister={onSwitchToRegister}
          />
        ) : (
          <RegisterCustomerForm
            onSuccess={onRegisterSuccess}
            onClose={closeAll}
            onSwitchToLogin={onSwitchToLogin}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
