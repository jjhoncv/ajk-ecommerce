'use client'

import { Button } from '@/module/shared/components/Form/Input/Button'
import { Input } from '@/module/shared/components/Form/Input/Input'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { type JSX, Suspense, useEffect, useState } from 'react'

function SetupPasswordContent(): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [userName, setUserName] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const validateToken = async (): Promise<void> => {
      if (token == null || token === '') {
        setValidating(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/setup-password?token=${token}`)
        const data = await response.json()

        if (data.success && data.valid) {
          setTokenValid(true)
          setUserName(data.data.name)
        }
      } catch (error) {
        console.error('Error validating token:', error)
      } finally {
        setValidating(false)
      }
    }

    void validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (password.length < 6) {
      ToastFail('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      ToastFail('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await FetchCustomBody({
        data: { token, password },
        method: 'POST',
        url: '/api/auth/setup-password'
      })
      setSuccess(true)
      ToastSuccess('Contraseña configurada exitosamente')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al configurar contraseña'
      ToastFail(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          Validando enlace...
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">
            Enlace inválido o expirado
          </h1>
          <p className="mb-6 text-gray-600">
            El enlace para configurar tu contraseña ha expirado o no es válido.
            Por favor, contacta al administrador para que te envíe un nuevo
            enlace.
          </p>
          <Link
            href="/admin"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">
            ¡Contraseña configurada!
          </h1>
          <p className="mb-6 text-gray-600">
            Tu contraseña ha sido configurada exitosamente. Ya puedes iniciar
            sesión con tu email y la nueva contraseña.
          </p>
          <Link
            href="/admin"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Configura tu contraseña
            </h1>
            <p className="mt-2 text-gray-600">
              Hola {userName}, crea una contraseña segura para tu cuenta.
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className="bg-white"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Configurar contraseña'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          AJK E-commerce Admin
        </p>
      </div>
    </div>
  )
}

export default function SetupPasswordPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <SetupPasswordContent />
    </Suspense>
  )
}
