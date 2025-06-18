import { Orders as Order } from '@/types/domain'

import { OrderMapper, OrdersMapper, OrderToRawMapper } from './Order.mapper'
import oOrderRep from './Order.repository'

export class OrderModel {
  public async getOrders(): Promise<Order[] | undefined> {
    const ordersRaw = await oOrderRep.getOrders()
    return OrdersMapper(ordersRaw)
  }

  public async getOrderById(id: number): Promise<Order | undefined> {
    const orderRaw = await oOrderRep.getOrderById(id)
    if (!orderRaw) return undefined
    return OrderMapper(orderRaw)
  }

  public async getOrderByNumber(
    orderNumber: string
  ): Promise<Order | undefined> {
    const orderRaw = await oOrderRep.getOrderByNumber(orderNumber)
    if (!orderRaw) return undefined
    return OrderMapper(orderRaw)
  }

  public async getOrdersByCustomerId(
    customerId: number
  ): Promise<Order[] | undefined> {
    const ordersRaw = await oOrderRep.getOrdersByCustomerId(customerId)
    return OrdersMapper(ordersRaw)
  }

  public async getOrdersByStatus(status: string): Promise<Order[] | undefined> {
    const ordersRaw = await oOrderRep.getOrdersByStatus(status)
    return OrdersMapper(ordersRaw)
  }

  public async createOrder(
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Order | undefined> {
    const orderRaw = OrderToRawMapper(orderData)
    const created = await oOrderRep.createOrder(orderRaw)
    if (!created) return undefined
    return OrderMapper(created)
  }

  public async updateOrder(
    orderData: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>,
    id: number
  ): Promise<Order | undefined> {
    // Convertir solo los campos que se van a actualizar
    const updateRaw: any = {}

    if (orderData.customerId !== undefined)
      updateRaw.customer_id = orderData.customerId
    if (orderData.orderNumber !== undefined)
      updateRaw.order_number = orderData.orderNumber
    if (orderData.status !== undefined) updateRaw.status = orderData.status
    if (orderData.subtotal !== undefined)
      updateRaw.subtotal = orderData.subtotal
    if (orderData.discountAmount !== undefined)
      updateRaw.discount_amount = orderData.discountAmount
    if (orderData.shippingCost !== undefined)
      updateRaw.shipping_cost = orderData.shippingCost
    if (orderData.taxAmount !== undefined)
      updateRaw.tax_amount = orderData.taxAmount
    if (orderData.totalAmount !== undefined)
      updateRaw.total_amount = orderData.totalAmount
    if (orderData.shippingAddressId !== undefined)
      updateRaw.shipping_address_id = orderData.shippingAddressId
    if (orderData.shippingMethod !== undefined)
      updateRaw.shipping_method = orderData.shippingMethod
    if (orderData.estimatedDelivery !== undefined)
      updateRaw.estimated_delivery = orderData.estimatedDelivery
    if (orderData.paymentMethod !== undefined)
      updateRaw.payment_method = orderData.paymentMethod
    if (orderData.paymentStatus !== undefined)
      updateRaw.payment_status = orderData.paymentStatus
    if (orderData.paidAt !== undefined) updateRaw.paid_at = orderData.paidAt
    if (orderData.customerNotes !== undefined)
      updateRaw.customer_notes = orderData.customerNotes
    if (orderData.adminNotes !== undefined)
      updateRaw.admin_notes = orderData.adminNotes

    const updated = await oOrderRep.updateOrder(updateRaw, id)
    if (!updated) return undefined
    return OrderMapper(updated)
  }

  public async updateOrderStatus(
    id: number,
    status: string,
    adminNotes?: string
  ): Promise<Order | undefined> {
    const updated = await oOrderRep.updateOrderStatus(id, status, adminNotes)
    if (!updated) return undefined
    return OrderMapper(updated)
  }

  public async updatePaymentStatus(
    id: number,
    paymentStatus: string,
    paidAt?: Date
  ): Promise<Order | undefined> {
    const updated = await oOrderRep.updatePaymentStatus(
      id,
      paymentStatus,
      paidAt
    )
    if (!updated) return undefined
    return OrderMapper(updated)
  }

  public async deleteOrder(id: number): Promise<void> {
    return await oOrderRep.deleteOrder(id)
  }

  public async getOrderSummary(): Promise<any[] | undefined> {
    const summary = await oOrderRep.getOrderSummary()
    if (!summary) return undefined
    return summary
  }
}

const orderModel = new OrderModel()
export default orderModel
