// 📄 Checkout.interfaces.ts
import { type CartItem } from '@/hooks/useCart/useCart'
import { type Coupons, type CustomersAddresses } from '@/types/domain'

// Datos necesarios para el checkout
export interface CheckoutData {
  items: CartItem[]
  shippingAddressId: number
  paymentMethodId: number
  paymentMethodCode: string
  shippingMethodId: number
  shippingMethodName: string
  couponCode?: string
  customerNotes?: string
  paymentData?: Partial<CheckoutData>
}

// Cálculos de la orden
export interface OrderCalculation {
  subtotal: number
  discountAmount: number
  shippingCost: number
  taxAmount: number
  totalAmount: number
  estimatedDelivery: Date | null
  appliedCoupon?: Coupons
}

// Opciones de envío calculadas
export interface ShippingOption {
  methodId: number
  methodName: string
  cost: number
  isFree: boolean
  estimatedDays: {
    min: number
    max: number
  }
  description?: string
}

// Opciones de pago calculadas con comisiones
export interface PaymentOption {
  methodId: number
  methodName: string
  methodCode: string
  baseAmount: number
  processingFee: number
  finalAmount: number
  iconUrl?: string
  description?: string
  requiresVerification: boolean
}

// Resumen completo del checkout
export interface CheckoutSummary {
  items: CartItem[]
  itemCount: number
  totalQuantity: number
  calculation: OrderCalculation
  shippingOptions: ShippingOption[]
  paymentOptions: PaymentOption[]
  selectedShipping?: ShippingOption
  selectedPayment?: PaymentOption
  customerAddresses: CustomersAddresses[]
  selectedAddress?: CustomersAddresses
}

// Datos para crear la orden
export interface CreateOrderData {
  customerId: number
  items: CartItem[]
  shippingAddressId: number
  paymentMethodId: number
  shippingMethodId: number
  couponCode?: string
  customerNotes?: string
  paymentData?: Partial<CheckoutData>
}

// Respuesta del checkout
export interface CheckoutResponse {
  success: boolean
  orderId?: number
  orderNumber?: string
  paymentUrl?: string
  error?: string
  validationErrors?: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
}

// Estados del checkout
export type CheckoutStep =
  | 'shipping'
  | 'payment'
  | 'review'
  | 'processing'
  | 'complete'

export interface CheckoutState {
  step: CheckoutStep
  loading: boolean
  error?: string
  data: Partial<CheckoutData>
  summary?: CheckoutSummary
}

// Validación de stock
export interface StockValidation {
  isValid: boolean
  errors: Array<{
    variantId: number
    requestedQuantity: number
    availableStock: number
    message: string
  }>
}

// Validación de cupón
export interface CouponValidation {
  isValid: boolean
  coupon?: Coupons
  discountAmount: number
  error?: string
}

// Datos del usuario para el checkout
export interface CheckoutUser {
  id: number
  name: string
  lastname: string
  email: string
  phone: string
  addresses: CustomersAddresses[]
  defaultAddressId?: number
}
