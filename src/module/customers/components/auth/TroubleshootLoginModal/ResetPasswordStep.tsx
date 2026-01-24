'use client'

import { type JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface ResetPasswordStepProps {
  onSubmit: (email: string) => void
  onBack: () => void
}

export const ResetPasswordStep = ({
  onSubmit,
  onBack
}: ResetPasswordStepProps): JSX.Element => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const isFloating = isFocused || email !== ''
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al enviar el código')
        return
      }

      onSubmit(email)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-gray-600">
        Ingresa tu email y te enviaremos un código de 6 dígitos para restablecer tu contraseña.
      </p>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="relative">
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'peer h-14 w-full border bg-white px-4 pb-2 pt-5 text-base outline-none transition-colors',
              'border-gray-300 focus:border-blue-500',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            placeholder=" "
            disabled={isLoading}
            autoComplete="email"
          />
          <label
            htmlFor="reset-email"
            className={cn(
              'pointer-events-none absolute left-4 transition-all duration-200',
              isFloating
                ? 'top-2 text-xs text-blue-500'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            )}
          >
            Email
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isValidEmail}
          className="w-full bg-black py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Enviando código...
            </span>
          ) : (
            'Enviar código'
          )}
        </button>
      </form>

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
