import { executeQuery } from '@/lib/db'
import { type Orders as OrdersRaw } from '@/types/database'

export class OrderRepository {
  public async getOrders(): Promise<OrdersRaw[] | null> {
    const orders = await executeQuery<OrdersRaw[]>({
      query: 'SELECT * FROM orders ORDER BY created_at DESC'
    })

    if (orders.length === 0) return null
    return orders
  }

  public async getOrderById(id: number): Promise<OrdersRaw | null> {
    const orders = await executeQuery<OrdersRaw[]>({
      query: 'SELECT * FROM orders WHERE id = ?',
      values: [id]
    })

    if (orders.length === 0) return null
    return orders[0]
  }

  public async getOrderByNumber(
    orderNumber: string
  ): Promise<OrdersRaw | null> {
    const orders = await executeQuery<OrdersRaw[]>({
      query: 'SELECT * FROM orders WHERE order_number = ?',
      values: [orderNumber]
    })

    if (orders.length === 0) return null
    return orders[0]
  }

  public async getOrdersByCustomerId(
    customerId: number
  ): Promise<OrdersRaw[] | null> {
    const orders = await executeQuery<OrdersRaw[]>({
      query:
        'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      values: [customerId]
    })

    if (orders.length === 0) return null
    return orders
  }

  public async getOrdersByStatus(status: string): Promise<OrdersRaw[] | null> {
    const orders = await executeQuery<OrdersRaw[]>({
      query: 'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC',
      values: [status]
    })

    if (orders.length === 0) return null
    return orders
  }

  public async createOrder(
    order: Omit<OrdersRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<OrdersRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO orders SET ?',
      values: [order]
    })

    return await this.getOrderById(result.insertId)
  }

  public async updateOrder(
    orderData: Partial<Omit<OrdersRaw, 'id' | 'created_at' | 'updated_at'>>,
    id: number
  ): Promise<OrdersRaw | null> {
    await executeQuery({
      query: 'UPDATE orders SET ? WHERE id = ?',
      values: [orderData, id]
    })

    return await this.getOrderById(id)
  }

  public async updateOrderStatus(
    id: number,
    status: string,
    adminNotes?: string
  ): Promise<OrdersRaw | null> {
    const updateData: any = { status }
    if (adminNotes) updateData.admin_notes = adminNotes

    await executeQuery({
      query: 'UPDATE orders SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getOrderById(id)
  }

  public async updatePaymentStatus(
    id: number,
    paymentStatus: string,
    paidAt?: Date
  ): Promise<OrdersRaw | null> {
    const updateData: any = { payment_status: paymentStatus }
    if (paidAt) updateData.paid_at = paidAt

    await executeQuery({
      query: 'UPDATE orders SET ? WHERE id = ?',
      values: [updateData, id]
    })

    return await this.getOrderById(id)
  }

  public async deleteOrder(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM orders WHERE id = ?',
      values: [id]
    })
  }

  public async getOrderSummary(): Promise<any[] | null> {
    const summary = await executeQuery<any[]>({
      query: 'SELECT * FROM order_summary ORDER BY created_at DESC'
    })

    if (summary.length === 0) return null
    return summary
  }

  public async getOrdersWithCustomerInfo(): Promise<any[] | null> {
    const orders = await executeQuery<any[]>({
      query: `
        SELECT
          o.*,
          CONCAT(c.name, ' ', COALESCE(c.lastname, '')) as customer_name,
          c.email as customer_email,
          (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.created_at DESC
      `
    })

    if (orders.length === 0) return null
    return orders
  }
}

const orderRepository = new OrderRepository()
export default orderRepository
