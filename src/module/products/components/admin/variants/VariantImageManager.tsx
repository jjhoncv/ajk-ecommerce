'use client'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { ImagePlusIcon, Star, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type FC, useEffect, useState } from 'react'
import { DialogAssets } from '@/module/shared/components/FormCreate/DialogAssets'
import { type FileServer } from '@/module/shared/components/FormCreate/types/fileManagement'
import { VariantImageFileOptions } from './variantImageFileOptions'

const IMAGE_TYPES = [
  { value: 'front', label: 'Frontal' },
  { value: 'back', label: 'Posterior' },
  { value: 'side', label: 'Lateral' },
  { value: 'detail', label: 'Detalle' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'packaging', label: 'Empaque' }
]

interface PendingFile {
  file: FileServer
  imageType: string
}

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
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [showTypeSelector, setShowTypeSelector] = useState(false)

  // Cargar imágenes al montar o cuando cambian los parámetros de imagen
  useEffect(() => {
    loadImages()
  }, [variantId, imageAttributeId, imageAttributeOptionId])

  const loadImages = async () => {
    try {
      setLoading(true)

      // Si usa atributo para controlar imágenes, cargar desde product_attribute_option_images
      if (imageAttributeId && imageAttributeOptionId) {
        const response = await fetch(
          `/api/admin/products/${productId}/attribute-options/${imageAttributeOptionId}/images`
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

  // Cuando el usuario selecciona archivos, mostramos el selector de tipo
  const handleSelectFiles = (files: FileServer[]) => {
    // Obtener tipos ya usados por imágenes existentes
    const usedTypes = new Set(images.map(img => img.imageType))

    // Asignar tipos por defecto que no estén usados
    const newPendingFiles: PendingFile[] = []

    for (const file of files) {
      // Buscar el primer tipo disponible
      let defaultType = 'front'
      for (const type of IMAGE_TYPES) {
        if (!usedTypes.has(type.value)) {
          defaultType = type.value
          break
        }
      }
      usedTypes.add(defaultType) // Marcar como usado para el siguiente archivo

      newPendingFiles.push({
        file,
        imageType: defaultType
      })
    }

    setPendingFiles(newPendingFiles)
    setDialogOpen(false)
    setShowTypeSelector(true)
  }

  // Actualizar el tipo de una imagen pendiente
  const handleUpdatePendingType = (index: number, newType: string) => {
    setPendingFiles(prev =>
      prev.map((pf, i) => i === index ? { ...pf, imageType: newType } : pf)
    )
  }

  // Remover un archivo pendiente
  const handleRemovePending = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index))
    if (pendingFiles.length <= 1) {
      setShowTypeSelector(false)
    }
  }

  // Confirmar y subir las imágenes con sus tipos
  const handleConfirmUpload = async () => {
    try {
      setLoading(true)

      // Determinar la URL según si usa atributo o no
      const baseUrl = imageAttributeId && imageAttributeOptionId
        ? `/api/admin/products/${productId}/attribute-options/${imageAttributeOptionId}/images`
        : `/api/admin/products/${productId}/variants/${variantId}/images`

      // Subir cada imagen con su tipo seleccionado
      for (let i = 0; i < pendingFiles.length; i++) {
        const { file, imageType } = pendingFiles[i]
        const formData = new FormData()
        formData.append('imageType', imageType)
        formData.append('imageUrlThumb', file.path)
        formData.append('imageUrlNormal', file.path)
        formData.append('imageUrlZoom', file.path)
        formData.append('displayOrder', (images.length + i).toString())
        formData.append('isPrimary', (images.length === 0 && i === 0) ? 'true' : 'false')
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
      setPendingFiles([])
      setShowTypeSelector(false)
      await loadImages()
    } catch (error: any) {
      ToastFail(error.message || 'Error al agregar imágenes')
    } finally {
      setLoading(false)
    }
  }

  // Cancelar la selección
  const handleCancelUpload = () => {
    setPendingFiles([])
    setShowTypeSelector(false)
  }

  const handleSetPrimary = async (imageId: number) => {
    try {
      setLoading(true)

      // Determinar la URL según si usa atributo o no
      const baseUrl = imageAttributeId && imageAttributeOptionId
        ? `/api/admin/products/${productId}/attribute-options/${imageAttributeOptionId}/images/actions`
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
        ? `/api/admin/products/${productId}/attribute-options/${imageAttributeOptionId}/images`
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
        ? `/api/admin/products/${productId}/attribute-options/${imageAttributeOptionId}/images`
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
          onClick={() => { setDialogOpen(true) }}
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
                      onClick={async () => { await handleSetPrimary(image.id) }}
                      className="rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                      title="Marcar como principal"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    onClick={async () => { await handleDelete(image.id) }}
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

      {/* Dialog para seleccionar imágenes del servidor */}
      {dialogOpen && (
        <DialogAssets
          open={dialogOpen}
          setOpenDialog={setDialogOpen}
          addFilesToForm={(field, files) => {
            handleSelectFiles(files)
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

      {/* Modal para asignar tipo de imagen */}
      {showTypeSelector && (
        <>
          <div
            onClick={handleCancelUpload}
            className="fixed inset-0 z-40 bg-black/50"
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl md:w-[500px]">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">Asignar tipo de imagen</h3>
              <button
                onClick={handleCancelUpload}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              <p className="mb-4 text-sm text-gray-600">
                Selecciona el tipo para cada imagen antes de agregarlas.
              </p>

              <div className="space-y-4">
                {pendingFiles.map((pf, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg border p-3"
                  >
                    {/* Preview de la imagen */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={pf.file.path}
                        alt={pf.file.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Nombre del archivo */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{pf.file.name}</p>

                      {/* Selector de tipo */}
                      <select
                        value={pf.imageType}
                        onChange={(e) => handleUpdatePendingType(index, e.target.value)}
                        className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        {IMAGE_TYPES.map((type) => {
                          const isUsed = images.some(img => img.imageType === type.value) ||
                            pendingFiles.some((p, i) => i !== index && p.imageType === type.value)
                          return (
                            <option
                              key={type.value}
                              value={type.value}
                              disabled={isUsed}
                            >
                              {type.label} {isUsed ? '(en uso)' : ''}
                            </option>
                          )
                        })}
                      </select>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleRemovePending(index)}
                      className="rounded p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t p-4">
              <button
                onClick={handleCancelUpload}
                className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={loading || pendingFiles.length === 0}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Subiendo...' : `Agregar ${pendingFiles.length} imagen${pendingFiles.length !== 1 ? 'es' : ''}`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
