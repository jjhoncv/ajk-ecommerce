import { ProductVariantComplete } from '@/backend/product-variant'
import { ItemImage } from '@/shared'
import { AttributeOptionImages, ProductVariants } from '@/types/domain'

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

  // Si no hay variantImages, buscar en attributeOptionImages
  if (
    variant.variantAttributeOptions &&
    variant.variantAttributeOptions.length > 0
  ) {
    const attributeImages: ItemImage[] = []

    // Iterar sobre las opciones de atributos de la variante
    for (const variantAttrOption of variant.variantAttributeOptions) {
      if (variantAttrOption?.attributeOption?.attributeOptionImages) {
        const images = variantAttrOption.attributeOption.attributeOptionImages
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
      .sort((a, b) => {
        if (a.imageType === 'front' && b.imageType !== 'front') return -1
        if (b.imageType === 'front' && a.imageType !== 'front') return 1
        return (a.displayOrder || 0) - (b.displayOrder || 0)
      })
      .map((img) => ({ ...img, displayOrder: Number(img.displayOrder) }))
    return sortedImages
  }

  // Si no hay variantImages, filtrar attributeImages según los atributos de la variante
  if (
    variant.attributeImages &&
    variant.attributeImages.length > 0 &&
    variant.variantAttributeOptions &&
    variant.variantAttributeOptions.length > 0
  ) {
    // Obtener los attributeOptionIds de la variante
    const variantAttributeOptionIds = variant.variantAttributeOptions.map(
      (attr) => attr.attributeOptionId
    )

    // Filtrar solo las imágenes que corresponden a los atributos de esta variante
    const filteredImages = variant.attributeImages.filter(
      (img: AttributeOptionImages) =>
        variantAttributeOptionIds.includes(img.attributeOptionId)
    )

    if (filteredImages.length > 0) {
      // Ordenar: front primero, luego por displayOrder
      const sortedImages = filteredImages
        .sort((a: AttributeOptionImages, b: AttributeOptionImages) => {
          if (a.imageType === 'front' && b.imageType !== 'front') return -1
          if (b.imageType === 'front' && a.imageType !== 'front') return 1
          return (a.displayOrder || 0) - (b.displayOrder || 0)
        })
        .map((img) => ({ ...img, displayOrder: Number(img.displayOrder) }))

      return sortedImages
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
