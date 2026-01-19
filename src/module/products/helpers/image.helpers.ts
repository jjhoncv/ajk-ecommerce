import { type ProductVariantComplete } from '@/module/products/core'
import { type ItemImage } from '@/module/shared/types/shared'
import { type AttributeOptionImages, type ProductVariants } from '@/types/domain'

// Función helper para normalizar las imágenes a ItemImage
const normalizeToItemImage = (img: any): ItemImage => ({
  id: img.id || 0,
  imageType: img.imageType || 'front',
  imageUrlNormal: img.imageUrlNormal || '/no-image.webp',
  imageUrlThumb: img.imageUrlThumb || '/no-image.webp',
  imageUrlZoom: img.imageUrlZoom || '/no-image.webp',
  displayOrder: Number(img.displayOrder || 0),
  altText: img.altText
})

// Función helper para ordenar imágenes
const sortImages = (images: ItemImage[]): ItemImage[] => {
  return images.sort((a, b) => {
    // Front primero
    if (a.imageType === 'front' && b.imageType !== 'front') return -1
    if (b.imageType === 'front' && a.imageType !== 'front') return 1
    // Luego por displayOrder
    return (a.displayOrder || 0) - (b.displayOrder || 0)
  })
}

// Función principal que maneja ambos tipos
export const getVariantImages = (
  variant: ProductVariants | ProductVariantComplete
): ItemImage[] => {
  // Verificar si es ProductVariantComplete (tiene variantImages directamente)
  const isComplete =
    'variantImages' in variant &&
    !(
      'variantImages' in variant &&
      variant.variantImages?.[0]?.hasOwnProperty('variantImage')
    )

  if (isComplete) {
    // Es ProductVariantComplete - usar la función existente
    return getVariantImagesOrAttributeOptionImages(
      variant as ProductVariantComplete
    )
  }

  // Es ProductVariants - manejar estructura GraphQL
  const variantImages = variant.variantImages?.filter(Boolean) || []

  // Si tiene variantImages, usarlas
  if (variantImages.length > 0) {
    const normalizedImages = variantImages.map(normalizeToItemImage)
    return sortImages(normalizedImages)
  }

  // Si no hay variantImages, buscar en productAttributeOption images
  if (
    variant.variantAttributeOptions &&
    variant.variantAttributeOptions.length > 0
  ) {
    const attributeImages: ItemImage[] = []

    // Si la variante tiene imageAttributeId, usar solo esa opción
    if ('imageAttributeId' in variant && variant.imageAttributeId) {
      const imageControlOption = variant.variantAttributeOptions.find(
        (attr) => attr?.productAttributeOption?.attributeId === variant.imageAttributeId
      )

      if (imageControlOption?.productAttributeOption?.productAttributeOptionImages) {
        const images = imageControlOption.productAttributeOption.productAttributeOptionImages
          .filter(Boolean)
          .map(normalizeToItemImage)

        if (images.length > 0) {
          return sortImages(images)
        }
      }
    } else {
      // Si no hay imageAttributeId, buscar en todas las opciones de atributos
      for (const variantAttrOption of variant.variantAttributeOptions) {
        if (variantAttrOption?.productAttributeOption?.productAttributeOptionImages) {
          const images = variantAttrOption.productAttributeOption.productAttributeOptionImages
            .filter(Boolean)
            .map(normalizeToItemImage)

          attributeImages.push(...images)
        }
      }

      if (attributeImages.length > 0) {
        // Eliminar duplicados por ID
        const uniqueImages = attributeImages.filter(
          (img, index, arr) => arr.findIndex((i) => i.id === img.id) === index
        )

        return sortImages(uniqueImages)
      }
    }
  }

  // Fallback: imagen por defecto
  return [
    {
      imageType: 'front',
      id: 0,
      imageUrlNormal: '/no-image.webp',
      imageUrlThumb: '/no-image.webp',
      imageUrlZoom: '/no-image.webp',
      displayOrder: 0
    }
  ]
}

// Función específica para ProductVariantComplete (mantener compatibilidad)
export const getVariantImagesOrAttributeOptionImages = (
  variant: ProductVariantComplete
): ItemImage[] => {
  if (variant.variantImages && variant.variantImages.length > 0) {
    const sortedImages = variant.variantImages
      .filter((img): img is NonNullable<typeof img> => img !== null)
      .sort((a, b) => {
        if (a.imageType === 'front' && b.imageType !== 'front') return -1
        if (b.imageType === 'front' && a.imageType !== 'front') return 1
        return (a.displayOrder || 0) - (b.displayOrder || 0)
      })
      .map((img) => ({ ...img, displayOrder: Number(img.displayOrder) }))
    return sortedImages
  }

  // Si no hay variantImages, buscar en productAttributeOption images
  if (
    variant.variantAttributeOptions &&
    variant.variantAttributeOptions.length > 0
  ) {
    const attributeImages: ItemImage[] = []

    // Si la variante tiene imageAttributeId, usar solo esa opción
    if (variant.imageAttributeId) {
      const imageControlOption = variant.variantAttributeOptions.find(
        (attr) => attr?.productAttributeOption?.attributeId === variant.imageAttributeId
      )

      if (imageControlOption?.productAttributeOption?.productAttributeOptionImages) {
        const images = imageControlOption.productAttributeOption.productAttributeOptionImages
          .filter(Boolean)
          .map(normalizeToItemImage)

        if (images.length > 0) {
          return sortImages(images)
        }
      }
    } else {
      // Si no hay imageAttributeId, buscar en todas las opciones de atributos
      for (const variantAttrOption of variant.variantAttributeOptions) {
        if (variantAttrOption?.productAttributeOption?.productAttributeOptionImages) {
          const images = variantAttrOption.productAttributeOption.productAttributeOptionImages
            .filter(Boolean)
            .map(normalizeToItemImage)

          attributeImages.push(...images)
        }
      }

      if (attributeImages.length > 0) {
        // Eliminar duplicados por ID
        const uniqueImages = attributeImages.filter(
          (img, index, arr) => arr.findIndex((i) => i.id === img.id) === index
        )

        return sortImages(uniqueImages)
      }
    }
  }

  return [
    {
      imageType: 'front',
      id: 0,
      imageUrlNormal: '/no-image.webp',
      imageUrlThumb: '/no-image.webp',
      imageUrlZoom: '/no-image.webp',
      displayOrder: 0
    }
  ]
}
