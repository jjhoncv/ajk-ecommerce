// 📄 PaymentTransaction.interfaces.ts
import { type PaymentTransactions as PaymentTransaction } from '@/types/domain'

export interface PaymentTransactionExtended extends PaymentTransaction {
  paymentMethodName?: string
  paymentMethodCode?: string
  orderNumber?: string
  customerEmail?: string
  customerName?: string
}

export interface TransactionSummary {
  totalTransactions: number
  totalAmount: number
  totalFees: number
  netAmount: number
  successfulTransactions: number
  failedTransactions: number
  pendingTransactions: number
  averageAmount: number
}

export interface TransactionFilter {
  status?: string[]
  paymentMethodId?: number
  orderId?: number
  dateFrom?: Date
  dateTo?: Date
  amountMin?: number
  amountMax?: number
}

export interface CreateTransactionData {
  orderId: number
  paymentMethodId: number
  amount: number
  currency?: string
  paymentData?: any
  referenceNumber?: string
  expiresAt?: Date
}
