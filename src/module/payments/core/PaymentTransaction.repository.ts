import { executeQuery } from '@/lib/db'
import { type PaymentTransactions as PaymentTransactionRaw } from '@/types/database'

interface PaymentTransactionWithDetails extends PaymentTransactionRaw {
  payment_method_name?: string
  payment_method_code?: string
  order_number?: string
  customer_email?: string
  customer_name?: string
}

export class PaymentTransactionRepository {
  public async getTransactionById(
    id: number
  ): Promise<PaymentTransactionRaw | null> {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: 'SELECT * FROM payment_transactions WHERE id = ?',
      values: [id]
    })

    if (transactions.length === 0) return null
    return transactions[0]
  }

  public async getTransactionsByOrderId(
    orderId: number
  ): Promise<PaymentTransactionRaw[] | null> {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: `
        SELECT * FROM payment_transactions
        WHERE order_id = ?
        ORDER BY created_at DESC
      `,
      values: [orderId]
    })

    if (transactions.length === 0) return null
    return transactions
  }

  public async getTransactionByReference(
    referenceNumber: string
  ): Promise<PaymentTransactionRaw | null> {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: 'SELECT * FROM payment_transactions WHERE reference_number = ?',
      values: [referenceNumber]
    })

    if (transactions.length === 0) return null
    return transactions[0]
  }

  public async getTransactionByTransactionId(
    transactionId: string
  ): Promise<PaymentTransactionRaw | null> {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: 'SELECT * FROM payment_transactions WHERE transaction_id = ?',
      values: [transactionId]
    })

    if (transactions.length === 0) return null
    return transactions[0]
  }

  public async getTransactionsWithDetails(
    limit: number = 50,
    offset: number = 0
  ): Promise<PaymentTransactionWithDetails[] | null> {
    const transactions = await executeQuery<PaymentTransactionWithDetails[]>({
      query: `
        SELECT
          pt.*,
          pm.name as payment_method_name,
          pm.code as payment_method_code,
          o.order_number,
          c.email as customer_email,
          CONCAT(c.name, ' ', c.lastname) as customer_name
        FROM payment_transactions pt
        LEFT JOIN payment_methods pm ON pt.payment_method_id = pm.id
        LEFT JOIN orders o ON pt.order_id = o.id
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY pt.created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: [limit, offset]
    })

    if (transactions.length === 0) return null
    return transactions
  }

  public async getTransactionsByStatus(
    status: string
  ): Promise<PaymentTransactionRaw[] | null> {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: `
        SELECT * FROM payment_transactions
        WHERE status = ?
        ORDER BY created_at DESC
      `,
      values: [status]
    })

    if (transactions.length === 0) return null
    return transactions
  }

  public async getTransactionsByPaymentMethod(
    paymentMethodId: number
  ): Promise<PaymentTransactionRaw[] | null> {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: `
        SELECT * FROM payment_transactions
        WHERE payment_method_id = ?
        ORDER BY created_at DESC
      `,
      values: [paymentMethodId]
    })

    if (transactions.length === 0) return null
    return transactions
  }

  public async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<PaymentTransactionRaw[] | null> {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: `
        SELECT * FROM payment_transactions
        WHERE created_at BETWEEN ? AND ?
        ORDER BY created_at DESC
      `,
      values: [startDate, endDate]
    })

    if (transactions.length === 0) return null
    return transactions
  }

  public async getPendingTransactions(): Promise<
    PaymentTransactionRaw[] | null
  > {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: `
        SELECT * FROM payment_transactions
        WHERE status = 'pending'
        ORDER BY created_at ASC
      `
    })

    if (transactions.length === 0) return null
    return transactions
  }

  public async getExpiredTransactions(): Promise<
    PaymentTransactionRaw[] | null
  > {
    const transactions = await executeQuery<PaymentTransactionRaw[]>({
      query: `
        SELECT * FROM payment_transactions
        WHERE status = 'pending'
        AND expires_at IS NOT NULL
        AND expires_at < NOW()
        ORDER BY expires_at ASC
      `
    })

    if (transactions.length === 0) return null
    return transactions
  }

  public async createTransaction(
    transaction: Omit<PaymentTransactionRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PaymentTransactionRaw | null> {
    const transactionData = {
      ...transaction,
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO payment_transactions SET ?',
      values: [transactionData]
    })

    return await this.getTransactionById(result.insertId)
  }

  public async updateTransaction(
    transactionData: Partial<Omit<PaymentTransactionRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<PaymentTransactionRaw | null> {
    const updateData = {
      ...transactionData,
      updated_at: new Date()
    }

    await executeQuery({
      query: 'UPDATE payment_transactions SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getTransactionById(id)
  }

  public async updateTransactionStatus(
    id: number,
    status: string,
    gatewayResponse?: any,
    processedAt?: Date
  ): Promise<PaymentTransactionRaw | null> {
    const updateData: any = {
      status,
      updated_at: new Date()
    }

    if (gatewayResponse) {
      updateData.gateway_response = JSON.stringify(gatewayResponse)
    }

    if (processedAt) {
      updateData.processed_at = processedAt
    }

    await executeQuery({
      query: 'UPDATE payment_transactions SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getTransactionById(id)
  }

  public async markAsCompleted(
    id: number,
    transactionId: string,
    gatewayResponse?: any
  ): Promise<PaymentTransactionRaw | null> {
    const updateData = {
      status: 'completed',
      transaction_id: transactionId,
      processed_at: new Date(),
      updated_at: new Date(),
      ...(gatewayResponse && {
        gateway_response: JSON.stringify(gatewayResponse)
      })
    }

    await executeQuery({
      query: 'UPDATE payment_transactions SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getTransactionById(id)
  }

  public async markAsFailed(
    id: number,
    gatewayResponse?: any
  ): Promise<PaymentTransactionRaw | null> {
    const updateData = {
      status: 'failed',
      processed_at: new Date(),
      updated_at: new Date(),
      ...(gatewayResponse && {
        gateway_response: JSON.stringify(gatewayResponse)
      })
    }

    await executeQuery({
      query: 'UPDATE payment_transactions SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getTransactionById(id)
  }

  public async markAsCancelled(
    id: number
  ): Promise<PaymentTransactionRaw | null> {
    const updateData = {
      status: 'cancelled',
      processed_at: new Date(),
      updated_at: new Date()
    }

    await executeQuery({
      query: 'UPDATE payment_transactions SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getTransactionById(id)
  }

  public async getTransactionSummary(
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    let query = `
      SELECT
        COUNT(*) as total_transactions,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(SUM(processing_fee), 0) as total_fees,
        COALESCE(SUM(net_amount), 0) as net_amount,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_transactions,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_transactions,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
        COALESCE(AVG(amount), 0) as average_amount
      FROM payment_transactions
    `

    const values: any[] = []

    if (startDate && endDate) {
      query += ' WHERE created_at BETWEEN ? AND ?'
      values.push(startDate, endDate)
    }

    const result = await executeQuery<any[]>({ query, values })
    return result[0] || null
  }

  public async deleteTransaction(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM payment_transactions WHERE id = ?',
      values: [id]
    })
  }
}

const paymentTransactionRepository = new PaymentTransactionRepository()
export default paymentTransactionRepository
