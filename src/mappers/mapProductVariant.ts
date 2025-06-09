import { promotion_variants as PromotionVariantRaw } from '@/types/database'
import { PromotionVariants as PromotionVariant } from '@/types/domain'

// ✅ Mapper individual puro - NO incluye relaciones
export const mapPromotionVariant = (
  data: PromotionVariantRaw
): PromotionVariant => {
  return {
    promotionId: data.promotion_id,
    variantId: data.variant_id,
    promotionPrice: data.promotion_price ?? undefined,
    stockLimit: data.stock_limit ?? undefined,
    createdAt: data.created_at,
    productVariants: undefined, // Se llena en el modelo con lógica de negocio
    promotions: undefined // Se llena en el modelo con lógica de negocio
  }
}

// ✅ Para arrays - maneja null a nivel de array
export const mapPromotionVariants = (
  data: PromotionVariantRaw[] | null
): PromotionVariant[] | undefined => {
  if (data === null) return undefined
  return data.map(mapPromotionVariant)
}
