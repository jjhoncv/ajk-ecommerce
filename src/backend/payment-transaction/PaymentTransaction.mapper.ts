// 📄 PaymentTransaction.mapper.ts
import { type PaymentTransactions as PaymentTransactionRaw } from '@/types/database'
import { type PaymentTransactions as PaymentTransaction } from '@/types/domain'

export const PaymentTransactionMapper = (
  data: PaymentTransactionRaw
): PaymentTransaction => {
  return {
    id: data.id,
    orderId: data.order_id,
    paymentMethodId: data.payment_method_id,
    amount: data.amount,
    netAmount: data.net_amount,
    processingFee: data.processing_fee,
    currency: data.currency,
    status: data.status,
    transactionId: data.transaction_id,
    referenceNumber: data.reference_number,
    paymentData: data.payment_data,
    gatewayResponse: data.gateway_response,
    processedAt: data.processed_at,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

export const PaymentTransactionsMapper = (
  data: PaymentTransactionRaw[] | null
): PaymentTransaction[] | undefined => {
  if (data === null) return undefined
  return data.map(PaymentTransactionMapper)
}
