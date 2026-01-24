import { type Promotions } from '@/types/domain'
import { type Promotion } from './types'

export const hydratePromotions = (data: Promotions[]): Promotion[] =>
  data.map(hydratePromotion)

export const hydratePromotion = (item: Promotions): Promotion => ({
  id: item.id,
  name: item.name,
  slug: item.slug ?? undefined,
  discountType: item.discountType,
  discountValue: item.discountValue,
  description: item.description ?? '',
  endDate: item.endDate.toString(),
  startDate: item.endDate.toString(),
  type: item.type ?? '',
  imageUrl: item.imageUrl ?? ''
})
