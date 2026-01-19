import { type ItemImage } from '@/module/shared/types/shared'
import { type ProductVariants, type PromotionVariants } from '@/types/domain'

export interface CleanImage {
  id: number
  imageUrlNormal: string
  imageUrlThumb: string
  imageUrlZoom: string
  altText: string
  imageType: string
  isPrimary?: boolean
  displayOrder: number // ✅ Agregado
}

/**
 * Limpia y valida las imágenes para el ProductImageSlider
 * @param images Array de imágenes sin procesar
 * @param productName Nombre del producto para generar alt text
 * @returns Array de imágenes limpias y validadas
 */
export const cleanAndValidateImages = (
  images: ItemImage[],
  productName: string
): CleanImage[] => {
  if (!images || images.length === 0) {
    return []
  }

  return (
    images
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
        isPrimary: Boolean(image.isPrimary),
        displayOrder: image.displayOrder
      }))
      // ordenar por displayOrder
      .sort((a, b) => a.displayOrder - b.displayOrder)
  )
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
export const getImageTypeLabel = (imageType?: string): string => {
  if (!imageType) return ''
  const labels: Record<string, string> = {
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

  return labels[imageType || 'front'] || 'Imagen'
}

export const getPriceIfHasPromotion = (
  variant: Omit<
    ProductVariants,
    'productId' | 'sku' | 'createdAt' | 'updatedAt'
  >
): {
  hasPromotion: boolean
  finalPrice: number
  originalPrice: number
  type: string
  name: string
  currentPromotion?: PromotionVariants | null
  additionalCost: number
} => {
  // Calcular costos adicionales de los atributos
  const additionalCost = variant?.variantAttributeOptions?.reduce((total, vao) => {
    return total + (Number(vao?.additionalCost) || 0)
  }, 0) || 0

  // Precio base de la variante
  const basePrice = Number(variant?.price || 0)

  // Precio original = precio base + costos adicionales de atributos
  const originalPrice = basePrice + additionalCost

  // Obtener promoción activa de la variante actual
  const currentPromotion = variant?.promotionVariants?.[0]

  // Calcular precio con promoción (aplicar descuento sobre el precio total)
  const promotionPrice = currentPromotion
    ? Number(currentPromotion.promotionPrice) + additionalCost
    : null
  const finalPrice = promotionPrice || originalPrice

  return {
    finalPrice,
    hasPromotion: Boolean(currentPromotion),
    type: currentPromotion?.promotion?.type ?? '',
    name: currentPromotion?.promotion?.name ?? '',
    originalPrice,
    currentPromotion,
    additionalCost
  }
}
