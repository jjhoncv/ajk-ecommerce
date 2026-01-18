import { type Orders } from '@/types/domain'

export interface OrderWithCustomer extends Orders {
  createdAt: Date
  customerName: string
  customerEmail: string
  itemCount: number
  processingFee?: number
  totalWithFee?: number
}

export interface OrderFilters {
  status?: string
  paymentStatus?: string
  customerId?: number
  startDate?: Date
  endDate?: Date
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
}
