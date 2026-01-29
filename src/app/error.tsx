'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

const isDev = process.env.NODE_ENV === 'development'

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Ocurrió un problema
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          Por favor intenta de nuevo.
        </p>

        {isDev && (
          <div className="mb-8 rounded-lg bg-gray-100 p-4 text-left">
            <p className="text-sm font-medium text-gray-700">
              Detalles del error:
            </p>
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

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="h-5 w-5" />
            Intentar de nuevo
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="h-5 w-5" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
