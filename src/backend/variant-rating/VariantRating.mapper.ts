import { type VariantRatings as VariantRatingRaw } from '@/types/database'
import { type VariantRatings as VariantRating } from '@/types/domain'

export const VariantRatingMapper = (data: VariantRatingRaw): VariantRating => {
  return {
    id: data.id,
    variantId: data.variant_id,
    customerId: data.customer_id,
    rating: Number(data.rating),
    title: data.title ?? undefined,
    review: data.review ?? undefined,
    verifiedPurchase: Number(data.verified_purchase),
    customer: undefined, // Se llena en el modelo con lógica de negocio
    productVariants: undefined, // Se llena en el modelo con lógica de negocio
    ratingImages: undefined // Se llena en el modelo con lógica de negocio
  }
}

export const VariantRatingsMapper = (
  data: VariantRatingRaw[] | null
): VariantRating[] | undefined => {
  if (data === null) return undefined
  return data.map(VariantRatingMapper)
}
