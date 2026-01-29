'use client'

import { Button } from '@/module/shared/components/Form/Input/Button'
import { Input } from '@/module/shared/components/Form/Input/Input'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type JSX, useEffect, useState } from 'react'

interface Section {
  id: number
  name: string
  url: string
}

interface RoleFormProps {
  roleId?: number
  isSystemRole?: boolean
  initialData?: {
    name: string
    sectionIds: number[]
  }
}

export function RoleForm({ roleId, isSystemRole = false, initialData }: RoleFormProps): JSX.Element {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [selectedSections, setSelectedSections] = useState<number[]>(
    initialData?.sectionIds ?? []
  )
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSections, setLoadingSections] = useState(true)

  useEffect(() => {
    const fetchSections = async (): Promise<void> => {
      try {
        const response = await fetch('/api/admin/sections')
        const data = await response.json()
        if (data.success) {
          setSections(data.data)
        }
      } catch (error) {
        ToastFail('Error al cargar las secciones')
      } finally {
        setLoadingSections(false)
      }
    }

    void fetchSections()
  }, [])

  const toggleSection = (sectionId: number): void => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const selectAll = (): void => {
    setSelectedSections(sections.map((s) => s.id))
  }

  const deselectAll = (): void => {
    setSelectedSections([])
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!isSystemRole && name.trim() === '') {
      ToastFail('El nombre del rol es requerido')
      return
    }

    setLoading(true)
    try {
      const message = await FetchCustomBody({
        data: {
          id: roleId,
          name: name.trim(),
          sectionIds: selectedSections
        },
        method: roleId != null ? 'PATCH' : 'POST',
        url: '/api/admin/roles'
      })
      ToastSuccess(message)
      router.push('/admin/roles')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al guardar el rol'
      ToastFail(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-6">
      {!isSystemRole && (
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">
            Información del Rol
          </h3>
          <div className="max-w-md">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nombre del rol
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Editor, Vendedor, Soporte..."
              className="bg-white"
            />
          </div>
        </div>
      )}

      {isSystemRole && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>Rol del sistema:</strong> {name}. Solo puedes modificar las secciones asignadas a este rol.
          </p>
        </div>
      )}

      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Secciones permitidas</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Seleccionar todas
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={deselectAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Deseleccionar todas
            </button>
          </div>
        </div>

        {loadingSections ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <label
                key={section.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                  selectedSections.includes(section.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    selectedSections.includes(section.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedSections.includes(section.id) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedSections.includes(section.id)}
                  onChange={() => toggleSection(section.id)}
                  className="sr-only"
                />
                <div>
                  <p className="font-medium text-gray-900">{section.name}</p>
                  <p className="text-xs text-gray-500">/admin{section.url}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {sections.length === 0 && !loadingSections && (
          <p className="py-8 text-center text-gray-500">
            No hay secciones disponibles
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          outline
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : roleId != null ? (
            'Actualizar rol'
          ) : (
            'Crear rol'
          )}
        </Button>
      </div>
    </form>
  )
}
