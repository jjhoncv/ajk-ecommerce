import { type ProductAttributeOptionImages as ProductAttributeOptionImageRaw } from '@/types/database'
import { type ProductAttributeOptionImages as ProductAttributeOptionImage } from '@/types/domain'

export const AttributeOptionImageMapper = (
  data: ProductAttributeOptionImageRaw
): ProductAttributeOptionImage => {
  return {
    id: data.id,
    productAttributeOptionId: data.product_attribute_option_id,
    imageType: data.image_type,
    imageUrlThumb: data.image_url_thumb,
    imageUrlNormal: data.image_url_normal,
    imageUrlZoom: data.image_url_zoom,
    altText: data.alt_text ?? undefined,
    displayOrder: data.display_order ?? undefined,
    isPrimary: data.is_primary ?? undefined,
    productAttributeOption: undefined // Se llena en el modelo si es necesario
  }
}

export const AttributeOptionImagesMapper = (
  data: ProductAttributeOptionImageRaw[] | null
): ProductAttributeOptionImage[] | undefined => {
  if (data === null) return undefined
  return data.map(AttributeOptionImageMapper)
}
