// 📄 PaymentMethod.interfaces.ts
import { type PaymentMethods as PaymentMethod } from '@/types/domain'

export interface PaymentMethodExtended extends PaymentMethod {
  totalTransactions?: number
  totalAmount?: number
  lastUsed?: Date
}

export interface PaymentCalculation {
  methodId: number
  baseAmount: number
  processingFee: number
  finalAmount: number
  feeType: 'fixed' | 'percentage'
  isValid: boolean
  reason?: string
}

export interface PaymentMethodFilter {
  isActive?: boolean
  minAmount?: number
  maxAmount?: number
  orderValue?: number
}
