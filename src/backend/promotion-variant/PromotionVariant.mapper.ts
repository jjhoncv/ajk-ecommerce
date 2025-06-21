import { type PromotionVariants as PromotionVariantRaw } from '@/types/database'
import { type PromotionVariants as PromotionVariant } from '@/types/domain'

export const PromotionVariantMapper = (
  data: PromotionVariantRaw
): PromotionVariant => {
  return {
    promotionId: data.promotion_id,
    variantId: data.variant_id,
    promotionPrice: data.promotion_price ?? undefined,
    stockLimit: data.stock_limit ?? undefined,
    createdAt: data.created_at,
    productVariants: undefined, // Se llena en el modelo con lógica de negocio,
    promotion: undefined // Se llena en el modelo con lógica de negocio
  }
}

export const PromotionVariantsMapper = (
  data: PromotionVariantRaw[] | null
): PromotionVariant[] | undefined => {
  if (data === null) return undefined
  return data.map(PromotionVariantMapper)
}
