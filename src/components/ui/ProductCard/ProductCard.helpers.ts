import { ProductDTO, ProductVariantDTO } from '@/dto'
import { AttributeOptionImages, VariantAttributeOptions } from '@/types/domain'
import { ProductVariantComplete } from '../../../backend/product-variant/ProductVariant.model'

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
  return (
    !!variant.promotion ||
    (!!variant.promotionVariants && variant.promotionVariants.length > 0)
  )
}

/**
 * Calcula el precio final de una variante considerando promociones
 * @param variant Variante a calcular
 * @returns El precio final de la variante
 */
export const calculateFinalPrice = (
  variant: ProductDTO['variants'][0]
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

export const getVariantTitle = (
  product: { name: string },
  selectedVariant: ProductVariantComplete
) => {
  const baseTitle = product.name

  // Obtener los atributos de la variante
  const variantAttributes = selectedVariant.variantAttributeOptions
    ?.map((variantAttr: VariantAttributeOptions | null) => {
      // Verificar que variantAttr no sea null
      if (!variantAttr) return null
      // Obtener el valor del atributo desde attributeOptions
      const attributeOption = variantAttr.attributeOptions?.[0]
      return attributeOption?.value
    })
    .filter(Boolean) // Filtrar valores undefined/null
    .join(' - ')

  // Si hay atributos, agregarlos al título
  if (variantAttributes && variantAttributes.length > 0) {
    return `${baseTitle} - ${variantAttributes}`
  }

  return baseTitle
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

export const getVariantImages = (
  selectedVariant: ProductVariantComplete,
  product: { name: string; mainImage?: string }
) => {
  // Primero intentar con variantImages
  if (
    selectedVariant.variantImages &&
    selectedVariant.variantImages.length > 0
  ) {
    return selectedVariant.variantImages.map((img) => ({
      alt: product.name,
      url: img?.imageUrlNormal || img?.imageUrlThumb || '',
      isPrimary: !!img?.isPrimary
    }))
  }

  // Si no hay variantImages, filtrar attributeImages según los atributos de la variante
  if (
    selectedVariant.attributeImages &&
    selectedVariant.attributeImages.length > 0 &&
    selectedVariant.variantAttributeOptions &&
    selectedVariant.variantAttributeOptions.length > 0
  ) {
    // Obtener los attributeOptionIds de la variante
    const variantAttributeOptionIds =
      selectedVariant.variantAttributeOptions.map(
        (attr) => attr.attributeOptionId
      )

    // Filtrar solo las imágenes que corresponden a los atributos de esta variante
    const filteredImages = selectedVariant.attributeImages.filter(
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

      return sortedImages.map((img: AttributeOptionImages, index: number) => ({
        alt: product.name,
        url: img?.imageUrlNormal || img?.imageUrlThumb || '',
        isPrimary: index === 0 || img.imageType === 'front'
      }))
    }
  }

  // Fallback a mainImage del producto o imagen por defecto
  return [
    {
      alt: product.name,
      url: product.mainImage || '/no-image.webp',
      isPrimary: true
    }
  ]
}

export const getThumbImage = (
  selectedVariant: ProductVariantComplete,
  product: { name: string; mainImage?: string }
) => {
  // Primero intentar con variantImages
  if (
    selectedVariant.variantImages &&
    selectedVariant.variantImages.length > 0
  ) {
    const primaryImage = selectedVariant.variantImages.find(
      (img) => img?.isPrimary
    )
    return (
      primaryImage?.imageUrlThumb ||
      selectedVariant.variantImages[0]?.imageUrlThumb ||
      ''
    )
  }

  // Si no hay variantImages, filtrar attributeImages según los atributos de la variante
  if (
    selectedVariant.attributeImages &&
    selectedVariant.attributeImages.length > 0 &&
    selectedVariant.variantAttributeOptions &&
    selectedVariant.variantAttributeOptions.length > 0
  ) {
    // Obtener los attributeOptionIds de la variante
    const variantAttributeOptionIds =
      selectedVariant.variantAttributeOptions.map(
        (attr) => attr.attributeOptionId
      )

    // Filtrar solo las imágenes que corresponden a los atributos de esta variante
    const filteredImages = selectedVariant.attributeImages.filter(
      (img: AttributeOptionImages) =>
        variantAttributeOptionIds.includes(img.attributeOptionId)
    )

    if (filteredImages.length > 0) {
      // Priorizar imagen 'front' si existe
      const frontImage = filteredImages.find(
        (img: AttributeOptionImages) => img.imageType === 'front'
      )

      if (frontImage) {
        return frontImage.imageUrlThumb || ''
      }

      // Si no hay front, usar la primera imagen filtrada
      return filteredImages[0]?.imageUrlThumb || ''
    }
  }

  // Fallback a mainImage del producto
  return product.mainImage || '/no-image.webp'
}
