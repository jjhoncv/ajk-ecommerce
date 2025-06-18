import { OrderItems as OrderItem } from '@/types/domain'

import {
  OrderItemMapper,
  OrderItemsMapper,
  OrderItemToRawMapper
} from './OrderItem.mapper'
import oOrderItemsRep from './OrderItem.repository'

export class OrderItemsModel {
  public async getOrderItems(): Promise<OrderItem[] | undefined> {
    const orderItemsRaw = await oOrderItemsRep.getOrderItems()
    return OrderItemsMapper(orderItemsRaw)
  }

  public async getOrderItemById(id: number): Promise<OrderItem | undefined> {
    const orderItemRaw = await oOrderItemsRep.getOrderItemById(id)
    if (!orderItemRaw) return undefined
    return OrderItemMapper(orderItemRaw)
  }

  public async getOrderItemsByOrderId(
    orderId: number
  ): Promise<OrderItem[] | undefined> {
    const orderItemsRaw = await oOrderItemsRep.getOrderItemsByOrderId(orderId)
    return OrderItemsMapper(orderItemsRaw)
  }

  public async getOrderItemsByVariantId(
    variantId: number
  ): Promise<OrderItem[] | undefined> {
    const orderItemsRaw =
      await oOrderItemsRep.getOrderItemsByVariantId(variantId)
    return OrderItemsMapper(orderItemsRaw)
  }

  public async createOrderItem(
    orderItemData: Omit<OrderItem, 'id'>
  ): Promise<OrderItem | undefined> {
    const orderItemRaw = OrderItemToRawMapper(orderItemData)
    const created = await oOrderItemsRep.createOrderItem(orderItemRaw)
    if (!created) return undefined
    return OrderItemMapper(created)
  }

  public async createOrderItems(
    orderItemsData: Omit<OrderItem, 'id'>[]
  ): Promise<OrderItem[] | undefined> {
    const orderItemsRaw = orderItemsData.map(OrderItemToRawMapper)
    const created = await oOrderItemsRep.createOrderItems(orderItemsRaw)
    return OrderItemsMapper(created)
  }

  public async updateOrderItem(
    orderItemData: Partial<Omit<OrderItem, 'id'>>,
    id: number
  ): Promise<OrderItem | undefined> {
    // Convertir solo los campos que se van a actualizar
    const updateRaw: any = {}

    if (orderItemData.orderId !== undefined)
      updateRaw.order_id = orderItemData.orderId
    if (orderItemData.variantId !== undefined)
      updateRaw.variant_id = orderItemData.variantId
    if (orderItemData.productName !== undefined)
      updateRaw.product_name = orderItemData.productName
    if (orderItemData.variantSku !== undefined)
      updateRaw.variant_sku = orderItemData.variantSku
    if (orderItemData.variantAttributes !== undefined) {
      updateRaw.variant_attributes = orderItemData.variantAttributes
        ? JSON.stringify(orderItemData.variantAttributes)
        : null
    }
    if (orderItemData.quantity !== undefined)
      updateRaw.quantity = orderItemData.quantity
    if (orderItemData.unitPrice !== undefined)
      updateRaw.unit_price = orderItemData.unitPrice
    if (orderItemData.totalPrice !== undefined)
      updateRaw.total_price = orderItemData.totalPrice
    if (orderItemData.discountAmount !== undefined)
      updateRaw.discount_amount = orderItemData.discountAmount

    const updated = await oOrderItemsRep.updateOrderItem(updateRaw, id)
    if (!updated) return undefined
    return OrderItemMapper(updated)
  }

  public async deleteOrderItem(id: number): Promise<void> {
    return await oOrderItemsRep.deleteOrderItem(id)
  }

  public async deleteOrderItemsByOrderId(orderId: number): Promise<void> {
    return await oOrderItemsRep.deleteOrderItemsByOrderId(orderId)
  }

  // Métodos utilitarios
  public async getTotalByOrderId(orderId: number): Promise<number> {
    return await oOrderItemsRep.getTotalByOrderId(orderId)
  }

  public async getItemCountByOrderId(orderId: number): Promise<number> {
    return await oOrderItemsRep.getItemCountByOrderId(orderId)
  }

  public async getQuantityTotalByOrderId(orderId: number): Promise<number> {
    return await oOrderItemsRep.getQuantityTotalByOrderId(orderId)
  }
}

const orderItemsModel = new OrderItemsModel()
export default orderItemsModel
