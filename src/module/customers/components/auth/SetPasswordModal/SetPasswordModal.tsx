'use client'

import { type JSX, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import { Modal, ModalContent } from '@/module/shared/components/Modal'

interface SetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const SetPasswordModal = ({
  isOpen,
  onClose,
  onSuccess
}: SetPasswordModalProps): JSX.Element => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmFocused, setConfirmFocused] = useState(false)

  // Validaciones de contraseña
  const passwordCriteria = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password)
  }), [password])

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ''
  const isFormValid = isPasswordValid && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar contraseña')
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={cn(
      'flex items-center gap-2 text-xs',
      met ? 'text-green-600' : 'text-gray-400'
    )}>
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {text}
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <ModalContent>
        <div className="p-6">
          <h2 className="mb-2 text-center text-xl font-semibold text-gray-900">
            Crea tu contraseña
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Configura una contraseña para acceder más rápido a tu cuenta
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Password */}
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className={cn(
                  'peer h-14 w-full border bg-white px-4 pt-5 pb-2 pr-12 text-base outline-none transition-colors',
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
                  passwordFocused || password
                    ? 'top-2 text-xs text-blue-500'
                    : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                )}
              >
                Nueva contraseña
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Criterios de contraseña */}
            <div className="space-y-1 pl-1">
              <CriteriaItem met={passwordCriteria.length} text="Al menos 8 caracteres" />
              <CriteriaItem met={passwordCriteria.uppercase} text="Una letra mayúscula" />
              <CriteriaItem met={passwordCriteria.lowercase} text="Una letra minúscula" />
              <CriteriaItem met={passwordCriteria.number} text="Un número" />
              <CriteriaItem met={passwordCriteria.special} text="Un carácter especial (!@#$%^&*)" />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                className={cn(
                  'peer h-14 w-full border bg-white px-4 pt-5 pb-2 pr-12 text-base outline-none transition-colors',
                  'border-gray-300 focus:border-blue-500',
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
                  confirmFocused || confirmPassword
                    ? 'top-2 text-xs text-blue-500'
                    : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                )}
              >
                Confirmar contraseña
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Indicador de coincidencia */}
            {confirmPassword && (
              <div className={cn(
                'flex items-center gap-2 text-xs pl-1',
                passwordsMatch ? 'text-green-600' : 'text-red-500'
              )}>
                {passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-black py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Guardando...
                </span>
              ) : (
                'Guardar contraseña'
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              Hacer esto después
            </button>
          </form>
        </div>
      </ModalContent>
    </Modal>
  )
}
