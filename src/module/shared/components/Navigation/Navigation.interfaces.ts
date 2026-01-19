import { type PromotionsDiscountType } from '@/types/domain'

export type ButtonType = 'mini' | 'normal'

export interface Promotion {
  id: number
  name: string
  discountType: PromotionsDiscountType
  discountValue: number
  icon?: string
}
