'use client'

import { type JSX, useState, useEffect, useRef } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface ResetPasswordCodeStepProps {
  email: string
  onVerified: () => void
  onBack: () => void
}

export const ResetPasswordCodeStep = ({
  email,
  onVerified,
  onBack
}: ResetPasswordCodeStepProps): JSX.Element => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newCode = [...code]
    newCode[index] = value.slice(-1) // Only take last character
    setCode(newCode)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when complete
    if (newCode.every(c => c !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (codeString: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeString })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Código inválido')
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }

      onVerified()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setCountdown(60)
        setCanResend(false)
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Error al reenviar el código')
    } finally {
      setIsLoading(false)
    }
  }

  // Mask email for display
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3')

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-gray-600">
        Hemos enviado un código de 6 dígitos a <span className="font-medium">{maskedEmail}</span>
      </p>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Code Input */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
            className="h-14 w-12 rounded-lg border border-gray-300 text-center text-2xl font-bold outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Verificando...
        </div>
      )}

      {/* Resend code */}
      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            Reenviar código
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            Reenviar código en {countdown}s
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="flex w-full items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>
    </div>
  )
}
