'use client'
import LoginCustomerForm from '@/components/LoginCustomerForm'
import RegisterCustomerForm from '@/components/RegisterCustomerForm'
import { Modal } from '@/components/ui/Modal'
import { ModalContent } from '@/components/ui/Modal/ModalContent'
import { ModalTitle } from '@/components/ui/Modal/ModalTitle'
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
  return (
    <>
      <Modal isOpen={isLoginOpen} onClose={closeAll} className="max-w-lg">
        <ModalTitle onClose={closeAll} title="Iniciar sesión" />
        <ModalContent>
          <LoginCustomerForm
            onSuccess={onLoginSuccess}
            onClose={closeAll}
            onSwitchToRegister={onSwitchToRegister}
          />
        </ModalContent>
      </Modal>
      <Modal isOpen={isRegisterOpen} onClose={closeAll} className="max-w-lg">
        <ModalTitle onClose={closeAll} title="Crear cuenta" />
        <ModalContent>
          <RegisterCustomerForm
            onSuccess={onRegisterSuccess}
            onClose={closeAll}
            onSwitchToLogin={onSwitchToLogin}
          />
        </ModalContent>
      </Modal>
    </>
  )
}
