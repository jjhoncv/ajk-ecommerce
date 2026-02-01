'use client'

import { useCallback, useEffect, useState } from 'react'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'

interface Tag {
  id: number
  name: string
  slug: string
  color: string
  isActive: boolean
}

interface VariantTagsSelectorProps {
  variantId: number
}

export function VariantTagsSelector({ variantId }: VariantTagsSelectorProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load available tags and current variant tags
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load all active tags
        const tagsRes = await fetch('/api/admin/tags')
        const tagsData = await tagsRes.json()
        if (tagsData.success && tagsData.data) {
          setAvailableTags(tagsData.data.filter((t: Tag) => t.isActive))
        }

        // Load current variant tags
        const variantTagsRes = await fetch(`/api/admin/variants/${variantId}/tags`)
        const variantTagsData = await variantTagsRes.json()
        if (variantTagsData.success && variantTagsData.data) {
          setSelectedTagIds(variantTagsData.data.map((t: Tag) => t.id))
        }
      } catch (error) {
        console.error('Error loading tags:', error)
        ToastFail('Error al cargar los tags')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [variantId])

  // Toggle tag selection
  const toggleTag = useCallback((tagId: number) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }, [])

  // Save tags
  const saveTags = useCallback(async () => {
    try {
      setSaving(true)
      const res = await fetch(`/api/admin/variants/${variantId}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagIds: selectedTagIds })
      })

      const data = await res.json()
      if (data.success) {
        ToastSuccess('Tags guardados correctamente')
      } else {
        ToastFail(data.error || 'Error al guardar tags')
      }
    } catch (error) {
      console.error('Error saving tags:', error)
      ToastFail('Error al guardar los tags')
    } finally {
      setSaving(false)
    }
  }, [variantId, selectedTagIds])

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Tags de la Variante</h3>
        <div className="animate-pulse">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 w-20 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Tags de la Variante</h3>

      {availableTags.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hay tags disponibles.{' '}
          <a href="/admin/tags/new" className="text-blue-600 hover:underline">
            Crear un tag
          </a>
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-600">
            Selecciona los tags que se mostrarán en esta variante:
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {availableTags.map(tag => {
              const isSelected = selectedTagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    isSelected
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: isSelected ? tag.color : undefined
                  }}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={saveTags}
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Tags'}
          </button>
        </>
      )}
    </div>
  )
}
