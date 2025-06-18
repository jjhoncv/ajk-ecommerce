import { OrderTracking } from '@/types/domain'

import {
  OrderTrackingMapper,
  OrderTrackingsMapper
} from './OrderTracking.mapper'
import oOrderTrackingRep from './OrderTracking.repository'

export class OrderTrackingModel {
  public async getOrderTrackings(): Promise<OrderTracking[] | null> {
    const orderTrackingsRaw = await oOrderTrackingRep.getOrderTrackings()
    return OrderTrackingsMapper(orderTrackingsRaw)
  }

  public async getOrderTrackingById(id: number): Promise<OrderTracking | null> {
    const orderTrackingRaw = await oOrderTrackingRep.getOrderTrackingById(id)
    if (!orderTrackingRaw) return null
    return OrderTrackingMapper(orderTrackingRaw)
  }

  public async getOrderTrackingsByOrderId(
    orderId: number
  ): Promise<OrderTracking[] | null> {
    const orderTrackingsRaw =
      await oOrderTrackingRep.getOrderTrackingsByOrderId(orderId)
    return OrderTrackingsMapper(orderTrackingsRaw)
  }

  public async getOrderTrackingByTrackingNumber(
    trackingNumber: string
  ): Promise<OrderTracking | null> {
    const orderTrackingRaw =
      await oOrderTrackingRep.getOrderTrackingByTrackingNumber(trackingNumber)
    if (!orderTrackingRaw) return null
    return OrderTrackingMapper(orderTrackingRaw)
  }

  public async getOrderTrackingsByStatus(
    status: string
  ): Promise<OrderTracking[] | null> {
    const orderTrackingsRaw =
      await oOrderTrackingRep.getOrderTrackingsByStatus(status)
    return OrderTrackingsMapper(orderTrackingsRaw)
  }

  public async getOrderTrackingsByCourierCompany(
    courierCompany: string
  ): Promise<OrderTracking[] | null> {
    const orderTrackingsRaw =
      await oOrderTrackingRep.getOrderTrackingsByCourierCompany(courierCompany)
    return OrderTrackingsMapper(orderTrackingsRaw)
  }

  public async createOrderTracking(
    orderTrackingData: Omit<OrderTracking, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<OrderTracking | null> {
    // Filtrar campos undefined para evitar errores de tipo
    const createData: any = {
      orderId: orderTrackingData.orderId,
      status: orderTrackingData.status
    }

    if (orderTrackingData.trackingNumber !== undefined) {
      createData.trackingNumber = orderTrackingData.trackingNumber
    }
    if (orderTrackingData.courierCompany !== undefined) {
      createData.courierCompany = orderTrackingData.courierCompany
    }
    if (orderTrackingData.currentLocation !== undefined) {
      createData.currentLocation = orderTrackingData.currentLocation
    }
    if (orderTrackingData.shippedAt !== undefined) {
      createData.shippedAt = orderTrackingData.shippedAt
    }
    if (orderTrackingData.deliveredAt !== undefined) {
      createData.deliveredAt = orderTrackingData.deliveredAt
    }
    if (orderTrackingData.deliveredTo !== undefined) {
      createData.deliveredTo = orderTrackingData.deliveredTo
    }
    if (orderTrackingData.deliveryNotes !== undefined) {
      createData.deliveryNotes = orderTrackingData.deliveryNotes
    }

    const created = await oOrderTrackingRep.createOrderTracking(createData)
    if (!created) return null
    return OrderTrackingMapper(created)
  }

  public async updateOrderTracking(
    orderTrackingData: Partial<
      Omit<OrderTracking, 'id' | 'createdAt' | 'updatedAt'>
    >,
    id: number
  ): Promise<OrderTracking | null> {
    // Filtrar campos undefined para evitar errores de tipo
    const updateData: any = {}

    if (orderTrackingData.trackingNumber !== undefined) {
      updateData.trackingNumber = orderTrackingData.trackingNumber
    }
    if (orderTrackingData.courierCompany !== undefined) {
      updateData.courierCompany = orderTrackingData.courierCompany
    }
    if (orderTrackingData.status !== undefined) {
      updateData.status = orderTrackingData.status
    }
    if (orderTrackingData.currentLocation !== undefined) {
      updateData.currentLocation = orderTrackingData.currentLocation
    }
    if (orderTrackingData.shippedAt !== undefined) {
      updateData.shippedAt = orderTrackingData.shippedAt
    }
    if (orderTrackingData.deliveredAt !== undefined) {
      updateData.deliveredAt = orderTrackingData.deliveredAt
    }
    if (orderTrackingData.deliveredTo !== undefined) {
      updateData.deliveredTo = orderTrackingData.deliveredTo
    }
    if (orderTrackingData.deliveryNotes !== undefined) {
      updateData.deliveryNotes = orderTrackingData.deliveryNotes
    }

    const updated = await oOrderTrackingRep.updateOrderTracking(id, updateData)
    if (!updated) return null
    return OrderTrackingMapper(updated)
  }

  public async updateTrackingStatus(
    id: number,
    status: string,
    currentLocation?: string,
    deliveryNotes?: string
  ): Promise<OrderTracking | null> {
    const updated = await oOrderTrackingRep.updateTrackingStatus(
      id,
      status,
      currentLocation,
      deliveryNotes
    )
    if (!updated) return null
    return OrderTrackingMapper(updated)
  }

  public async markAsShipped(
    id: number,
    shippedAt?: Date
  ): Promise<OrderTracking | null> {
    const updated = await oOrderTrackingRep.markAsShipped(id, shippedAt)
    if (!updated) return null
    return OrderTrackingMapper(updated)
  }

  public async markAsDelivered(
    id: number,
    deliveredAt?: Date,
    deliveredTo?: string,
    deliveryNotes?: string
  ): Promise<OrderTracking | null> {
    const updated = await oOrderTrackingRep.markAsDelivered(
      id,
      deliveredAt,
      deliveredTo,
      deliveryNotes
    )
    if (!updated) return null
    return OrderTrackingMapper(updated)
  }

  public async deleteOrderTracking(id: number): Promise<void> {
    return await oOrderTrackingRep.deleteOrderTracking(id)
  }

  public async deleteOrderTrackingsByOrderId(orderId: number): Promise<void> {
    return await oOrderTrackingRep.deleteOrderTrackingsByOrderId(orderId)
  }

  // Métodos utilitarios
  public async getLatestTrackingByOrderId(
    orderId: number
  ): Promise<OrderTracking | null> {
    const orderTrackingRaw =
      await oOrderTrackingRep.getLatestTrackingByOrderId(orderId)
    if (!orderTrackingRaw) return null
    return OrderTrackingMapper(orderTrackingRaw)
  }

  public async getTrackingHistory(
    orderId: number
  ): Promise<OrderTracking[] | null> {
    const orderTrackingsRaw =
      await oOrderTrackingRep.getTrackingHistory(orderId)
    return OrderTrackingsMapper(orderTrackingsRaw)
  }
}

const orderTrackingModel = new OrderTrackingModel()
export default orderTrackingModel
