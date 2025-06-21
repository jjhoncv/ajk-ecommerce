// 📄 PaymentMethod.repository.ts
import { executeQuery } from '@/lib/db'
import { type PaymentMethods as PaymentMethodRaw } from '@/types/database'

interface PaymentMethodWithStats extends PaymentMethodRaw {
  total_transactions?: number
  total_amount?: number
  last_used?: Date
}

export class PaymentMethodRepository {
  public async getPaymentMethods(): Promise<PaymentMethodRaw[] | null> {
    const methods = await executeQuery<PaymentMethodRaw[]>({
      query: `
        SELECT * FROM payment_methods 
        WHERE is_active = 1 
        ORDER BY display_order ASC, name ASC
      `
    })

    if (methods.length === 0) return null
    return methods
  }

  public async getAllPaymentMethods(): Promise<PaymentMethodRaw[] | null> {
    const methods = await executeQuery<PaymentMethodRaw[]>({
      query: `
        SELECT * FROM payment_methods 
        ORDER BY display_order ASC, name ASC
      `
    })

    if (methods.length === 0) return null
    return methods
  }

  public async getPaymentMethodById(
    id: number
  ): Promise<PaymentMethodRaw | null> {
    const methods = await executeQuery<PaymentMethodRaw[]>({
      query: 'SELECT * FROM payment_methods WHERE id = ?',
      values: [id]
    })

    if (methods.length === 0) return null
    return methods[0]
  }

  public async getPaymentMethodByCode(
    code: string
  ): Promise<PaymentMethodRaw | null> {
    const methods = await executeQuery<PaymentMethodRaw[]>({
      query: 'SELECT * FROM payment_methods WHERE code = ? AND is_active = 1',
      values: [code]
    })

    if (methods.length === 0) return null
    return methods[0]
  }

  public async getPaymentMethodsForAmount(
    amount: number
  ): Promise<PaymentMethodRaw[] | null> {
    const methods = await executeQuery<PaymentMethodRaw[]>({
      query: `
        SELECT * FROM payment_methods 
        WHERE is_active = 1 
        AND (min_amount IS NULL OR min_amount <= ?)
        AND (max_amount IS NULL OR max_amount >= ?)
        ORDER BY display_order ASC, name ASC
      `,
      values: [amount, amount]
    })

    if (methods.length === 0) return null
    return methods
  }

  public async getPaymentMethodsWithStats(): Promise<
    PaymentMethodWithStats[] | null
  > {
    const methods = await executeQuery<PaymentMethodWithStats[]>({
      query: `
        SELECT 
          pm.*,
          COUNT(pt.id) as total_transactions,
          COALESCE(SUM(pt.amount), 0) as total_amount,
          MAX(pt.created_at) as last_used
        FROM payment_methods pm
        LEFT JOIN payment_transactions pt ON pm.id = pt.payment_method_id 
          AND pt.status = 'completed'
        WHERE pm.is_active = 1
        GROUP BY pm.id
        ORDER BY pm.display_order ASC, pm.name ASC
      `
    })

    if (methods.length === 0) return null
    return methods
  }

  public async createPaymentMethod(
    method: Omit<PaymentMethodRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PaymentMethodRaw | null> {
    const methodData = {
      ...method,
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO payment_methods SET ?',
      values: [methodData]
    })

    return await this.getPaymentMethodById(result.insertId)
  }

  public async updatePaymentMethod(
    methodData: Partial<Omit<PaymentMethodRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<PaymentMethodRaw | null> {
    const updateData = {
      ...methodData,
      updated_at: new Date()
    }

    await executeQuery({
      query: 'UPDATE payment_methods SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getPaymentMethodById(id)
  }

  public async deletePaymentMethod(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM payment_methods WHERE id = ?',
      values: [id]
    })
  }

  public async activatePaymentMethod(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE payment_methods SET is_active = 1, updated_at = ? WHERE id = ?',
      values: [new Date(), id]
    })
  }

  public async deactivatePaymentMethod(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE payment_methods SET is_active = 0, updated_at = ? WHERE id = ?',
      values: [new Date(), id]
    })
  }

  public async updateDisplayOrder(
    id: number,
    displayOrder: number
  ): Promise<void> {
    await executeQuery({
      query:
        'UPDATE payment_methods SET display_order = ?, updated_at = ? WHERE id = ?',
      values: [displayOrder, new Date(), id]
    })
  }

  public async updateSettings(id: number, settings: any): Promise<void> {
    await executeQuery({
      query:
        'UPDATE payment_methods SET settings = ?, updated_at = ? WHERE id = ?',
      values: [JSON.stringify(settings), new Date(), id]
    })
  }
}

const paymentMethodRepository = new PaymentMethodRepository()
export default paymentMethodRepository
