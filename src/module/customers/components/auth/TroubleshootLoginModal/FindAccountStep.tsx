'use client'

import { type JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface FoundAccount {
  id: number
  email: string
  maskedEmail: string
  name: string
}

interface FindAccountStepProps {
  onAccountFound: (account: FoundAccount) => void
  onBack: () => void
}

export const FindAccountStep = ({
  onAccountFound,
  onBack
}: FindAccountStepProps): JSX.Element => {
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const isFloating = isFocused || searchValue !== ''
  const isValidInput = searchValue.length >= 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidInput) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/find-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: searchValue })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'No se encontró ninguna cuenta')
        return
      }

      onAccountFound(data.account)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-gray-600">
        Ingresa tu email o número de teléfono para buscar tu cuenta.
      </p>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="relative">
          <input
            id="find-account"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'peer h-14 w-full border bg-white px-4 pb-2 pt-5 text-base outline-none transition-colors',
              'border-gray-300 focus:border-blue-500',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            placeholder=" "
            disabled={isLoading}
          />
          <label
            htmlFor="find-account"
            className={cn(
              'pointer-events-none absolute left-4 transition-all duration-200',
              isFloating
                ? 'top-2 text-xs text-blue-500'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            )}
          >
            Email o teléfono
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isValidInput}
          className="w-full bg-black py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Buscando...
            </span>
          ) : (
            'Buscar cuenta'
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
