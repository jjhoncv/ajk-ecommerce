import { type PromotionVariants as PromotionVariantRaw } from '@/types/database'
import { type PromotionVariants as PromotionVariant } from '@/types/domain'

export const PromotionVariantMapper = (
  data: PromotionVariantRaw
): PromotionVariant => {
  return {
    promotionId: data.promotion_id,
    variantId: data.variant_id,
    promotionPrice: Number(data.promotion_price) ?? undefined,
    stockLimit: data.stock_limit ?? undefined,
    productVariants: undefined,
    promotion: undefined
  }
}

export const PromotionVariantsMapper = (
  data: PromotionVariantRaw[] | null
): PromotionVariant[] | undefined => {
  if (data === null) return undefined
  return data.map(PromotionVariantMapper)
}
