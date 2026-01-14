'use client'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { ImagePlusIcon, Star, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type FC, useEffect, useState } from 'react'
import { DialogAssets } from '@/module/shared/components/FormCreate/DialogAssets'
import { type FileServer } from '@/module/shared/components/FormCreate/types/fileManagement'
import { VariantImageFileOptions } from './variantImageFileOptions'

interface VariantImage {
  id: number
  variantId?: number
  attributeOptionId?: number
  imageType: string
  imageUrlThumb: string
  imageUrlNormal: string
  imageUrlZoom: string
  isPrimary: boolean
  displayOrder: number
  altText?: string
}

interface VariantImageManagerProps {
  variantId: number
  productId: number
  imageAttributeId?: number | null
  imageAttributeOptionId?: number
  initialImages?: VariantImage[]
}

export const VariantImageManager: FC<VariantImageManagerProps> = ({
  variantId,
  productId,
  imageAttributeId,
  imageAttributeOptionId,
  initialImages = []
}) => {
  const router = useRouter()
  const [images, setImages] = useState<VariantImage[]>(initialImages)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<VariantImage | null>(null)

  // Cargar imágenes al montar o cuando cambian los parámetros de imagen
  useEffect(() => {
    loadImages()
  }, [variantId, imageAttributeId, imageAttributeOptionId])

  const loadImages = async () => {
    try {
      setLoading(true)

      // Si usa atributo para controlar imágenes, cargar desde attribute_option_images
      if (imageAttributeId && imageAttributeOptionId) {
        const response = await fetch(
          `/api/admin/attributes/${imageAttributeId}/options/${imageAttributeOptionId}/images?productId=${productId}`
        )
        const result = await response.json()
        if (result.success) {
          setImages(result.data || [])
        }
      } else {
        // Si no, cargar imágenes propias de la variante
        const response = await fetch(
          `/api/admin/products/${productId}/variants/${variantId}/images`
        )
        const result = await response.json()
        if (result.success) {
          setImages(result.data || [])
        }
      }
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFiles = async (files: FileServer[]) => {
    try {
      setLoading(true)

      // Determinar la URL según si usa atributo o no
      const baseUrl = imageAttributeId && imageAttributeOptionId
        ? `/api/admin/attributes/${imageAttributeId}/options/${imageAttributeOptionId}/images`
        : `/api/admin/products/${productId}/variants/${variantId}/images`

      // Subir cada imagen seleccionada
      for (const file of files) {
        const formData = new FormData()
        formData.append('imageType', 'front')
        formData.append('imageUrlThumb', file.path)
        formData.append('imageUrlNormal', file.path)
        formData.append('imageUrlZoom', file.path)
        formData.append('displayOrder', images.length.toString())
        formData.append('isPrimary', images.length === 0 ? 'true' : 'false')
        formData.append('altText', file.name)

        // Si usa atributo, enviar productId
        if (imageAttributeId && imageAttributeOptionId) {
          formData.append('productId', productId.toString())
        }

        await FetchCustomBody({
          url: baseUrl,
          method: 'POST',
          data: formData,
          withFiles: true
        })
      }

      ToastSuccess('Imágenes agregadas exitosamente')
      await loadImages()
      setDialogOpen(false)
    } catch (error: any) {
      ToastFail(error.message || 'Error al agregar imágenes')
    } finally {
      setLoading(false)
    }
  }

  const handleSetPrimary = async (imageId: number) => {
    try {
      setLoading(true)

      // Determinar la URL según si usa atributo o no
      const baseUrl = imageAttributeId && imageAttributeOptionId
        ? `/api/admin/attributes/${imageAttributeId}/options/${imageAttributeOptionId}/images/actions`
        : `/api/admin/products/${productId}/variants/${variantId}/images/actions`

      // Si usa atributo, incluir productId en los datos
      const actionData = imageAttributeId && imageAttributeOptionId
        ? { imageId, productId }
        : { imageId }

      await FetchCustomBody({
        url: baseUrl,
        method: 'POST',
        data: {
          action: 'setPrimary',
          data: actionData
        },
        withFiles: false
      })

      ToastSuccess('Imagen marcada como principal')
      await loadImages()
    } catch (error: any) {
      ToastFail(error.message || 'Error al marcar imagen como principal')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (imageId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    try {
      setLoading(true)

      // Determinar la URL según si usa atributo o no
      const baseUrl = imageAttributeId && imageAttributeOptionId
        ? `/api/admin/attributes/${imageAttributeId}/options/${imageAttributeOptionId}/images`
        : `/api/admin/products/${productId}/variants/${variantId}/images`

      await FetchCustomBody({
        url: baseUrl,
        method: 'DELETE',
        data: { id: imageId },
        withFiles: false
      })

      ToastSuccess('Imagen eliminada exitosamente')
      await loadImages()
    } catch (error: any) {
      ToastFail(error.message || 'Error al eliminar imagen')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAltText = async (imageId: number, altText: string) => {
    try {
      const formData = new FormData()
      formData.append('id', imageId.toString())
      formData.append('altText', altText)

      // Determinar la URL según si usa atributo o no
      const baseUrl = imageAttributeId && imageAttributeOptionId
        ? `/api/admin/attributes/${imageAttributeId}/options/${imageAttributeOptionId}/images`
        : `/api/admin/products/${productId}/variants/${variantId}/images`

      await FetchCustomBody({
        url: baseUrl,
        method: 'PATCH',
        data: formData,
        withFiles: true
      })

      ToastSuccess('Texto alternativo actualizado')
      await loadImages()
    } catch (error: any) {
      ToastFail(error.message || 'Error al actualizar')
    }
  }

  // Ordenar imágenes por displayOrder y isPrimary
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1
    if (!a.isPrimary && b.isPrimary) return 1
    return a.displayOrder - b.displayOrder
  })

  return (
    <div className="space-y-4">
      {/* Mensaje informativo si se usa atributo para controlar imágenes */}
      {imageAttributeId && imageAttributeOptionId && (
        <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">
            ℹ️ Gestión de imágenes por atributo
          </p>
          <p className="mt-1 text-xs text-blue-700">
            Las imágenes que agregues aquí se asociarán a la opción de atributo seleccionada.
            Todas las variantes que compartan esta opción mostrarán las mismas imágenes.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {imageAttributeId && imageAttributeOptionId
              ? 'Imágenes del atributo'
              : 'Imágenes de la variante'}
          </h3>
          <p className="text-sm text-gray-500">
            {images.length} imagen{images.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          disabled={loading}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          <ImagePlusIcon size={20} />
          Agregar imágenes
        </button>
      </div>

      {/* Grid de imágenes */}
      {loading && images.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <ImagePlusIcon size={40} className="text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            {imageAttributeId && imageAttributeOptionId
              ? 'No hay imágenes configuradas para esta opción de atributo.'
              : 'No hay imágenes. Click en "Agregar imágenes" para comenzar.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sortedImages.map((image) => (
            <div
              key={image.id}
              className={`group relative rounded-lg border-2 bg-white p-2 transition-all ${
                image.isPrimary
                  ? 'border-yellow-400 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Badge de imagen principal */}
              {image.isPrimary && (
                <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded bg-yellow-400 px-2 py-1 text-xs font-semibold text-yellow-900">
                  <Star size={12} fill="currentColor" />
                  Principal
                </div>
              )}

              {/* Imagen */}
              <div className="relative aspect-square overflow-hidden rounded">
                <Image
                  src={image.imageUrlThumb}
                  alt={image.altText || 'Imagen de variante'}
                  fill
                  className="object-cover"
                />

                {/* Overlay con acciones */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {!image.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(image.id)}
                      className="rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                      title="Marcar como principal"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="rounded bg-red-500 p-2 text-white hover:bg-red-600"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Alt text editable */}
              <div className="mt-2">
                <input
                  type="text"
                  value={image.altText || ''}
                  onChange={(e) => {
                    // Actualizar localmente primero para UX
                    setImages(
                      images.map((img) =>
                        img.id === image.id
                          ? { ...img, altText: e.target.value }
                          : img
                      )
                    )
                  }}
                  onBlur={(e) => {
                    handleUpdateAltText(image.id, e.target.value)
                  }}
                  placeholder="Texto alternativo..."
                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Info adicional */}
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>{image.imageType}</span>
                <span>#{image.displayOrder}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog para agregar imágenes */}
      {dialogOpen && (
        <DialogAssets
          open={dialogOpen}
          setOpenDialog={setDialogOpen}
          addFilesToForm={(field, files) => {
            handleAddFiles(files)
          }}
          field={{
            key: 'variant_images',
            label: 'Imágenes de variante',
            type: 'file',
            multiple: true,
            options: VariantImageFileOptions
          }}
        />
      )}
    </div>
  )
}
