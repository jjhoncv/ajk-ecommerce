'use client'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

interface RegisterFormProps {
  onSuccess?: () => void
  onClose?: () => void
  onSwitchToLogin?: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onClose,
  onSwitchToLogin
}) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (
      !username ||
      !name ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError('Por favor, completa todos los campos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Enviar solicitud de registro
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          name,
          lastname,
          email,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar usuario')
        return
      }

      // Iniciar sesión automáticamente después del registro
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (result?.error) {
        setError('Error al iniciar sesión automáticamente')
      } else if (result?.ok) {
        if (onSuccess) onSuccess()
        if (onClose) onClose()
      }
    } catch {
      setError('Ocurrió un error al procesar la solicitud')
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
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="juanperez"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Juan"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="lastname"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Apellido
          </label>
          <input
            id="lastname"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Pérez"
            disabled={isLoading}
          />
        </div>

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

        <div className="mb-4">
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

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Registrando...
            </span>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium text-primary hover:text-primary/80"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
