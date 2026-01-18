export interface Coupon {
  id: number
  name: string
  code: string
  description?: string | null
  discountType: 'fixed_amount' | 'percentage'
  discountValue: number
  startDate: Date
  endDate: Date
  minPurchaseAmount?: number | null
  maxDiscountAmount?: number | null
  usageLimit?: number | null
  usageLimitPerCustomer?: number | null
  usedCount?: number | null
  isActive?: number | null
  applicableTo?: string | null
}

export interface CouponWithStats extends Coupon {
  totalUsages: number
  totalDiscountAmount: number
  uniqueCustomers: number
  lastUsed?: Date
}

export interface CouponStats {
  totalCoupons: number
  activeCoupons: number
  expiredCoupons: number
  totalUsages: number
  totalDiscountGiven: number
}
