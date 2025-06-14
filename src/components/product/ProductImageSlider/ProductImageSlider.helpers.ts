import { ItemImage } from '@/shared'
import { ProductVariants } from '@/types/domain'

// Obtener imágenes de la variante actual (desde attributeOptionImages)
export const getVariantImages = (variant: ProductVariants) => {
  const images: ItemImage[] = []

  // Buscar imágenes en las opciones de atributos de la variante actual
  variant?.variantAttributeOptions?.forEach((vao) => {
    if (vao?.attributeOption?.attributeOptionImages) {
      vao.attributeOption.attributeOptionImages.forEach((img) => {
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
  })

  // Ordenar por displayOrder
  return images.sort((a, b) => a.displayOrder - b.displayOrder)
}
