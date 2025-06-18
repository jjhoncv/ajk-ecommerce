import { executeQuery } from '@/lib/db'
import { OrderTracking as OrderTrackingRaw } from '@/types/database'

export class OrderTrackingRepository {
  public async getOrderTrackings(): Promise<OrderTrackingRaw[] | null> {
    const orderTrackings = await executeQuery<OrderTrackingRaw[]>({
      query: 'SELECT * FROM order_tracking ORDER BY created_at DESC'
    })

    if (orderTrackings.length === 0) return null
    return orderTrackings
  }

  public async getOrderTrackingById(
    id: number
  ): Promise<OrderTrackingRaw | null> {
    const orderTrackings = await executeQuery<OrderTrackingRaw[]>({
      query: 'SELECT * FROM order_tracking WHERE id = ?',
      values: [id]
    })

    if (orderTrackings.length === 0) return null
    return orderTrackings[0]
  }

  public async getOrderTrackingsByOrderId(
    orderId: number
  ): Promise<OrderTrackingRaw[] | null> {
    const orderTrackings = await executeQuery<OrderTrackingRaw[]>({
      query: `
        SELECT * FROM order_tracking 
        WHERE order_id = ? 
        ORDER BY created_at DESC
      `,
      values: [orderId]
    })

    if (orderTrackings.length === 0) return null
    return orderTrackings
  }

  public async getOrderTrackingByTrackingNumber(
    trackingNumber: string
  ): Promise<OrderTrackingRaw | null> {
    const orderTrackings = await executeQuery<OrderTrackingRaw[]>({
      query: 'SELECT * FROM order_tracking WHERE tracking_number = ?',
      values: [trackingNumber]
    })

    if (orderTrackings.length === 0) return null
    return orderTrackings[0]
  }

  public async getOrderTrackingsByStatus(
    status: string
  ): Promise<OrderTrackingRaw[] | null> {
    const orderTrackings = await executeQuery<OrderTrackingRaw[]>({
      query: `
        SELECT * FROM order_tracking 
        WHERE status = ? 
        ORDER BY created_at DESC
      `,
      values: [status]
    })

    if (orderTrackings.length === 0) return null
    return orderTrackings
  }

  public async getOrderTrackingsByCourierCompany(
    courierCompany: string
  ): Promise<OrderTrackingRaw[] | null> {
    const orderTrackings = await executeQuery<OrderTrackingRaw[]>({
      query: `
        SELECT * FROM order_tracking 
        WHERE courier_company = ? 
        ORDER BY created_at DESC
      `,
      values: [courierCompany]
    })

    if (orderTrackings.length === 0) return null
    return orderTrackings
  }

  public async createOrderTracking(data: {
    orderId: number
    trackingNumber?: string
    courierCompany?: string
    status: string
    currentLocation?: string
    shippedAt?: Date
    deliveredAt?: Date
    deliveredTo?: string
    deliveryNotes?: string
  }): Promise<OrderTrackingRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO order_tracking (
          order_id, tracking_number, courier_company, status, 
          current_location, shipped_at, delivered_at, delivered_to, delivery_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        data.orderId,
        data.trackingNumber || null,
        data.courierCompany || null,
        data.status,
        data.currentLocation || null,
        data.shippedAt || null,
        data.deliveredAt || null,
        data.deliveredTo || null,
        data.deliveryNotes || null
      ]
    })

    return await this.getOrderTrackingById(result.insertId)
  }

  public async updateOrderTracking(
    id: number,
    data: {
      trackingNumber?: string
      courierCompany?: string
      status?: string
      currentLocation?: string
      shippedAt?: Date
      deliveredAt?: Date
      deliveredTo?: string
      deliveryNotes?: string
    }
  ): Promise<OrderTrackingRaw | null> {
    const fields: string[] = []
    const values: any[] = []

    if (data.trackingNumber !== undefined) {
      fields.push('tracking_number = ?')
      values.push(data.trackingNumber)
    }
    if (data.courierCompany !== undefined) {
      fields.push('courier_company = ?')
      values.push(data.courierCompany)
    }
    if (data.status !== undefined) {
      fields.push('status = ?')
      values.push(data.status)
    }
    if (data.currentLocation !== undefined) {
      fields.push('current_location = ?')
      values.push(data.currentLocation)
    }
    if (data.shippedAt !== undefined) {
      fields.push('shipped_at = ?')
      values.push(data.shippedAt)
    }
    if (data.deliveredAt !== undefined) {
      fields.push('delivered_at = ?')
      values.push(data.deliveredAt)
    }
    if (data.deliveredTo !== undefined) {
      fields.push('delivered_to = ?')
      values.push(data.deliveredTo)
    }
    if (data.deliveryNotes !== undefined) {
      fields.push('delivery_notes = ?')
      values.push(data.deliveryNotes)
    }

    if (fields.length === 0) {
      return await this.getOrderTrackingById(id)
    }

    values.push(id)

    await executeQuery({
      query: `UPDATE order_tracking SET ${fields.join(', ')} WHERE id = ?`,
      values
    })

    return await this.getOrderTrackingById(id)
  }

  public async updateTrackingStatus(
    id: number,
    status: string,
    currentLocation?: string,
    deliveryNotes?: string
  ): Promise<OrderTrackingRaw | null> {
    const fields = ['status = ?']
    const values = [status]

    if (currentLocation !== undefined) {
      fields.push('current_location = ?')
      values.push(currentLocation)
    }
    if (deliveryNotes !== undefined) {
      fields.push('delivery_notes = ?')
      values.push(deliveryNotes)
    }

    values.push(id)

    await executeQuery({
      query: `UPDATE order_tracking SET ${fields.join(', ')} WHERE id = ?`,
      values
    })

    return await this.getOrderTrackingById(id)
  }

  public async markAsShipped(
    id: number,
    shippedAt?: Date
  ): Promise<OrderTrackingRaw | null> {
    await executeQuery({
      query: `
        UPDATE order_tracking 
        SET status = 'shipped', shipped_at = COALESCE(?, NOW()) 
        WHERE id = ?
      `,
      values: [shippedAt, id]
    })

    return await this.getOrderTrackingById(id)
  }

  public async markAsDelivered(
    id: number,
    deliveredAt?: Date,
    deliveredTo?: string,
    deliveryNotes?: string
  ): Promise<OrderTrackingRaw | null> {
    await executeQuery({
      query: `
        UPDATE order_tracking 
        SET status = 'delivered', 
            delivered_at = COALESCE(?, NOW()),
            delivered_to = COALESCE(?, delivered_to),
            delivery_notes = COALESCE(?, delivery_notes)
        WHERE id = ?
      `,
      values: [deliveredAt, deliveredTo, deliveryNotes, id]
    })

    return await this.getOrderTrackingById(id)
  }

  public async deleteOrderTracking(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM order_tracking WHERE id = ?',
      values: [id]
    })
  }

  public async deleteOrderTrackingsByOrderId(orderId: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM order_tracking WHERE order_id = ?',
      values: [orderId]
    })
  }

  // Métodos utilitarios
  public async getLatestTrackingByOrderId(
    orderId: number
  ): Promise<OrderTrackingRaw | null> {
    const orderTrackings = await executeQuery<OrderTrackingRaw[]>({
      query: `
        SELECT * FROM order_tracking 
        WHERE order_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `,
      values: [orderId]
    })

    if (orderTrackings.length === 0) return null
    return orderTrackings[0]
  }

  public async getTrackingHistory(
    orderId: number
  ): Promise<OrderTrackingRaw[] | null> {
    const orderTrackings = await executeQuery<OrderTrackingRaw[]>({
      query: `
        SELECT * FROM order_tracking 
        WHERE order_id = ? 
        ORDER BY created_at ASC
      `,
      values: [orderId]
    })

    if (orderTrackings.length === 0) return null
    return orderTrackings
  }
}

const orderTrackingRepository = new OrderTrackingRepository()
export default orderTrackingRepository
