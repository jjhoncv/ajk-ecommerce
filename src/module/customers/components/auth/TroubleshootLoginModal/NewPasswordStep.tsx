'use client'

import { type JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowLeft, Eye, EyeOff, Loader2, Check, X } from 'lucide-react'

interface NewPasswordStepProps {
  email: string
  onSuccess: () => void
  onBack: () => void
}

export const NewPasswordStep = ({
  email,
  onSuccess,
  onBack
}: NewPasswordStepProps): JSX.Element => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Password requirements
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ''

  const isValidPassword = hasMinLength && hasUppercase && hasLowercase && hasNumber && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidPassword) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al restablecer la contraseña')
        return
      }

      onSuccess()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-300" />
      )}
      <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-gray-600">
        Crea una nueva contraseña segura para tu cuenta.
      </p>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* New Password */}
        <div className="relative">
          <input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              'h-14 w-full border bg-white px-4 pr-12 pb-2 pt-5 text-base outline-none transition-colors',
              'border-gray-300 focus:border-blue-500',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            placeholder=" "
            disabled={isLoading}
            autoComplete="new-password"
          />
          <label
            htmlFor="new-password"
            className={cn(
              'pointer-events-none absolute left-4 transition-all duration-200',
              password
                ? 'top-2 text-xs text-blue-500'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            )}
          >
            Nueva contraseña
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Password Requirements */}
        {password && (
          <div className="space-y-1 rounded-lg bg-gray-50 p-3">
            <RequirementItem met={hasMinLength} text="Mínimo 8 caracteres" />
            <RequirementItem met={hasUppercase} text="Una mayúscula" />
            <RequirementItem met={hasLowercase} text="Una minúscula" />
            <RequirementItem met={hasNumber} text="Un número" />
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(
              'h-14 w-full border bg-white px-4 pr-12 pb-2 pt-5 text-base outline-none transition-colors',
              'border-gray-300 focus:border-blue-500',
              confirmPassword && !passwordsMatch && 'border-red-500',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            placeholder=" "
            disabled={isLoading}
            autoComplete="new-password"
          />
          <label
            htmlFor="confirm-password"
            className={cn(
              'pointer-events-none absolute left-4 transition-all duration-200',
              confirmPassword
                ? 'top-2 text-xs text-blue-500'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            )}
          >
            Confirmar contraseña
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {confirmPassword && !passwordsMatch && (
          <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !isValidPassword}
          className="w-full bg-black py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Guardando...
            </span>
          ) : (
            'Restablecer contraseña'
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
