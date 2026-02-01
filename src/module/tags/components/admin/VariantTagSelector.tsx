'use client'

import { type Tags as Tag } from '@/types/domain'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { useRouter } from 'next/navigation'
import { useState, type FC } from 'react'

interface VariantTagSelectorProps {
  variantId: number
  availableTags: Tag[]
  selectedTagIds: number[]
}

export const VariantTagSelector: FC<VariantTagSelectorProps> = ({
  variantId,
  availableTags,
  selectedTagIds: initialSelectedTagIds
}) => {
  const router = useRouter()
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    initialSelectedTagIds
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/variants/${variantId}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tagIds: selectedTagIds })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al guardar tags')
      }

      ToastSuccess('Tags guardados correctamente')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido'
      ToastFail(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges =
    JSON.stringify(selectedTagIds.sort()) !==
    JSON.stringify(initialSelectedTagIds.sort())

  if (availableTags.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Tags de la Variante
        </h3>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            No hay tags disponibles.
          </p>
          <a
            href="/admin/tags/new"
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700"
          >
            + Crear primer tag
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tags de la Variante
        </h3>
        {hasChanges && (
          <span className="text-xs text-amber-600">Cambios sin guardar</span>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Selecciona los tags que se mostraran en esta variante
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {availableTags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id)
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              className={`
                flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium
                transition-all duration-200 border-2
                ${
                  isSelected
                    ? 'border-transparent text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
              style={{
                backgroundColor: isSelected ? tag.color : undefined
              }}
            >
              {isSelected && (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              <span
                className="h-3 w-3 rounded-full border border-white/30"
                style={{ backgroundColor: isSelected ? 'white' : tag.color }}
              />
              {tag.name}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-500">
          {selectedTagIds.length} tag(s) seleccionado(s)
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className={`
            rounded-lg px-4 py-2 text-sm font-medium
            transition-colors duration-200
            ${
              hasChanges
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Guardando...' : 'Guardar Tags'}
        </button>
      </div>
    </div>
  )
}
