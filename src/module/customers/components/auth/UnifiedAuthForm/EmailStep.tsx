'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { type JSX, useState } from 'react'

interface EmailStepProps {
  email: string
  isLoading: boolean
  isFormValid: boolean
  onEmailChange: (email: string) => void
  onSubmit: () => void
  onTroubleshootClick: () => void
}

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export const EmailStep = ({
  email,
  isLoading,
  isFormValid,
  onEmailChange,
  onSubmit,
  onTroubleshootClick
}: EmailStepProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = email !== ''
  const isFloating = isFocused || hasValue

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' })
  }

  const handleFacebookLogin = () => {
    signIn('facebook', { callbackUrl: '/' })
  }

  return (
    <div className="space-y-6">
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
              'peer h-14 w-full border bg-white px-4 pb-2 pt-5 text-base outline-none transition-colors',
              'border-gray-300 focus:border-blue-500',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            placeholder=" "
            disabled={isLoading}
            autoComplete="email"
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
            Email
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

        {/* Troubleshoot link */}
        <button
          type="button"
          onClick={onTroubleshootClick}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          ¿Tienes problemas al iniciar sesión?
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">O continúa con</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={handleFacebookLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </button>
      </div>

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
    </div>
  )
}
