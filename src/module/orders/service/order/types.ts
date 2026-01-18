export interface Order {
  id: number
  customerId: number
  orderNumber: string
  status: string
  subtotal: number
  discountAmount: number
  shippingCost: number
  taxAmount: number
  totalAmount: number
  shippingAddressId: number
  shippingMethod: string
  estimatedDelivery: Date | null
  paymentMethod: string
  paymentStatus: string
  paidAt: Date | null
  customerNotes: string | null
  adminNotes: string | null
  createdAt: Date
  customerName?: string
  customerEmail?: string
  itemCount?: number
  processingFee?: number
  totalWithFee?: number
}

export interface OrderSearchParams {
  status?: string
  paymentStatus?: string
  query?: string
}
