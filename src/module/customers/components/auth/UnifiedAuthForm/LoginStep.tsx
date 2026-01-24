'use client'

import { type JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'

interface LoginStepProps {
  email: string
  password: string
  isLoading: boolean
  isFormValid: boolean
  onPasswordChange: (password: string) => void
  onSubmit: () => void
  onBack: () => void
  onForgotPassword: () => void
}

export const LoginStep = ({
  email,
  password,
  isLoading,
  isFormValid,
  onPasswordChange,
  onSubmit,
  onBack,
  onForgotPassword
}: LoginStepProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const hasValue = password !== ''
  const isFloating = isFocused || hasValue

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

      {/* Email (readonly) */}
      <div className="relative">
        <input
          type="email"
          value={email}
          readOnly
          className="h-14 w-full border border-gray-200 bg-gray-50 px-4 pt-5 pb-2 text-base text-gray-600 outline-none"
        />
        <label className="pointer-events-none absolute left-4 top-2 text-xs text-gray-500">
          Correo electrónico
        </label>
      </div>

      {/* Password */}
      <div className="relative">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'peer h-14 w-full border bg-white px-4 pt-5 pb-2 pr-12 text-base outline-none transition-colors',
            'border-gray-300 focus:border-blue-500',
            isLoading && 'cursor-not-allowed opacity-50'
          )}
          placeholder=" "
          disabled={isLoading}
          autoComplete="current-password"
          autoFocus
        />
        <label
          htmlFor="password"
          className={cn(
            'pointer-events-none absolute left-4 transition-all duration-200',
            isFloating
              ? 'top-2 text-xs text-blue-500'
              : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
          )}
        >
          Contraseña
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Olvidé contraseña */}
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full bg-black py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Iniciando sesión...
          </span>
        ) : (
          'Iniciar sesión'
        )}
      </button>
    </form>
  )
}
