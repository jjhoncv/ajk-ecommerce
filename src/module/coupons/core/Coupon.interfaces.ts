import { type Coupons } from '@/types/domain'

// Coupon with usage statistics
export interface CouponWithStats extends Coupons {
  totalUsages: number
  totalDiscountAmount: number
  uniqueCustomers: number
  lastUsed?: Date
}

// Coupon validation result
export interface CouponValidationResult {
  isValid: boolean
  coupon?: Coupons
  discountAmount: number
  error?: string
  reason?: string
}

// Filters for searching coupons
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

// Data for applying a coupon
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

// Result of applying a coupon
export interface ApplyCouponResult {
  success: boolean
  discountAmount: number
  finalAmount: number
  error?: string
  couponUsageId?: number
}

// Coupon statistics
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
