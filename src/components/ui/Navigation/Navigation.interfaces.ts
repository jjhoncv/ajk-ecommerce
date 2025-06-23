import { type PromotionsDiscountType } from '@/types/domain'

export type ButtonType = 'mini' | 'normal'

export interface Promotion {
  id: number
  name: string
  type: PromotionsDiscountType
  value: number
}
