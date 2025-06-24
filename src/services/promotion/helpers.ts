import { type Promotions } from '@/types/domain'

export const isPromotionActive = (promotion: Promotions): boolean => {
  const date = new Date()
  const startDate = new Date(promotion.startDate)
  const endDate = new Date(promotion.endDate)
  return date >= startDate && date <= endDate
}
