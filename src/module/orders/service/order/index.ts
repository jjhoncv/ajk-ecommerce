import { getOrderById, getOrders, getOrdersByStatus, updateOrderStatus } from './order'

const OrderService = {
  getOrders,
  getOrderById,
  getOrdersByStatus,
  updateOrderStatus
}

export default OrderService
