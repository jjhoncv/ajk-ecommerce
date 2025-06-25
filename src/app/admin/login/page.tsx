// components/admin/AdminLogin.tsx
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function AdminLogin() {
  const { data: session, status } = useSession()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false // MUY IMPORTANTE: No hacer redirect
      })

      if (result?.error) {
        setError('Credenciales inválidas')
      }
      // Si es exitoso, useSession se actualizará automáticamente
      // y el componente padre (AdminPage) mostrará el dashboard
    } catch (error) {
      setError('Error al iniciar sesión')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">TechStore</h1>
            <p className="mt-2 text-gray-600">Panel de Administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={credentials.email}
                onChange={(e) => {
                  setCredentials((prev) => ({ ...prev, email: e.target.value }))
                }}
                placeholder="admin@techstore.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value
                  }))
                }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Acceso restringido solo para administradores
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
