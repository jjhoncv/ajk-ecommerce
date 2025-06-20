'use client'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

interface LoginFormProps {
  onSuccess?: () => void
  onClose?: () => void
  onSwitchToRegister?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onClose,
  onSwitchToRegister
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Por favor, completa todos los campos')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (result?.error) {
        setError('Credenciales incorrectas')
      } else if (result?.ok) {
        if (onSuccess) onSuccess()
        if (onClose) onClose()
      }
    } catch {
      setError('Ocurrió un error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && <div className="mb-4 bg-red-50 p-3 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="usuario@ejemplo.com"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="text-primary hover:text-primary/80">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-medium text-primary hover:text-primary/80"
          >
            Regístrate
          </button>
        </p>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">O continúa con</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <span>Facebook</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
