import { type AttributeOptionImages as AttributeOptionImageRaw } from '@/types/database'
import { type AttributeOptionImages as AttributeOptionImage } from '@/types/domain'

export const AttributeOptionImageMapper = (
  data: AttributeOptionImageRaw
): AttributeOptionImage => {
  return {
    id: data.id,
    attributeOptionId: data.attribute_option_id,
    productId: data.product_id ?? undefined,
    imageType: data.image_type,
    imageUrlThumb: data.image_url_thumb,
    imageUrlNormal: data.image_url_normal ?? undefined,
    imageUrlZoom: data.image_url_zoom ?? undefined,
    altText: data.alt_text ?? undefined,
    displayOrder: data.display_order ?? undefined,
    isPrimary: data.is_primary,
    attributeOption: undefined // Se llena en el modelo si es necesario
  }
}

export const AttributeOptionImagesMapper = (
  data: AttributeOptionImageRaw[] | null
): AttributeOptionImage[] | undefined => {
  if (data === null) return undefined
  return data.map(AttributeOptionImageMapper)
}
