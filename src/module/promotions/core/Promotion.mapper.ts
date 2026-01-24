import { type Promotions as PromotionRaw } from '@/types/database'
import { type Promotions as Promotion } from '@/types/domain'

export const PromotionMapper = (data: PromotionRaw): Promotion => {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug ?? undefined,
    description: data.description,
    discountType: data.discount_type,
    discountValue: Number(data.discount_value),
    endDate: data.end_date,
    startDate: data.start_date,
    isActive: data.is_active,
    type: data.type,
    imageUrl: data.image_url,
    minPurchaseAmount: data.min_purchase_amount,
    promotionVariants: undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    updatedBy: data.updated_by
  }
}

export const PromotionsMapper = (
  data: PromotionRaw[] | null
): Promotion[] | undefined => {
  if (data === null) return undefined
  return data.map(PromotionMapper)
}
