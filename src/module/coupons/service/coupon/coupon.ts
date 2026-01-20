import { couponModel } from '../../core'
import userModel from '@/module/users/core/User.model'
import { type CouponStats, type CouponWithStats } from './types'
import { type Coupons } from '@/types/domain'

export interface CouponAudit {
  createdAt: Date | null
  createdByName: string | null
  updatedAt: Date | null
  updatedByName: string | null
}

export interface CouponWithAudit {
  coupon: Coupons
  audit: CouponAudit
}

export const getCouponWithAudit = async (id: number): Promise<CouponWithAudit | null> => {
  const coupon = await couponModel.getCouponById(id)
  if (!coupon) return null

  // Obtener nombres de usuarios
  const [createdByName, updatedByName] = await Promise.all([
    coupon.createdBy ? userModel.getUserFullName(coupon.createdBy) : null,
    coupon.updatedBy ? userModel.getUserFullName(coupon.updatedBy) : null
  ])

  return {
    coupon,
    audit: {
      createdAt: coupon.createdAt ?? null,
      createdByName,
      updatedAt: coupon.updatedAt ?? null,
      updatedByName
    }
  }
}

export const getCoupons = async (): Promise<CouponWithStats[]> => {
  const coupons = await couponModel.getCouponsWithStats()
  if (!coupons) return []

  return coupons.map((coupon) => ({
    id: coupon.id,
    name: coupon.name,
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType as 'fixed_amount' | 'percentage',
    discountValue: Number(coupon.discountValue),
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    minPurchaseAmount: coupon.minPurchaseAmount,
    maxDiscountAmount: coupon.maxDiscountAmount,
    usageLimit: coupon.usageLimit,
    usageLimitPerCustomer: coupon.usageLimitPerCustomer,
    usedCount: coupon.usedCount,
    isActive: coupon.isActive,
    applicableTo: coupon.applicableTo,
    totalUsages: coupon.totalUsages,
    totalDiscountAmount: Number(coupon.totalDiscountAmount),
    uniqueCustomers: coupon.uniqueCustomers,
    lastUsed: coupon.lastUsed
  }))
}

export const getCouponStats = async (): Promise<CouponStats | null> => {
  const stats = await couponModel.getCouponStats()
  if (!stats) return null

  return {
    totalCoupons: stats.totalCoupons,
    activeCoupons: stats.activeCoupons,
    expiredCoupons: stats.expiredCoupons,
    totalUsages: stats.totalUsages,
    totalDiscountGiven: Number(stats.totalDiscountGiven)
  }
}

export const deleteCoupon = async (id: number): Promise<void> => {
  await couponModel.deleteCoupon(id)
}
