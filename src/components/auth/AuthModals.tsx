'use client'
import LoginForm from '@/components/ui/LoginForm'
import { Modal } from '@/components/ui/Modal'
import { ModalContent } from '@/components/ui/Modal/ModalContent'
import { ModalTitle } from '@/components/ui/Modal/ModalTitle'
import RegisterForm from '@/components/ui/RegisterForm'

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
}: AuthModalsProps) {
  return (
    <>
      <Modal isOpen={isLoginOpen} onClose={closeAll} className="max-w-lg">
        <ModalTitle onClose={closeAll} title="Iniciar sesión" />
        <ModalContent>
          <LoginForm
            onSuccess={onLoginSuccess}
            onClose={closeAll}
            onSwitchToRegister={onSwitchToRegister}
          />
        </ModalContent>
      </Modal>
      <Modal isOpen={isRegisterOpen} onClose={closeAll} className="max-w-lg">
        <ModalTitle onClose={closeAll} title="Crear cuenta" />
        <ModalContent>
          <RegisterForm
            onSuccess={onRegisterSuccess}
            onClose={closeAll}
            onSwitchToLogin={onSwitchToLogin}
          />
        </ModalContent>
      </Modal>
    </>
  )
}
