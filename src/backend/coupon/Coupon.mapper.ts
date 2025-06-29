// 📄 backend/coupon/Coupon.mapper.ts
import { type Coupons as CouponRaw } from '@/types/database'
import { type Coupons as CouponDomain } from '@/types/domain'

export function CouponMapper(couponRaw: CouponRaw): CouponDomain {
  return {
    id: couponRaw.id,
    name: couponRaw.name,
    description: couponRaw.description || null,
    code: couponRaw.code,
    discountType: couponRaw.discount_type,
    discountValue: Number(couponRaw.discount_value),
    startDate: couponRaw.start_date,
    endDate: couponRaw.end_date,
    isActive: couponRaw.is_active || null,
    usageLimit: couponRaw.usage_limit || null,
    usageLimitPerCustomer: couponRaw.usage_limit_per_customer || null,
    usedCount: couponRaw.used_count || null,
    minPurchaseAmount: couponRaw.min_purchase_amount || null,
    maxDiscountAmount: couponRaw.max_discount_amount || null,
    applicableTo: couponRaw.applicable_to || null,
    applicableIds: couponRaw.applicable_ids || null,
    couponUsage: null // Se cargará por separado si es necesario
  }
}

export function CouponsMapper(
  couponsRaw: CouponRaw[] | null
): CouponDomain[] | undefined {
  if (!couponsRaw) return undefined
  return couponsRaw.map(CouponMapper)
}

export function CouponToRawMapper(
  coupon: Omit<CouponDomain, 'id' | 'createdAt' | 'updatedAt'>
): Omit<CouponRaw, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: coupon.name,
    description: coupon.description || null,
    code: coupon.code,
    discount_type: coupon.discountType,
    discount_value: Number(coupon.discountValue),
    start_date: coupon.startDate,
    end_date: coupon.endDate,
    is_active: coupon.isActive || null,
    usage_limit: coupon.usageLimit || null,
    usage_limit_per_customer: coupon.usageLimitPerCustomer || null,
    used_count: coupon.usedCount || null,
    min_purchase_amount: coupon.minPurchaseAmount || null,
    max_discount_amount: coupon.maxDiscountAmount || null,
    applicable_to: coupon.applicableTo || null,
    applicable_ids: coupon.applicableIds
      ? JSON.stringify(coupon.applicableIds)
      : null
  }
}
