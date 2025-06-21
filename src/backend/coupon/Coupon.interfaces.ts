// 📄 backend/coupon/Coupon.interfaces.ts
import { type Coupons } from '@/types/domain'

// Cupón con estadísticas de uso
export interface CouponWithStats extends Coupons {
  totalUsages: number
  totalDiscountAmount: number
  uniqueCustomers: number
  lastUsed?: Date
}

// Validación de cupón
export interface CouponValidationResult {
  isValid: boolean
  coupon?: Coupons
  discountAmount: number
  error?: string
  reason?: string
}

// Filtros para buscar cupones
export interface CouponFilters {
  isActive?: boolean
  discountType?: 'percentage' | 'fixed_amount'
  applicableTo?: 'all' | 'categories' | 'products'
  startDate?: Date
  endDate?: Date
  minDiscountValue?: number
  maxDiscountValue?: number
  hasUsageLimit?: boolean
  isExpired?: boolean
}

// Datos para aplicar un cupón
export interface ApplyCouponData {
  couponCode: string
  customerId: number
  orderId: number
  orderTotal: number
  applicableItems?: Array<{
    productId?: number
    categoryId?: number
    amount: number
  }>
}

// Resultado de aplicar cupón
export interface ApplyCouponResult {
  success: boolean
  discountAmount: number
  finalAmount: number
  error?: string
  couponUsageId?: number
}

// Estadísticas de cupón
export interface CouponStats {
  totalCoupons: number
  activeCoupons: number
  expiredCoupons: number
  totalUsages: number
  totalDiscountGiven: number
  averageDiscountPerUsage: number
  topCoupons: Array<{
    coupon: Coupons
    usageCount: number
    discountGiven: number
  }>
}
