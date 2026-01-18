import { type ProductVariantComplete } from '@/module/products/core'
import { type ProductDTO, type ProductVariantDTO } from '@/dto'
import { type ItemImage } from '@/shared'
import {
  type AttributeOptionImages,
  type ProductVariants,
  type VariantImages
} from '@/types/domain'

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
): Record<string, Set<string>> => {
  const attributeGroups: Record<string, Set<string>> = {}

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
  if (!variant?.images || variant.images.length === 0) {
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
  return !!variant?.promotionVariants?.length
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

export const getVariantImages = (variant: ProductVariants): ItemImage[] => {
  let images: ItemImage[] = []

  // 1. Primero intentar obtener imágenes directas de la variante
  if (variant.variantImages && variant.variantImages.length > 0) {
    const variantImages = variant.variantImages
      .filter((img): img is VariantImages => !!img)
      .map(
        (img): ItemImage => ({
          ...img,
          displayOrder: Number(img.displayOrder || 0)
        })
      )

    images = [...images, ...variantImages]
  }

  // 2. Luego obtener imágenes de attributeOptionImages
  if (
    variant.variantAttributeOptions &&
    variant.variantAttributeOptions.length > 0
  ) {
    const attributeImages: ItemImage[] = []

    variant.variantAttributeOptions.forEach((variantAttrOption) => {
      if (variantAttrOption?.productAttributeOption?.attributeOptionImages) {
        const attrOptionImages =
          variantAttrOption.productAttributeOption.attributeOptionImages
            .filter((img): img is AttributeOptionImages => !!img)
            .map(
              (img): ItemImage => ({
                // Omitir las propiedades que no están en ItemImage
                altText: img.altText,
                id: img.id,
                imageType: img.imageType,
                imageUrlNormal: img.imageUrlNormal,
                imageUrlThumb: img.imageUrlThumb,
                imageUrlZoom: img.imageUrlZoom,
                isPrimary: img.isPrimary,
                displayOrder: Number(img.displayOrder || 0)
              })
            )

        attributeImages.push(...attrOptionImages)
      }
    })

    images = [...images, ...attributeImages]
  }

  // 3. Si no hay imágenes, devolver imagen por defecto
  if (images.length === 0) {
    return [
      {
        imageType: 'front', // Ajusta según tu enum
        id: 0,
        imageUrlNormal: '/no-image.webp',
        imageUrlThumb: '/no-image.webp',
        imageUrlZoom: '/no-image.webp',
        displayOrder: 0,
        altText: null,
        isPrimary: null
      }
    ]
  }

  // 4. Eliminar duplicados por id (en caso de que haya imágenes repetidas)
  const uniqueImages = images.filter(
    (img, index, self) => index === self.findIndex((i) => i.id === img.id)
  )

  // 5. Ordenar: front primero, luego por displayOrder
  const sortedImages = uniqueImages.sort((a, b) => {
    // Priorizar imágenes tipo 'front'
    if (a.imageType === 'front' && b.imageType !== 'front') return -1
    if (b.imageType === 'front' && a.imageType !== 'front') return 1

    // Luego ordenar por displayOrder
    return a.displayOrder - b.displayOrder
  })

  return sortedImages
}

export const getImagesToProductCard = (
  variant: ProductVariantComplete
): ItemImage[] => {
  const images = getVariantImages(variant)
  return images
}

export const getThumbImageToProductCard = (
  variant: ProductVariantComplete
): string => {
  const images = getVariantImages(variant)
  if (images.length === 0) return '/no-image.webp'
  return images.find((img) => img.imageUrlThumb)?.imageUrlThumb || ''
}
