import { type VariantImages as VariantImageRaw } from '@/types/database'
import { type VariantImages as VariantImage } from '@/types/domain'

export const VariantImageMapper = (img: VariantImageRaw): VariantImage => {
  return {
    id: img.id,
    variantId: img.variant_id,
    imageUrlThumb: img.image_url_thumb,
    imageUrlNormal: img.image_url_normal,
    imageUrlZoom: img.image_url_zoom,
    imageType: img.image_type,
    isPrimary: img.is_primary,
    altText: img.alt_text,
    displayOrder: img.display_order,
    productVariants: undefined
  }
}

export const VariantImagesMapper = (
  data: VariantImageRaw[] | null
): VariantImage[] | undefined => {
  if (data === null) return undefined
  return data.map(VariantImageMapper)
}
