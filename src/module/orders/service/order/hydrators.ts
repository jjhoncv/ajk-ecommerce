import { type OrderWithCustomer } from '../../core/Order.interfaces'
import { type Order } from './types'

export const hydrateOrder = (orderData: OrderWithCustomer): Order => {
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
    createdAt: orderData.createdAt ?? new Date(),
    customerName: orderData.customerName ?? undefined,
    customerEmail: orderData.customerEmail ?? undefined,
    itemCount: orderData.itemCount,
    processingFee: orderData.processingFee,
    totalWithFee: orderData.totalWithFee
  }
}

export const hydrateOrders = (ordersData: OrderWithCustomer[]): Order[] => {
  return ordersData.map(hydrateOrder)
}
