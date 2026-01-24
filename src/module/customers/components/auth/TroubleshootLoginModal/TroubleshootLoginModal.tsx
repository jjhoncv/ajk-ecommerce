'use client'

import { Modal, ModalContent } from '@/module/shared/components/Modal'
import { type JSX, useState } from 'react'
import { MainOptions } from './MainOptions'
import { ResetPasswordStep } from './ResetPasswordStep'
import { ResetPasswordCodeStep } from './ResetPasswordCodeStep'
import { NewPasswordStep } from './NewPasswordStep'
import { FindAccountStep } from './FindAccountStep'
import { AccountFoundStep } from './AccountFoundStep'
import { SuccessStep } from './SuccessStep'

type Step =
  | 'main'
  | 'reset-password'
  | 'reset-password-code'
  | 'new-password'
  | 'find-account'
  | 'account-found'
  | 'success'

interface TroubleshootLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FoundAccount {
  id: number
  email: string
  maskedEmail: string
  name: string
}

export const TroubleshootLoginModal = ({
  isOpen,
  onClose
}: TroubleshootLoginModalProps): JSX.Element => {
  const [step, setStep] = useState<Step>('main')
  const [email, setEmail] = useState('')
  const [foundAccount, setFoundAccount] = useState<FoundAccount | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const handleClose = () => {
    setStep('main')
    setEmail('')
    setFoundAccount(null)
    setSuccessMessage('')
    onClose()
  }

  const handleResetPasswordClick = () => {
    setStep('reset-password')
  }

  const handleFindAccountClick = () => {
    setStep('find-account')
  }

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail)
    setStep('reset-password-code')
  }

  const handleCodeVerified = () => {
    setStep('new-password')
  }

  const handlePasswordReset = () => {
    setSuccessMessage('Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.')
    setStep('success')
  }

  const handleAccountFound = (account: FoundAccount) => {
    setFoundAccount(account)
    setStep('account-found')
  }

  const handleSendResetFromFound = () => {
    if (foundAccount) {
      setEmail(foundAccount.email)
      setStep('reset-password-code')
    }
  }

  const handleBack = () => {
    switch (step) {
      case 'reset-password':
      case 'find-account':
        setStep('main')
        break
      case 'reset-password-code':
        setStep('reset-password')
        break
      case 'new-password':
        setStep('reset-password-code')
        break
      case 'account-found':
        setStep('find-account')
        break
      default:
        setStep('main')
    }
  }

  const getTitle = (): string => {
    switch (step) {
      case 'main':
        return '¿Tienes problemas al iniciar sesión?'
      case 'reset-password':
        return 'Restablecer contraseña'
      case 'reset-password-code':
        return 'Ingresa el código'
      case 'new-password':
        return 'Nueva contraseña'
      case 'find-account':
        return 'Encuentra tu cuenta'
      case 'account-found':
        return 'Cuenta encontrada'
      case 'success':
        return '¡Listo!'
      default:
        return '¿Tienes problemas al iniciar sesión?'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-sm"
      zIndex={10001}
    >
      <ModalContent className="p-5">
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">
          {getTitle()}
        </h2>

        {step === 'main' && (
          <MainOptions
            onResetPasswordClick={handleResetPasswordClick}
            onFindAccountClick={handleFindAccountClick}
            onClose={handleClose}
          />
        )}

        {step === 'reset-password' && (
          <ResetPasswordStep
            onSubmit={handleEmailSubmit}
            onBack={handleBack}
          />
        )}

        {step === 'reset-password-code' && (
          <ResetPasswordCodeStep
            email={email}
            onVerified={handleCodeVerified}
            onBack={handleBack}
          />
        )}

        {step === 'new-password' && (
          <NewPasswordStep
            email={email}
            onSuccess={handlePasswordReset}
            onBack={handleBack}
          />
        )}

        {step === 'find-account' && (
          <FindAccountStep
            onAccountFound={handleAccountFound}
            onBack={handleBack}
          />
        )}

        {step === 'account-found' && foundAccount && (
          <AccountFoundStep
            account={foundAccount}
            onSendReset={handleSendResetFromFound}
            onBack={handleBack}
          />
        )}

        {step === 'success' && (
          <SuccessStep
            message={successMessage}
            onClose={handleClose}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
