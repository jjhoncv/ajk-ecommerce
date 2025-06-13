import { AttributeOptionImagesSlider } from './ProductImageSlider/ProductImage.interfaces'

export interface CleanImage {
  id: number
  imageUrlNormal: string
  imageUrlThumb: string
  imageUrlZoom: string
  altText: string
  imageType: string
  isPrimary?: boolean
}

/**
 * Limpia y valida las imágenes para el ProductImageSlider
 * @param images Array de imágenes sin procesar
 * @param productName Nombre del producto para generar alt text
 * @returns Array de imágenes limpias y validadas
 */
export const cleanAndValidateImages = (
  images: AttributeOptionImagesSlider[],
  productName: string
): CleanImage[] => {
  if (!images || images.length === 0) {
    return []
  }

  return images
    .filter((image) => image && image.imageUrlNormal) // Filtrar imágenes válidas
    .map((image, index) => ({
      id: image.id,
      imageUrlNormal: image.imageUrlNormal || '/no-image.webp',
      imageUrlThumb:
        image.imageUrlThumb || image.imageUrlNormal || '/no-image.webp',
      imageUrlZoom:
        image.imageUrlZoom || image.imageUrlNormal || '/no-image.webp',
      altText: image.altText || `${productName} - Imagen ${index + 1}`,
      imageType: image.imageType || 'front',
      isPrimary: Boolean(image.isPrimary)
    }))
}

/**
 * Encuentra el índice de la imagen principal
 * @param images Array de imágenes limpias
 * @returns Índice de la imagen principal o 0 si no se encuentra
 */
export const findPrimaryImageIndex = (images: CleanImage[]): number => {
  const primaryIndex = images.findIndex((img) => img.isPrimary)
  return primaryIndex !== -1 ? primaryIndex : 0
}

/**
 * Obtiene el texto del tipo de imagen en español
 * @param imageType Tipo de imagen
 * @returns Texto en español del tipo de imagen
 */
export const getImageTypeLabel = (imageType: string): string => {
  const typeLabels: Record<string, string> = {
    front: 'Frontal',
    back: 'Trasera',
    left: 'Lateral Izq.',
    right: 'Lateral Der.',
    top: 'Superior',
    bottom: 'Inferior',
    detail: 'Detalle',
    lifestyle: 'Lifestyle',
    packaging: 'Empaque'
  }

  return typeLabels[imageType] || 'Vista'
}
