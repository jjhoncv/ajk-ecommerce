'use client'

import { type JSX, useState } from 'react'
import { ArrowLeft, Loader2, User, Mail } from 'lucide-react'

interface FoundAccount {
  id: number
  email: string
  maskedEmail: string
  name: string
}

interface AccountFoundStepProps {
  account: FoundAccount
  onSendReset: () => void
  onBack: () => void
}

export const AccountFoundStep = ({
  account,
  onSendReset,
  onBack
}: AccountFoundStepProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendReset = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al enviar el código')
        return
      }

      onSendReset()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="mb-2 text-center text-sm font-medium text-green-800">
          ¡Encontramos tu cuenta!
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Account Card */}
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <User className="h-7 w-7 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{account.name}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="h-3.5 w-3.5" />
              <span>{account.maskedEmail}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Te enviaremos un código de verificación a tu email para restablecer tu contraseña.
      </p>

      <button
        type="button"
        onClick={handleSendReset}
        disabled={isLoading}
        className="w-full bg-black py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando código...
          </span>
        ) : (
          'Enviar código de recuperación'
        )}
      </button>

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
