import { Promotions as PromotionRaw } from '@/types/database'
import { Promotions as Promotion } from '@/types/domain'

export const PromotionMapper = (data: PromotionRaw): Promotion => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    createdAt: data.created_at,
    discountType: data.discount_type,
    discountValue: data.discount_value,
    endDate: data.end_date,
    startDate: data.start_date,
    updatedAt: data.updated_at,
    isActive: data.is_active,
    minPurchaseAmount: data.min_purchase_amount,
    promotionVariants: undefined
  }
}

export const PromotionsMapper = (
  data: PromotionRaw[] | null
): Promotion[] | undefined => {
  if (data === null) return undefined
  return data.map(PromotionMapper)
}
