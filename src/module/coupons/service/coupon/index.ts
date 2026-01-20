import { deleteCoupon, getCoupons, getCouponStats, getCouponWithAudit } from './coupon'

export type { CouponAudit, CouponWithAudit } from './coupon'

const CouponService = {
  getCoupons,
  getCouponStats,
  getCouponWithAudit,
  deleteCoupon
}

export default CouponService
