'use client'

import { type JSX, useState } from 'react'
import { EmailStep } from './EmailStep'
import { LoginStep } from './LoginStep'
import { useUnifiedAuth } from './useUnifiedAuth'
import { VerifyCodeStep } from './VerifyCodeStep'
import { TroubleshootLoginModal } from '../TroubleshootLoginModal'

interface UnifiedAuthFormProps {
  onSuccess?: () => void
  onClose?: () => void
  onNeedsPasswordSetup?: () => void
}

export const UnifiedAuthForm = ({
  onSuccess,
  onClose,
  onNeedsPasswordSetup
}: UnifiedAuthFormProps): JSX.Element => {
  const [isTroubleshootOpen, setIsTroubleshootOpen] = useState(false)

  const {
    step,
    email,
    password,
    code,
    isLoading,
    error,
    countdown,
    isFormValid,
    setEmail,
    setPassword,
    setCode,
    handleCheckEmail,
    handleLogin,
    handleVerifyCode,
    handleResendCode,
    handleBack
  } = useUnifiedAuth({ onSuccess, onClose, onNeedsPasswordSetup })

  const getTitle = (): string => {
    switch (step) {
      case 'email':
        return 'Regístrate/Inicia sesión'
      case 'login':
        return 'Iniciar sesión'
      case 'verify':
        return 'Verificar correo'
      default:
        return 'Regístrate/Inicia sesión'
    }
  }

  return (
    <div className="w-full">
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
        {getTitle()}
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 'email' && (
        <EmailStep
          email={email}
          isLoading={isLoading}
          isFormValid={isFormValid}
          onEmailChange={setEmail}
          onSubmit={handleCheckEmail}
          onTroubleshootClick={() => setIsTroubleshootOpen(true)}
        />
      )}

      {step === 'login' && (
        <LoginStep
          email={email}
          password={password}
          isLoading={isLoading}
          isFormValid={isFormValid}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          onBack={handleBack}
          onForgotPassword={() => setIsTroubleshootOpen(true)}
        />
      )}

      {step === 'verify' && (
        <VerifyCodeStep
          email={email}
          code={code}
          isLoading={isLoading}
          isFormValid={isFormValid}
          countdown={countdown}
          onCodeChange={setCode}
          onSubmit={handleVerifyCode}
          onResendCode={handleResendCode}
          onBack={handleBack}
        />
      )}

      {/* Troubleshoot Login Modal */}
      <TroubleshootLoginModal
        isOpen={isTroubleshootOpen}
        onClose={() => setIsTroubleshootOpen(false)}
      />
    </div>
  )
}
