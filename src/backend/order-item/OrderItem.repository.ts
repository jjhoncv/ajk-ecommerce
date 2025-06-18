import { executeQuery } from '@/lib/db'
import { OrderItems as OrderItemsRaw } from '@/types/database'

export class OrderItemsRepository {
  public async getOrderItems(): Promise<OrderItemsRaw[] | null> {
    const items = await executeQuery<OrderItemsRaw[]>({
      query: 'SELECT * FROM order_items ORDER BY id'
    })

    if (items.length === 0) return null
    return items
  }

  public async getOrderItemById(id: number): Promise<OrderItemsRaw | null> {
    const items = await executeQuery<OrderItemsRaw[]>({
      query: 'SELECT * FROM order_items WHERE id = ?',
      values: [id]
    })

    if (items.length === 0) return null
    return items[0]
  }

  public async getOrderItemsByOrderId(
    orderId: number
  ): Promise<OrderItemsRaw[] | null> {
    const items = await executeQuery<OrderItemsRaw[]>({
      query: 'SELECT * FROM order_items WHERE order_id = ?',
      values: [orderId]
    })

    if (items.length === 0) return null
    return items
  }

  public async getOrderItemsByVariantId(
    variantId: number
  ): Promise<OrderItemsRaw[] | null> {
    const items = await executeQuery<OrderItemsRaw[]>({
      query: 'SELECT * FROM order_items WHERE variant_id = ?',
      values: [variantId]
    })

    if (items.length === 0) return null
    return items
  }

  public async createOrderItem(
    orderItem: Omit<OrderItemsRaw, 'id'>
  ): Promise<OrderItemsRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO order_items SET ?',
      values: [orderItem]
    })

    return await this.getOrderItemById(result.insertId)
  }

  public async createOrderItems(
    orderItems: Omit<OrderItemsRaw, 'id'>[]
  ): Promise<OrderItemsRaw[] | null> {
    const createdItems: OrderItemsRaw[] = []

    for (const item of orderItems) {
      const created = await this.createOrderItem(item)
      if (created) createdItems.push(created)
    }

    return createdItems.length > 0 ? createdItems : null
  }

  public async updateOrderItem(
    itemData: Partial<Omit<OrderItemsRaw, 'id'>>,
    id: number
  ): Promise<OrderItemsRaw | null> {
    await executeQuery({
      query: 'UPDATE order_items SET ? WHERE id = ?',
      values: [itemData, id]
    })

    return await this.getOrderItemById(id)
  }

  public async deleteOrderItem(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM order_items WHERE id = ?',
      values: [id]
    })
  }

  public async deleteOrderItemsByOrderId(orderId: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM order_items WHERE order_id = ?',
      values: [orderId]
    })
  }

  // Métodos utilitarios
  public async getTotalByOrderId(orderId: number): Promise<number> {
    const result = await executeQuery<{ total: number }[]>({
      query:
        'SELECT COALESCE(SUM(total_price), 0) as total FROM order_items WHERE order_id = ?',
      values: [orderId]
    })

    return result[0]?.total || 0
  }

  public async getItemCountByOrderId(orderId: number): Promise<number> {
    const result = await executeQuery<{ count: number }[]>({
      query: 'SELECT COUNT(*) as count FROM order_items WHERE order_id = ?',
      values: [orderId]
    })

    return result[0]?.count || 0
  }

  public async getQuantityTotalByOrderId(orderId: number): Promise<number> {
    const result = await executeQuery<{ total: number }[]>({
      query:
        'SELECT COALESCE(SUM(quantity), 0) as total FROM order_items WHERE order_id = ?',
      values: [orderId]
    })

    return result[0]?.total || 0
  }
}

const orderItemsRepository = new OrderItemsRepository()
export default orderItemsRepository
