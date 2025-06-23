import { type PromotionsDiscountType } from '@/types/domain'

export interface Promotion {
  id: number
  name: string
  description: string
  discountType: PromotionsDiscountType
  discountValue: number
  startDate: string
  endDate: string
  type: string
}
