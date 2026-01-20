'use client'

import { type JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface EmailStepProps {
  email: string
  isLoading: boolean
  isFormValid: boolean
  onEmailChange: (email: string) => void
  onSubmit: () => void
}

export const EmailStep = ({
  email,
  isLoading,
  isFormValid,
  onEmailChange,
  onSubmit
}: EmailStepProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = email !== ''
  const isFloating = isFocused || hasValue

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="relative">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'peer h-14 w-full border bg-white px-4 pt-5 pb-2 text-base outline-none transition-colors',
            'border-gray-300 focus:border-blue-500',
            isLoading && 'cursor-not-allowed opacity-50'
          )}
          placeholder=" "
          disabled={isLoading}
          autoComplete="email"
          autoFocus
        />
        <label
          htmlFor="email"
          className={cn(
            'pointer-events-none absolute left-4 transition-all duration-200',
            isFloating
              ? 'top-2 text-xs text-blue-500'
              : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
          )}
        >
          Correo electrónico
        </label>
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
          'Continuar'
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Al continuar, aceptas nuestros{' '}
        <a href="/terminos" className="text-blue-600 hover:underline">
          Términos de servicio
        </a>{' '}
        y{' '}
        <a href="/privacidad" className="text-blue-600 hover:underline">
          Política de privacidad
        </a>
      </p>
    </form>
  )
}
