import { type PromotionsDiscountType } from '@/types/domain'

export interface Promotion {
  id: number
  name: string
  discountType: PromotionsDiscountType
  discountValue: number
  icon?: string
}
