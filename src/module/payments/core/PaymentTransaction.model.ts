import { type PaymentTransactions as PaymentTransactionRaw } from '@/types/database'
import { type PaymentTransactions as PaymentTransaction } from '@/types/domain'

// Local module dependency
import oPaymentMethodRep from './PaymentMethod.repository'

import {
  type CreateTransactionData,
  type PaymentTransactionExtended,
  type TransactionSummary
} from './PaymentTransaction.interfaces'
import {
  PaymentTransactionMapper,
  PaymentTransactionsMapper
} from './PaymentTransaction.mapper'
import oPaymentTransactionRep from './PaymentTransaction.repository'

export class PaymentTransactionModel {
  public async getTransactionById(
    id: number
  ): Promise<PaymentTransaction | undefined> {
    const transactionRaw = await oPaymentTransactionRep.getTransactionById(id)
    if (!transactionRaw) return undefined
    return PaymentTransactionMapper(transactionRaw)
  }

  public async getTransactionsByOrderId(
    orderId: number
  ): Promise<PaymentTransaction[] | undefined> {
    const transactionsRaw =
      await oPaymentTransactionRep.getTransactionsByOrderId(orderId)
    return PaymentTransactionsMapper(transactionsRaw)
  }

  public async getTransactionByReference(
    referenceNumber: string
  ): Promise<PaymentTransaction | undefined> {
    const transactionRaw =
      await oPaymentTransactionRep.getTransactionByReference(referenceNumber)
    if (!transactionRaw) return undefined
    return PaymentTransactionMapper(transactionRaw)
  }

  public async getTransactionByTransactionId(
    transactionId: string
  ): Promise<PaymentTransaction | undefined> {
    const transactionRaw =
      await oPaymentTransactionRep.getTransactionByTransactionId(transactionId)
    if (!transactionRaw) return undefined
    return PaymentTransactionMapper(transactionRaw)
  }

  public async getTransactionsWithDetails(
    limit: number = 50,
    offset: number = 0
  ): Promise<PaymentTransactionExtended[] | undefined> {
    const transactionsRaw =
      await oPaymentTransactionRep.getTransactionsWithDetails(limit, offset)
    if (!transactionsRaw) return undefined

    return transactionsRaw.map((transaction) => ({
      ...PaymentTransactionMapper(transaction),
      paymentMethodName: transaction.payment_method_name,
      paymentMethodCode: transaction.payment_method_code,
      orderNumber: transaction.order_number,
      customerEmail: transaction.customer_email,
      customerName: transaction.customer_name
    }))
  }

  public async getTransactionsByStatus(
    status: string
  ): Promise<PaymentTransaction[] | undefined> {
    const transactionsRaw =
      await oPaymentTransactionRep.getTransactionsByStatus(status)
    return PaymentTransactionsMapper(transactionsRaw)
  }

  public async getTransactionsByPaymentMethod(
    paymentMethodId: number
  ): Promise<PaymentTransaction[] | undefined> {
    const transactionsRaw =
      await oPaymentTransactionRep.getTransactionsByPaymentMethod(
        paymentMethodId
      )
    return PaymentTransactionsMapper(transactionsRaw)
  }

  public async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<PaymentTransaction[] | undefined> {
    const transactionsRaw =
      await oPaymentTransactionRep.getTransactionsByDateRange(
        startDate,
        endDate
      )
    return PaymentTransactionsMapper(transactionsRaw)
  }

  public async getPendingTransactions(): Promise<
    PaymentTransaction[] | undefined
  > {
    const transactionsRaw =
      await oPaymentTransactionRep.getPendingTransactions()
    return PaymentTransactionsMapper(transactionsRaw)
  }

  public async getExpiredTransactions(): Promise<
    PaymentTransaction[] | undefined
  > {
    const transactionsRaw =
      await oPaymentTransactionRep.getExpiredTransactions()
    return PaymentTransactionsMapper(transactionsRaw)
  }

  public async createTransaction(
    data: CreateTransactionData
  ): Promise<PaymentTransaction | undefined> {
    // Obtener metodo de pago para calcular comisiones
    const paymentMethod = await oPaymentMethodRep.getPaymentMethodById(
      data.paymentMethodId
    )
    if (!paymentMethod) throw new Error('Metodo de pago no encontrado')

    // Calcular comision basada en el monto base (order total sin comision)
    const baseAmount = Number(data.amount) || 0
    let processingFee = 0
    if (
      paymentMethod.processing_fee_value &&
      Number(paymentMethod.processing_fee_value) > 0
    ) {
      if (paymentMethod.processing_fee_type === 'percentage') {
        processingFee = (baseAmount * Number(paymentMethod.processing_fee_value)) / 100
      } else {
        processingFee = Number(paymentMethod.processing_fee_value)
      }
    }

    // Redondear a 2 decimales para evitar errores de precision
    processingFee = Number(processingFee.toFixed(2))

    // amount = lo que paga el cliente (base + comision)
    // net_amount = lo que recibe el comercio (base sin comision)
    const totalWithFee = Number((baseAmount + processingFee).toFixed(2))
    const netAmount = Number(baseAmount.toFixed(2))

    // Generar numero de referencia si no se proporciona
    const referenceNumber =
      data.referenceNumber || this.generateReferenceNumber()

    const transactionData: Omit<
      PaymentTransactionRaw,
      'id' | 'created_at' | 'updated_at'
    > = {
      order_id: data.orderId,
      payment_method_id: data.paymentMethodId,
      amount: totalWithFee,
      net_amount: netAmount,
      processing_fee: processingFee,
      currency: data.currency || 'PEN',
      status: 'pending',
      reference_number: referenceNumber,
      payment_data: data.paymentData ? JSON.stringify(data.paymentData) : null,
      expires_at: data.expiresAt || null,
      transaction_id: null,
      gateway_response: null,
      processed_at: null
    }

    const created =
      await oPaymentTransactionRep.createTransaction(transactionData)
    if (!created) return undefined
    return PaymentTransactionMapper(created)
  }

  public async updateTransactionStatus(
    id: number,
    status: string,
    gatewayResponse?: any,
    processedAt?: Date
  ): Promise<PaymentTransaction | undefined> {
    const updated = await oPaymentTransactionRep.updateTransactionStatus(
      id,
      status,
      gatewayResponse,
      processedAt || new Date()
    )
    if (!updated) return undefined
    return PaymentTransactionMapper(updated)
  }

  public async markAsCompleted(
    id: number,
    transactionId: string,
    gatewayResponse?: any
  ): Promise<PaymentTransaction | undefined> {
    const updated = await oPaymentTransactionRep.markAsCompleted(
      id,
      transactionId,
      gatewayResponse
    )
    if (!updated) return undefined
    return PaymentTransactionMapper(updated)
  }

  public async markAsFailed(
    id: number,
    gatewayResponse?: any
  ): Promise<PaymentTransaction | undefined> {
    const updated = await oPaymentTransactionRep.markAsFailed(
      id,
      gatewayResponse
    )
    if (!updated) return undefined
    return PaymentTransactionMapper(updated)
  }

  public async markAsCancelled(
    id: number
  ): Promise<PaymentTransaction | undefined> {
    const updated = await oPaymentTransactionRep.markAsCancelled(id)
    if (!updated) return undefined
    return PaymentTransactionMapper(updated)
  }

  public async getTransactionSummary(
    startDate?: Date,
    endDate?: Date
  ): Promise<TransactionSummary | undefined> {
    const summary = await oPaymentTransactionRep.getTransactionSummary(
      startDate,
      endDate
    )
    if (!summary) return undefined

    return {
      totalTransactions: summary.total_transactions || 0,
      totalAmount: summary.total_amount || 0,
      totalFees: summary.total_fees || 0,
      netAmount: summary.net_amount || 0,
      successfulTransactions: summary.successful_transactions || 0,
      failedTransactions: summary.failed_transactions || 0,
      pendingTransactions: summary.pending_transactions || 0,
      averageAmount: summary.average_amount || 0
    }
  }

  public async deleteTransaction(id: number): Promise<void> {
    await oPaymentTransactionRep.deleteTransaction(id)
  }

  // Metodo para procesar transacciones expiradas
  public async processExpiredTransactions(): Promise<
    PaymentTransaction[] | undefined
  > {
    const expiredTransactions = await this.getExpiredTransactions()
    if (!expiredTransactions) return undefined

    const processedTransactions: PaymentTransaction[] = []

    for (const transaction of expiredTransactions) {
      const updated = await this.markAsFailed(transaction.id, {
        reason: 'Transaction expired'
      })
      if (updated) {
        processedTransactions.push(updated)
      }
    }

    return processedTransactions.length > 0 ? processedTransactions : undefined
  }

  // Metodo para generar numero de referencia unico
  private generateReferenceNumber(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `TXN-${timestamp}-${random}`
  }

  // Metodo para validar si una transaccion esta expirada
  public isTransactionExpired(transaction: PaymentTransaction): boolean {
    if (!transaction.expiresAt) return false
    return new Date() > new Date(transaction.expiresAt)
  }

  // Metodo para obtener el tiempo restante de una transaccion
  public getTimeRemaining(transaction: PaymentTransaction): number | null {
    if (!transaction.expiresAt) return null
    const now = new Date().getTime()
    const expiry = new Date(transaction.expiresAt).getTime()
    const remaining = expiry - now
    return remaining > 0 ? remaining : 0
  }

  // Metodo para verificar si una transaccion puede ser cancelada
  public canBeCancelled(transaction: PaymentTransaction): boolean {
    return (
      transaction.status === 'pending' || transaction.status === 'processing'
    )
  }

  // Metodo para verificar si una transaccion puede ser reintentada
  public canBeRetried(transaction: PaymentTransaction): boolean {
    return (
      transaction.status === 'failed' && !this.isTransactionExpired(transaction)
    )
  }
}

const paymentTransactionModel = new PaymentTransactionModel()
export default paymentTransactionModel
