import { paymentTransactionModel } from '@/module/payments/core'
import { orderModel } from '../../core'
import { hydrateOrders } from './hydrators'
import { type Order } from './types'

export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersData = await orderModel.getAllOrders()

    if (!ordersData || ordersData.length === 0) {
      return []
    }

    // Obtener comisiones de procesamiento para cada orden
    const ordersWithFees = await Promise.all(
      ordersData.map(async (order) => {
        const transactions = await paymentTransactionModel.getTransactionsByOrderId(order.id)
        const processingFee = transactions?.[0]?.processingFee ? Number(transactions[0].processingFee) : 0
        return {
          ...order,
          processingFee,
          totalWithFee: order.totalAmount + processingFee
        }
      })
    )

    return hydrateOrders(ordersWithFees)
  } catch (error) {
    throw new Error(
      `Error al obtener órdenes: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export const getOrderById = async (id: number): Promise<Order | undefined> => {
  try {
    const orderData = await orderModel.getOrderById(id)
    if (!orderData) return undefined

    // Obtener información adicional si es necesario
    const transactions = await paymentTransactionModel.getTransactionsByOrderId(id)
    const processingFee = transactions?.[0]?.processingFee ? Number(transactions[0].processingFee) : 0

    return {
      id: orderData.id,
      customerId: orderData.customerId,
      orderNumber: orderData.orderNumber,
      status: orderData.status,
      subtotal: Number(orderData.subtotal) || 0,
      discountAmount: Number(orderData.discountAmount) || 0,
      shippingCost: Number(orderData.shippingCost) || 0,
      taxAmount: Number(orderData.taxAmount) || 0,
      totalAmount: Number(orderData.totalAmount) || 0,
      shippingAddressId: orderData.shippingAddressId,
      shippingMethod: orderData.shippingMethod ?? '',
      estimatedDelivery: orderData.estimatedDelivery ?? null,
      paymentMethod: orderData.paymentMethod ?? '',
      paymentStatus: orderData.paymentStatus,
      paidAt: orderData.paidAt ?? null,
      customerNotes: orderData.customerNotes ?? null,
      adminNotes: orderData.adminNotes ?? null,
      createdAt: (orderData as any).createdAt ?? new Date(),
      processingFee,
      totalWithFee: Number(orderData.totalAmount) + processingFee
    }
  } catch (error) {
    throw new Error(
      `Error al obtener orden: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  try {
    const ordersData = await orderModel.getOrdersByStatus(status)
    if (!ordersData || ordersData.length === 0) return []

    return ordersData.map((order) => ({
      id: order.id,
      customerId: order.customerId,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: Number(order.subtotal) || 0,
      discountAmount: Number(order.discountAmount) || 0,
      shippingCost: Number(order.shippingCost) || 0,
      taxAmount: Number(order.taxAmount) || 0,
      totalAmount: Number(order.totalAmount) || 0,
      shippingAddressId: order.shippingAddressId,
      shippingMethod: order.shippingMethod ?? '',
      estimatedDelivery: order.estimatedDelivery ?? null,
      paymentMethod: order.paymentMethod ?? '',
      paymentStatus: order.paymentStatus,
      paidAt: order.paidAt ?? null,
      customerNotes: order.customerNotes ?? null,
      adminNotes: order.adminNotes ?? null,
      createdAt: (order as any).createdAt ?? new Date()
    }))
  } catch (error) {
    throw new Error(
      `Error al obtener órdenes por estado: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export const updateOrderStatus = async (
  id: number,
  status: string,
  adminNotes?: string
): Promise<Order | undefined> => {
  try {
    const updated = await orderModel.updateOrderStatus(id, status, adminNotes)
    if (!updated) return undefined

    return {
      id: updated.id,
      customerId: updated.customerId,
      orderNumber: updated.orderNumber,
      status: updated.status,
      subtotal: Number(updated.subtotal) || 0,
      discountAmount: Number(updated.discountAmount) || 0,
      shippingCost: Number(updated.shippingCost) || 0,
      taxAmount: Number(updated.taxAmount) || 0,
      totalAmount: Number(updated.totalAmount) || 0,
      shippingAddressId: updated.shippingAddressId,
      shippingMethod: updated.shippingMethod ?? '',
      estimatedDelivery: updated.estimatedDelivery ?? null,
      paymentMethod: updated.paymentMethod ?? '',
      paymentStatus: updated.paymentStatus,
      paidAt: updated.paidAt ?? null,
      customerNotes: updated.customerNotes ?? null,
      adminNotes: updated.adminNotes ?? null,
      createdAt: (updated as any).createdAt ?? new Date()
    }
  } catch (error) {
    throw new Error(
      `Error al actualizar estado de orden: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
