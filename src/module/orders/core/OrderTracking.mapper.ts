import { type OrderTracking as OrderTrackingRaw } from '@/types/database'
import { type OrderTracking } from '@/types/domain'

// Mapper de raw (database) a domain
export const OrderTrackingMapper = (
  orderTrackingRaw: OrderTrackingRaw
): OrderTracking => {
  return {
    id: orderTrackingRaw.id,
    orderId: orderTrackingRaw.order_id,
    trackingNumber: orderTrackingRaw.tracking_number || undefined,
    courierCompany: orderTrackingRaw.courier_company || undefined,
    status: orderTrackingRaw.status,
    currentLocation: orderTrackingRaw.current_location || undefined,
    shippedAt: orderTrackingRaw.shipped_at || undefined,
    deliveredAt: orderTrackingRaw.delivered_at || undefined,
    deliveredTo: orderTrackingRaw.delivered_to || undefined,
    deliveryNotes: orderTrackingRaw.delivery_notes || undefined
  }
}

// Mapper para arrays
export const OrderTrackingsMapper = (
  orderTrackingsRaw: OrderTrackingRaw[] | null
): OrderTracking[] | null => {
  if (!orderTrackingsRaw) return null
  return orderTrackingsRaw.map(OrderTrackingMapper)
}

// Mapper de domain a raw (database) - para crear/actualizar
export const OrderTrackingToRawMapper = (
  orderTracking: Omit<OrderTracking, 'id' | 'createdAt' | 'updatedAt'>
): Omit<OrderTrackingRaw, 'id' | 'created_at' | 'updated_at'> => {
  return {
    order_id: orderTracking.orderId,
    tracking_number: orderTracking.trackingNumber || null,
    courier_company: orderTracking.courierCompany || null,
    status: orderTracking.status,
    current_location: orderTracking.currentLocation || null,
    shipped_at: orderTracking.shippedAt || null,
    delivered_at: orderTracking.deliveredAt || null,
    delivered_to: orderTracking.deliveredTo || null,
    delivery_notes: orderTracking.deliveryNotes || null
  }
}
