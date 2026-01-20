'use client'

import { signIn } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { z } from 'zod'

type AuthStep = 'email' | 'login' | 'verify'

interface UseUnifiedAuthProps {
  onSuccess?: () => void
  onClose?: () => void
  onNeedsPasswordSetup?: () => void
}

interface UseUnifiedAuthReturn {
  step: AuthStep
  email: string
  password: string
  code: string[]
  isLoading: boolean
  error: string | null
  countdown: number
  isFormValid: boolean
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setCode: (code: string[]) => void
  handleCheckEmail: () => Promise<void>
  handleLogin: () => Promise<void>
  handleVerifyCode: () => Promise<void>
  handleResendCode: () => Promise<void>
  handleBack: () => void
}

const emailSchema = z.string().email()
const passwordSchema = z.string().min(8)

export const useUnifiedAuth = ({
  onSuccess,
  onClose,
  onNeedsPasswordSetup
}: UseUnifiedAuthProps): UseUnifiedAuthReturn => {
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState<string[]>(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Timer para reenviar código
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Validación del formulario según el paso
  const isFormValid = useMemo(() => {
    switch (step) {
      case 'email':
        return emailSchema.safeParse(email).success
      case 'login':
        return emailSchema.safeParse(email).success && passwordSchema.safeParse(password).success
      case 'verify':
        return code.every(digit => digit !== '') && code.length === 4
      default:
        return false
    }
  }, [step, email, password, code])

  // Verificar si el email existe
  const handleCheckEmail = useCallback(async () => {
    if (!isFormValid) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar email')
      }

      if (data.exists) {
        // Usuario existe, ir a login
        setStep('login')
      } else {
        // Usuario nuevo, enviar código y ir a verificación
        await sendVerificationCode()
        setStep('verify')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar email')
    } finally {
      setIsLoading(false)
    }
  }, [email, isFormValid])

  // Enviar código de verificación
  const sendVerificationCode = async () => {
    const response = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Error al enviar código')
    }

    setCountdown(15)
  }

  // Login con contraseña
  const handleLogin = useCallback(async () => {
    if (!isFormValid) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (result?.error) {
        setError(result.error === 'CredentialsSignin'
          ? 'Contraseña incorrecta'
          : 'Error al iniciar sesión')
        return
      }

      if (result?.ok) {
        onSuccess?.()
        onClose?.()
      }
    } catch (err) {
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }, [email, password, isFormValid, onSuccess, onClose])

  // Verificar código y registrar
  const handleVerifyCode = useCallback(async () => {
    if (!isFormValid) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: code.join('')
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Código inválido')
      }

      // Iniciar sesión automáticamente después del registro
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password: data.tempPassword // El servidor genera una contraseña temporal
      })

      if (result?.ok) {
        // Primero llamar onNeedsPasswordSetup para que pueda verificar el ref
        // antes de que se limpie en onSuccess
        onNeedsPasswordSetup?.()
        // Luego llamar success que cierra el modal y ejecuta los callbacks
        onSuccess?.()
        // No llamar onClose aquí porque onSuccess ya cierra el modal
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido')
    } finally {
      setIsLoading(false)
    }
  }, [email, code, isFormValid, onSuccess, onNeedsPasswordSetup])

  // Reenviar código
  const handleResendCode = useCallback(async () => {
    if (countdown > 0) return

    setIsLoading(true)
    setError(null)

    try {
      await sendVerificationCode()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reenviar código')
    } finally {
      setIsLoading(false)
    }
  }, [countdown, email])

  // Volver al paso anterior
  const handleBack = useCallback(() => {
    setError(null)
    setPassword('')
    setCode(['', '', '', ''])
    setStep('email')
  }, [])

  return {
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
  }
}
