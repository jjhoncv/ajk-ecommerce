import { VariantRatings as VariantRatingRaw } from '@/types/database'
import { VariantRatings as VariantRating } from '@/types/domain'

export const VariantRatingMapper = (data: VariantRatingRaw): VariantRating => {
  return {
    id: data.id,
    variantId: data.variant_id,
    customerId: data.customer_id,
    rating: data.rating,
    title: data.title ?? undefined,
    review: data.review ?? undefined,
    verifiedPurchase: data.verified_purchase,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    customers: undefined, // Se llena en el modelo con lógica de negocio
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
