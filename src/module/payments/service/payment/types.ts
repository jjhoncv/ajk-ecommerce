export interface PaymentMethod {
  id: number
  name: string
  code: string
  description?: string | null
  isActive?: number | null
  displayOrder?: number | null
  icon?: string | null
  processingFee?: number | null
  processingFeeType?: string | null
  minAmount?: number | null
  maxAmount?: number | null
  instructions?: string | null
}
