'use client'

import { AlertTriangle, Loader2, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { type FC, useEffect, useState } from 'react'
import { Button } from '../Form/Input/Button'

interface Dependency {
  label: string
  count: number
}

interface AlertProps {
  message: React.ReactNode
  title?: string
  onSuccess?: () => void
  onCancel?: () => void
  dependenciesUrl?: string
  dependenciesMap?: Record<string, string>
  blockOnDependencies?: boolean
  blockedMessage?: string
}

export const Alert: FC<AlertProps> = ({
  title,
  message,
  onSuccess,
  onCancel,
  dependenciesUrl,
  dependenciesMap,
  blockOnDependencies = false,
  blockedMessage
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [dependencies, setDependencies] = useState<Dependency[]>([])
  const [loadingDeps, setLoadingDeps] = useState(false)

  const open = searchParams.get('action') === 'alert'
  const itemId = searchParams.get('id')

  useEffect(() => {
    const fetchDependencies = async () => {
      if (!open || !itemId || !dependenciesUrl) return

      setLoadingDeps(true)
      try {
        const url = dependenciesUrl.replace('{id}', itemId)
        const response = await fetch(url)
        const data = await response.json()

        if (data.success && data.data) {
          const deps: Dependency[] = []
          const defaultLabels: Record<string, string> = {
            variants: 'Variantes',
            variantImages: 'Imágenes de variantes',
            attributeOptions: 'Opciones de atributos',
            categories: 'Categorías',
            ...dependenciesMap
          }

          for (const [key, count] of Object.entries(data.data)) {
            if (typeof count === 'number' && count > 0) {
              deps.push({
                label: defaultLabels[key] ?? key,
                count
              })
            }
          }
          setDependencies(deps)
        }
      } catch (error) {
        console.error('Error fetching dependencies:', error)
      } finally {
        setLoadingDeps(false)
      }
    }

    if (open) {
      void fetchDependencies()
    } else {
      setDependencies([])
    }
  }, [open, itemId, dependenciesUrl, dependenciesMap])

  const handleClose = () => {
    setDependencies([])
    onCancel?.()
  }

  if (!open) return null

  return (
    <div>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-black/30"
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl md:w-[450px]">
        <div className="p-2">
          <div className="relative px-3 py-3 font-semibold">
            {title ?? 'Confirmar eliminación'}
            <XIcon
              className="absolute right-2 top-2.5 cursor-pointer text-gray-500 hover:text-gray-700"
              size={24}
              strokeWidth={1.5}
              onClick={handleClose}
            />
          </div>
          <hr />

          <div className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-center text-gray-700">{message}</p>

              {loadingDeps && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando dependencias...
                </div>
              )}

              {!loadingDeps && dependencies.length > 0 && (
                <div className={`w-full rounded-lg border p-4 ${
                  blockOnDependencies
                    ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
                }`}>
                  <p className={`mb-2 text-sm font-medium ${
                    blockOnDependencies ? 'text-red-800' : 'text-amber-800'
                  }`}>
                    {blockOnDependencies
                      ? blockedMessage ?? 'No se puede eliminar. Primero elimina:'
                      : 'Se eliminarán también:'}
                  </p>
                  <ul className="space-y-1">
                    {dependencies.map((dep) => (
                      <li
                        key={dep.label}
                        className={`flex items-center justify-between text-sm ${
                          blockOnDependencies ? 'text-red-700' : 'text-amber-700'
                        }`}
                      >
                        <span>{dep.label}</span>
                        <span className="font-medium">{dep.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <hr />
          <div className="flex justify-end gap-3 p-4">
            {blockOnDependencies && dependencies.length > 0 ? (
              <Button type="button" onClick={handleClose}>
                Entendido
              </Button>
            ) : (
              <>
                {onCancel && (
                  <Button outline type="button" onClick={handleClose}>
                    Cancelar
                  </Button>
                )}
                {onSuccess && (
                  <Button
                    type="button"
                    onClick={onSuccess}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
