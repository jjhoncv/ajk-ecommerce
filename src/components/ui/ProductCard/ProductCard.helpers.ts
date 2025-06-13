import { ProductVariantComplete } from '@/backend/product-variant'
import { ProductDTO, ProductVariantDTO } from '@/dto'
import { ItemImage } from '@/shared'
import { AttributeOptionImages } from '@/types/domain'

/**
 * Calcula el precio mínimo de las variantes de un producto
 * @param variants Variantes del producto
 * @param basePrice Precio base del producto
 * @returns El precio mínimo de las variantes o el precio base si no hay variantes
 */
export const calculateMinVariantPrice = (
  variants: ProductDTO['variants'],
  basePrice: number
): number => {
  if (!variants || variants.length === 0) return basePrice

  const prices = variants.map((variant) => {
    // Si hay promoción, usar el precio promocional
    if (variant.promotion && variant.promotion.promotionPrice !== null) {
      return Number(variant.promotion.promotionPrice)
    }
    return Number(variant.price)
  })

  return Math.min(...prices)
}

/**
 * Calcula el precio máximo de las variantes de un producto
 * @param variants Variantes del producto
 * @param basePrice Precio base del producto
 * @returns El precio máximo de las variantes o el precio base si no hay variantes
 */
export const calculateMaxVariantPrice = (
  variants: ProductDTO['variants'],
  basePrice: number
): number => {
  if (!variants || variants.length === 0) return basePrice

  const prices = variants.map((variant) => Number(variant.price))
  return Math.max(...prices)
}

/**
 * Agrupa los atributos de las variantes por nombre
 * @param variants Variantes del producto
 * @returns Un objeto con los atributos agrupados por nombre
 */
export const groupAttributesByName = (
  variants: ProductDTO['variants']
): { [key: string]: Set<string> } => {
  const attributeGroups: { [key: string]: Set<string> } = {}

  variants.forEach((variant) => {
    variant.attributes.forEach((attr) => {
      if (!attributeGroups[attr.name]) {
        attributeGroups[attr.name] = new Set()
      }
      attributeGroups[attr.name].add(attr.value)
    })
  })

  return attributeGroups
}

/**
 * Encuentra la imagen principal de una variante
 * @param variant Variante del producto
 * @param mainProductImage Imagen principal del producto
 * @returns La URL de la imagen principal
 */
export const findMainImage = (
  variant: ProductDTO['variants'][0],
  mainProductImage: string | null
): string => {
  if (!variant || !variant.images || variant.images.length === 0) {
    return (
      mainProductImage ||
      'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image'
    )
  }

  const primaryImage = variant.images.find((img) => img.isPrimary)
  return primaryImage
    ? primaryImage.imageUrlThumb || primaryImage.imageUrlNormal
    : variant.images[0].imageUrlThumb || variant.images[0].imageUrlNormal
}

/**
 * Verifica si una variante tiene promoción
 * @param variant Variante a verificar
 * @returns true si la variante tiene promoción
 */
export const hasPromotion = (variant: ProductVariantComplete): boolean => {
  return !!variant.promotion
}

/**
 * Calcula el precio final de una variante considerando promociones
 * @param variant Variante a calcular
 * @returns El precio final de la variante
 */
export const calculateFinalPrice = (
  variant: ProductVariantComplete
): number => {
  if (variant.promotion && variant.promotion.promotionPrice !== null) {
    return Number(variant.promotion.promotionPrice)
  }
  return Number(variant.price)
}

/**
 * Calcula el porcentaje de descuento de una variante
 * @param variant Variante a calcular
 * @returns El porcentaje de descuento o 0 si no hay promoción
 */
export const calculateDiscountPercentage = (
  variant: ProductDTO['variants'][0]
): number => {
  if (!variant.promotion) return 0

  if (variant.promotion.discountType === 'percentage') {
    return variant.promotion.discountValue
  }

  const originalPrice = Number(variant.price)
  const promotionPrice =
    variant.promotion.promotionPrice ||
    originalPrice - variant.promotion.discountValue

  return Math.round(((originalPrice - promotionPrice) / originalPrice) * 100)
}

export const getPromotionDiscount = (
  variant: ProductVariantDTO
): null | number => {
  // Si no hay promoción, no mostrar nada
  if (!variant.promotion) {
    return null
  }

  const promotion = variant.promotion
  const originalPrice = variant.price
  const promotionPrice = promotion.promotionPrice || 0

  // Calcular el porcentaje de descuento
  const discountPercentage =
    promotion.discountType === 'percentage'
      ? promotion.discountValue
      : Math.round(((originalPrice - promotionPrice) / originalPrice) * 100)

  return discountPercentage
}

export const getVariantImagesOrAttributeOptionImages = (
  productVariant: ProductVariantComplete
): ItemImage[] => {
  if (productVariant.variantImages && productVariant.variantImages.length > 0) {
    const sortImages = productVariant.variantImages.sort((a, b) => {
      if (a.imageType === 'front' && b.imageType !== 'front') return -1
      if (b.imageType === 'front' && a.imageType !== 'front') return 1
      return (a.displayOrder || 0) - (b.displayOrder || 0)
    })
    return sortImages
  }

  // Si no hay variantImages, filtrar attributeImages según los atributos de la variante
  if (
    productVariant.attributeImages &&
    productVariant.attributeImages.length > 0 &&
    productVariant.variantAttributeOptions &&
    productVariant.variantAttributeOptions.length > 0
  ) {
    // Obtener los attributeOptionIds de la variante
    const variantAttributeOptionIds =
      productVariant.variantAttributeOptions.map(
        (attr) => attr.attributeOptionId
      )

    // Filtrar solo las imágenes que corresponden a los atributos de esta variante
    const filteredImages = productVariant.attributeImages.filter(
      (img: AttributeOptionImages) =>
        variantAttributeOptionIds.includes(img.attributeOptionId)
    )

    if (filteredImages.length > 0) {
      // Ordenar: front primero, luego por displayOrder
      const sortedImages = filteredImages.sort(
        (a: AttributeOptionImages, b: AttributeOptionImages) => {
          if (a.imageType === 'front' && b.imageType !== 'front') return -1
          if (b.imageType === 'front' && a.imageType !== 'front') return 1
          return (a.displayOrder || 0) - (b.displayOrder || 0)
        }
      )

      return sortedImages
    }
  }

  return [
    {
      imageType: 'front',
      id: 0,
      imageUrlNormal: '/no-image.webp',
      imageUrlThumb: '/no-image.webp',
      imageUrlZoom: '/no-image.webp'
    }
  ]
}

export const getImagesToProductCard = (
  productVariant: ProductVariantComplete
): ItemImage[] => {
  const images = getVariantImagesOrAttributeOptionImages(productVariant)
  return images
}

export const getThumbImage = (
  productVariant: ProductVariantComplete
): string => {
  const images = getVariantImagesOrAttributeOptionImages(productVariant)
  if (images.length === 0) return '/no-image.webp'
  return images.find((img) => img.imageUrlThumb)?.imageUrlThumb || ''
}
