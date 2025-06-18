import { Orders as OrdersRaw } from '@/types/database'
import { Orders as Order } from '@/types/domain'

export const OrderMapper = (orderRaw: OrdersRaw): Order => {
  return {
    id: orderRaw.id,
    customerId: orderRaw.customer_id,
    orderNumber: orderRaw.order_number,
    status: orderRaw.status,
    createdAt: orderRaw.created_at,
    updatedAt: orderRaw.updated_at,

    // Montos
    subtotal: Number(orderRaw.subtotal),
    discountAmount: Number(orderRaw.discount_amount),
    shippingCost: Number(orderRaw.shipping_cost),
    taxAmount: Number(orderRaw.tax_amount),
    totalAmount: Number(orderRaw.total_amount),

    // Información de envío
    shippingAddressId: orderRaw.shipping_address_id,
    shippingMethod: orderRaw.shipping_method,
    estimatedDelivery: orderRaw.estimated_delivery,

    // Información de pago
    paymentMethod: orderRaw.payment_method,
    paymentStatus: orderRaw.payment_status,
    paidAt: orderRaw.paid_at,

    // Notas
    customerNotes: orderRaw.customer_notes,
    adminNotes: orderRaw.admin_notes
  }
}

export const OrdersMapper = (
  ordersRaw: OrdersRaw[] | null
): Order[] | undefined => {
  if (!ordersRaw || ordersRaw.length === 0) return undefined
  return ordersRaw.map(OrderMapper)
}

export const OrderToRawMapper = (
  order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Omit<OrdersRaw, 'id' | 'created_at' | 'updated_at'> => {
  return {
    customer_id: order.customerId,
    order_number: order.orderNumber,
    status: order.status,

    // Montos
    subtotal: order.subtotal,
    discount_amount: order.discountAmount,
    shipping_cost: order.shippingCost,
    tax_amount: order.taxAmount,
    total_amount: order.totalAmount,

    // Información de envío
    shipping_address_id: order.shippingAddressId,
    shipping_method: order.shippingMethod,
    estimated_delivery: order.estimatedDelivery,

    // Información de pago
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    paid_at: order.paidAt,

    // Notas
    customer_notes: order.customerNotes,
    admin_notes: order.adminNotes
  }
}
