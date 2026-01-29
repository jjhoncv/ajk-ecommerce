'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
  backUrl?: string
  backLabel?: string
  moduleName?: string
}

const isDev = process.env.NODE_ENV === 'development'

export function ErrorPage({
  error,
  reset,
  backUrl = '/admin',
  backLabel = 'Volver al inicio',
  moduleName
}: ErrorPageProps) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          {isDev && moduleName ? `Error en ${moduleName}` : 'Ocurrió un problema'}
        </h1>

        <p className="mb-6 text-center text-gray-600">
          Por favor intenta de nuevo.
        </p>

        {isDev && (
          <div className="mb-6 rounded-md bg-gray-100 p-4">
            <p className="text-sm font-medium text-gray-700">Detalles:</p>
            <p className="mt-1 break-all text-sm text-red-600">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-gray-500">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Intentar de nuevo
          </button>

          <Link
            href={backUrl}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
