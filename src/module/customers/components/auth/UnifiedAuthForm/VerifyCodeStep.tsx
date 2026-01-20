'use client'

import { type JSX, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface VerifyCodeStepProps {
  email: string
  code: string[]
  isLoading: boolean
  isFormValid: boolean
  countdown: number
  onCodeChange: (code: string[]) => void
  onSubmit: () => void
  onResendCode: () => void
  onBack: () => void
}

export const VerifyCodeStep = ({
  email,
  code,
  isLoading,
  isFormValid,
  countdown,
  onCodeChange,
  onSubmit,
  onResendCode,
  onBack
}: VerifyCodeStepProps): JSX.Element => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const shouldAutoSubmitRef = useRef(false)

  // Focus en el primer input al montar
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Auto-submit cuando el formulario es válido (4 dígitos completos)
  useEffect(() => {
    if (isFormValid && shouldAutoSubmitRef.current && !isLoading) {
      shouldAutoSubmitRef.current = false
      onSubmit()
    }
  }, [isFormValid, isLoading, onSubmit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const handleChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    onCodeChange(newCode)

    // Auto-focus al siguiente input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Marcar para auto-submit cuando se ingresa el 4to dígito
    if (value && index === 3 && newCode.every(digit => digit !== '')) {
      shouldAutoSubmitRef.current = true
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: borrar y volver al anterior
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    if (!/^\d+$/.test(pastedData)) return

    const newCode = [...code]
    pastedData.split('').forEach((digit, index) => {
      if (index < 4) newCode[index] = digit
    })
    onCodeChange(newCode)

    // Focus en el último input con valor o el siguiente vacío
    const lastIndex = Math.min(pastedData.length, 3)
    inputRefs.current[lastIndex]?.focus()

    // Marcar para auto-submit si se pegaron 4 dígitos
    if (pastedData.length === 4) {
      shouldAutoSubmitRef.current = true
    }
  }

  // Ocultar parte del email
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3')

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Botón volver */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        Cambiar correo
      </button>

      {/* Mensaje */}
      <div className="text-center">
        <p className="text-gray-700">
          Introduce el código de 4 dígitos enviado a
        </p>
        <p className="font-medium text-gray-900">{maskedEmail}</p>
      </div>

      {/* Inputs de código */}
      <div className="flex justify-center gap-3">
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
            onPaste={handlePaste}
            className={cn(
              'h-14 w-14 border-2 bg-white text-center text-2xl font-semibold outline-none transition-colors',
              'border-gray-300 focus:border-blue-500',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            disabled={isLoading}
          />
        ))}
      </div>

      {/* Reenviar código */}
      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-gray-500">
            Reenviar código en {countdown}s
          </p>
        ) : (
          <button
            type="button"
            onClick={onResendCode}
            className="text-sm text-blue-600 hover:underline"
            disabled={isLoading}
          >
            Reenviar código
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full bg-black py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Verificando...
          </span>
        ) : (
          'Registrarme'
        )}
      </button>
    </form>
  )
}
