import { type ItemImage } from '@/shared'
import { type ProductVariants } from '@/types/domain'

// Obtener imágenes de la variante actual
export const getVariantImages = (variant: ProductVariants) => {
  const images: ItemImage[] = []

  // CASO 1: Si la variante usa un atributo para controlar imágenes
  if (variant?.imageAttributeId) {
    // Buscar solo las imágenes del atributo que controla las imágenes
    variant?.variantAttributeOptions?.forEach((vao) => {
      // Solo procesar si este atributo es el que controla las imágenes
      if (vao?.productAttributeOption?.attributeId === variant.imageAttributeId) {
        if (vao?.productAttributeOption?.attributeOptionImages) {
          vao.productAttributeOption.attributeOptionImages.forEach((img) => {
            if (!img) return

            images.push({
              id: img.id,
              imageUrlThumb: img.imageUrlThumb,
              imageUrlNormal: img.imageUrlNormal || '',
              imageUrlZoom: img.imageUrlZoom || '',
              altText: img.altText || '',
              imageType: img.imageType,
              displayOrder: Number(img.displayOrder),
              isPrimary: img.isPrimary
            })
          })
        }
      }
    })
  } else {
    // CASO 2: La variante usa sus propias imágenes (variant_images)
    if (variant?.variantImages) {
      variant.variantImages.forEach((img) => {
        if (!img) return

        images.push({
          id: img.id,
          imageUrlThumb: img.imageUrlThumb,
          imageUrlNormal: img.imageUrlNormal || '',
          imageUrlZoom: img.imageUrlZoom || '',
          altText: img.altText || '',
          imageType: img.imageType,
          displayOrder: Number(img.displayOrder),
          isPrimary: img.isPrimary
        })
      })
    }
  }

  // Ordenar por displayOrder
  return images.sort((a, b) => a.displayOrder - b.displayOrder)
}
