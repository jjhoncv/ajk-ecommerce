import { OrderItems as OrderItemsRaw } from '@/types/database'
import { OrderItems as OrderItem } from '@/types/domain'

export const OrderItemMapper = (orderItemRaw: OrderItemsRaw): OrderItem => {
  return {
    id: orderItemRaw.id,
    orderId: orderItemRaw.order_id,
    variantId: orderItemRaw.variant_id,

    // Información del producto
    productName: orderItemRaw.product_name,
    variantSku: orderItemRaw.variant_sku,
    variantAttributes: orderItemRaw.variant_attributes
      ? typeof orderItemRaw.variant_attributes === 'string'
        ? JSON.parse(orderItemRaw.variant_attributes)
        : orderItemRaw.variant_attributes
      : null,

    // Precios y cantidades
    quantity: orderItemRaw.quantity,
    unitPrice: Number(orderItemRaw.unit_price),
    totalPrice: Number(orderItemRaw.total_price),
    discountAmount: Number(orderItemRaw.discount_amount)
  }
}

export const OrderItemsMapper = (
  orderItemsRaw: OrderItemsRaw[] | null
): OrderItem[] | undefined => {
  if (!orderItemsRaw || orderItemsRaw.length === 0) return undefined
  return orderItemsRaw.map(OrderItemMapper)
}

export const OrderItemToRawMapper = (
  orderItem: Omit<OrderItem, 'id'>
): Omit<OrderItemsRaw, 'id'> => {
  return {
    order_id: orderItem.orderId,
    variant_id: orderItem.variantId,

    // Información del producto
    product_name: orderItem.productName,
    variant_sku: orderItem.variantSku,
    variant_attributes: orderItem.variantAttributes
      ? JSON.stringify(orderItem.variantAttributes)
      : null,

    // Precios y cantidades
    quantity: orderItem.quantity,
    unit_price: orderItem.unitPrice,
    total_price: orderItem.totalPrice,
    discount_amount: orderItem.discountAmount
  }
}
