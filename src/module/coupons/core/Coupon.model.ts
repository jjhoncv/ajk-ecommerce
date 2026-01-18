import { type CouponUsage as CouponUsageRaw } from '@/types/database'
import { type Coupons as Coupon, type CouponUsage } from '@/types/domain'

import {
  type ApplyCouponData,
  type ApplyCouponResult,
  type CouponFilters,
  type CouponStats,
  type CouponValidationResult,
  type CouponWithStats
} from './Coupon.interfaces'
import { CouponMapper, CouponsMapper, CouponToRawMapper } from './Coupon.mapper'
import oCouponRep from './Coupon.repository'

export class CouponModel {
  public async getCoupons(): Promise<Coupon[] | undefined> {
    const couponsRaw = await oCouponRep.getCoupons()
    return CouponsMapper(couponsRaw)
  }

  public async getActiveCoupons(): Promise<Coupon[] | undefined> {
    const couponsRaw = await oCouponRep.getActiveCoupons()
    return CouponsMapper(couponsRaw)
  }

  public async getCouponById(id: number): Promise<Coupon | undefined> {
    const couponRaw = await oCouponRep.getCouponById(id)
    if (!couponRaw) return undefined
    return CouponMapper(couponRaw)
  }

  public async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const couponRaw = await oCouponRep.getCouponByCode(code)
    if (!couponRaw) return undefined
    return CouponMapper(couponRaw)
  }

  public async getCouponsWithStats(): Promise<CouponWithStats[] | undefined> {
    const couponsRaw = await oCouponRep.getCouponsWithStats()
    if (!couponsRaw) return undefined

    return couponsRaw.map((coupon) => ({
      ...CouponMapper(coupon),
      totalUsages: coupon.total_usages || 0,
      totalDiscountAmount: coupon.total_discount_amount || 0,
      uniqueCustomers: coupon.unique_customers || 0,
      lastUsed: coupon.last_used || undefined
    }))
  }

  public async createCoupon(
    couponData: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'couponUsage'>
  ): Promise<Coupon | undefined> {
    const couponRaw = CouponToRawMapper(couponData)
    const created = await oCouponRep.createCoupon(couponRaw)
    if (!created) return undefined
    return CouponMapper(created)
  }

  public async updateCoupon(
    couponData: Partial<
      Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'couponUsage'>
    >,
    id: number
  ): Promise<Coupon | undefined> {
    // Convert only the fields to be updated
    const updateRaw: any = {}

    if (couponData.name !== undefined) updateRaw.name = couponData.name
    if (couponData.description !== undefined) { updateRaw.description = couponData.description }
    if (couponData.code !== undefined) updateRaw.code = couponData.code
    if (couponData.discountType !== undefined) { updateRaw.discount_type = couponData.discountType }
    if (couponData.discountValue !== undefined) { updateRaw.discount_value = couponData.discountValue }
    if (couponData.startDate !== undefined) { updateRaw.start_date = couponData.startDate }
    if (couponData.endDate !== undefined) { updateRaw.end_date = couponData.endDate }
    if (couponData.isActive !== undefined) { updateRaw.is_active = couponData.isActive }
    if (couponData.usageLimit !== undefined) { updateRaw.usage_limit = couponData.usageLimit }
    if (couponData.usageLimitPerCustomer !== undefined) { updateRaw.usage_limit_per_customer = couponData.usageLimitPerCustomer }
    if (couponData.usedCount !== undefined) { updateRaw.used_count = couponData.usedCount }
    if (couponData.minPurchaseAmount !== undefined) { updateRaw.min_purchase_amount = couponData.minPurchaseAmount }
    if (couponData.maxDiscountAmount !== undefined) { updateRaw.max_discount_amount = couponData.maxDiscountAmount }
    if (couponData.applicableTo !== undefined) { updateRaw.applicable_to = couponData.applicableTo }
    if (couponData.applicableIds !== undefined) {
      updateRaw.applicable_ids = couponData.applicableIds
        ? JSON.stringify(couponData.applicableIds)
        : null
    }

    const updated = await oCouponRep.updateCoupon(updateRaw, id)
    if (!updated) return undefined
    return CouponMapper(updated)
  }

  public async deleteCoupon(id: number): Promise<void> {
    await oCouponRep.deleteCoupon(id)
  }

  public async activateCoupon(id: number): Promise<void> {
    await oCouponRep.activateCoupon(id)
  }

  public async deactivateCoupon(id: number): Promise<void> {
    await oCouponRep.deactivateCoupon(id)
  }

  // Validate coupon for a specific customer and amount
  public async validateCoupon(
    code: string,
    customerId: number,
    orderTotal: number,
    applicableItems?: Array<{
      productId?: number
      categoryId?: number
      amount: number
    }>
  ): Promise<CouponValidationResult> {
    try {
      console.log('validateCoupon - Looking for coupon with code:', code)
      const coupon = await this.getCouponByCode(code)
      console.log('validateCoupon - Coupon found:', coupon)

      if (!coupon) {
        return {
          isValid: false,
          discountAmount: 0,
          error: 'Cupón no válido'
        }
      }

      // Check if active (is_active can be 0, 1 or null)
      console.log('validateCoupon - isActive value:', coupon.isActive, 'type:', typeof coupon.isActive)
      if (coupon.isActive !== 1) {
        return {
          isValid: false,
          discountAmount: 0,
          error: 'Cupón no activo'
        }
      }

      // Check dates
      const now = new Date()
      if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
        return {
          isValid: false,
          discountAmount: 0,
          error: 'Cupón expirado'
        }
      }

      // Check minimum amount
      if (coupon.minPurchaseAmount && orderTotal < coupon.minPurchaseAmount) {
        return {
          isValid: false,
          discountAmount: 0,
          error: `Monto mínimo requerido: S/ ${coupon.minPurchaseAmount}`
        }
      }

      // Check general usage limit
      if (
        coupon.usageLimit &&
        coupon.usedCount &&
        coupon.usedCount >= coupon.usageLimit
      ) {
        return {
          isValid: false,
          discountAmount: 0,
          error: 'Cupón agotado'
        }
      }

      // Check per customer usage limit
      if (coupon.usageLimitPerCustomer) {
        const customerUsage = await oCouponRep.getCouponUsageByCustomer(
          coupon.id,
          customerId
        )
        if (customerUsage >= coupon.usageLimitPerCustomer) {
          return {
            isValid: false,
            discountAmount: 0,
            error: 'Límite de uso excedido para este cliente'
          }
        }
      }

      // Calculate discount
      let discountAmount = 0
      let applicableAmount = orderTotal

      // If coupon is specific to products/categories
      if (
        coupon.applicableTo &&
        coupon.applicableTo !== 'all' &&
        applicableItems
      ) {
        applicableAmount = this.calculateApplicableAmount(
          coupon,
          applicableItems
        )

        if (applicableAmount === 0) {
          return {
            isValid: false,
            discountAmount: 0,
            error: 'Cupón no aplicable a los productos seleccionados'
          }
        }
      }

      if (coupon.discountType === 'percentage') {
        discountAmount = (applicableAmount * coupon.discountValue) / 100

        // Apply max discount if exists
        if (
          coupon.maxDiscountAmount &&
          discountAmount > coupon.maxDiscountAmount
        ) {
          discountAmount = coupon.maxDiscountAmount
        }
      } else {
        discountAmount = Math.min(coupon.discountValue, applicableAmount)
      }

      return {
        isValid: true,
        coupon,
        discountAmount,
        reason: `Descuento aplicado: S/ ${discountAmount.toFixed(2)}`
      }
    } catch (error) {
      console.error('Error validating coupon:', error)
      return {
        isValid: false,
        discountAmount: 0,
        error: 'Error validando cupón'
      }
    }
  }

  // Apply coupon to an order
  public async applyCoupon(data: ApplyCouponData): Promise<ApplyCouponResult> {
    try {
      const validation = await this.validateCoupon(
        data.couponCode,
        data.customerId,
        data.orderTotal,
        data.applicableItems
      )

      if (!validation.isValid || !validation.coupon) {
        return {
          success: false,
          discountAmount: 0,
          finalAmount: data.orderTotal,
          error: validation.error
        }
      }

      // Register coupon usage
      const usageData: Omit<CouponUsageRaw, 'id'> = {
        coupon_id: validation.coupon.id,
        customer_id: data.customerId,
        order_id: data.orderId,
        discount_amount: validation.discountAmount,
        used_at: new Date()
      }

      const couponUsage = await oCouponRep.createCouponUsage(usageData)

      if (!couponUsage) {
        return {
          success: false,
          discountAmount: 0,
          finalAmount: data.orderTotal,
          error: 'Error registrando uso del cupón'
        }
      }

      // Increment usage counter
      await oCouponRep.incrementUsageCount(validation.coupon.id)

      const finalAmount = data.orderTotal - validation.discountAmount

      return {
        success: true,
        discountAmount: validation.discountAmount,
        finalAmount,
        couponUsageId: couponUsage.id
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      return {
        success: false,
        discountAmount: 0,
        finalAmount: data.orderTotal,
        error: 'Error aplicando cupón'
      }
    }
  }

  // Calculate applicable amount based on coupon restrictions
  private calculateApplicableAmount(
    coupon: Coupon,
    items: Array<{ productId?: number, categoryId?: number, amount: number }>
  ): number {
    if (!coupon.applicableIds) return 0

    let applicableIds: number[] = []

    try {
      applicableIds =
        typeof coupon.applicableIds === 'string'
          ? JSON.parse(coupon.applicableIds)
          : coupon.applicableIds
    } catch {
      return 0
    }

    let totalApplicable = 0

    for (const item of items) {
      if (coupon.applicableTo === 'products' && item.productId) {
        if (applicableIds.includes(item.productId)) {
          totalApplicable += item.amount
        }
      } else if (coupon.applicableTo === 'categories' && item.categoryId) {
        if (applicableIds.includes(item.categoryId)) {
          totalApplicable += item.amount
        }
      }
    }

    return totalApplicable
  }

  // Get general statistics
  public async getCouponStats(): Promise<CouponStats | undefined> {
    const statsRaw = await oCouponRep.getCouponStats()
    if (!statsRaw) return undefined

    const averageDiscountPerUsage =
      statsRaw.total_usages > 0
        ? statsRaw.total_discount_given / statsRaw.total_usages
        : 0

    // Get top coupons
    const topCouponsRaw = await oCouponRep.getCouponsWithStats()
    const topCoupons =
      topCouponsRaw?.slice(0, 5).map((coupon) => ({
        coupon: CouponMapper(coupon),
        usageCount: coupon.total_usages || 0,
        discountGiven: coupon.total_discount_amount || 0
      })) || []

    return {
      totalCoupons: statsRaw.total_coupons || 0,
      activeCoupons: statsRaw.active_coupons || 0,
      expiredCoupons: statsRaw.expired_coupons || 0,
      totalUsages: statsRaw.total_usages || 0,
      totalDiscountGiven: statsRaw.total_discount_given || 0,
      averageDiscountPerUsage,
      topCoupons
    }
  }

  // Filter coupons
  public async getFilteredCoupons(
    filters: CouponFilters
  ): Promise<Coupon[] | undefined> {
    const couponsRaw = await oCouponRep.getCouponsByFilters({
      isActive: filters.isActive,
      discountType: filters.discountType,
      applicableTo: filters.applicableTo,
      isExpired: filters.isExpired
    })

    let coupons = CouponsMapper(couponsRaw)
    if (!coupons) return undefined

    // Apply additional filters in memory
    if (filters.startDate) {
      coupons = coupons.filter(
        (coupon) => new Date(coupon.startDate) >= filters.startDate!
      )
    }

    if (filters.endDate) {
      coupons = coupons.filter(
        (coupon) => new Date(coupon.endDate) <= filters.endDate!
      )
    }

    if (filters.minDiscountValue !== undefined) {
      coupons = coupons.filter(
        (coupon) => coupon.discountValue >= filters.minDiscountValue!
      )
    }

    if (filters.maxDiscountValue !== undefined) {
      coupons = coupons.filter(
        (coupon) => coupon.discountValue <= filters.maxDiscountValue!
      )
    }

    if (filters.hasUsageLimit !== undefined) {
      coupons = coupons.filter((coupon) =>
        filters.hasUsageLimit
          ? coupon.usageLimit !== null
          : coupon.usageLimit === null
      )
    }

    return coupons
  }

  // Check if code already exists
  public async codeExists(code: string, excludeId?: number): Promise<boolean> {
    return await oCouponRep.codeExists(code, excludeId)
  }

  // Get coupon usages
  public async getCouponUsages(
    couponId: number
  ): Promise<CouponUsage[] | undefined> {
    const usagesRaw = await oCouponRep.getCouponUsages(couponId)
    if (!usagesRaw) return undefined

    return usagesRaw.map((usage) => ({
      id: usage.id,
      couponId: usage.coupon_id,
      customerId: usage.customer_id,
      orderId: usage.order_id,
      discountAmount: usage.discount_amount,
      usedAt: usage.used_at,
      coupon: null, // Can be loaded separately if needed
      customer: null, // Can be loaded separately if needed
      order: null // Can be loaded separately if needed
    }))
  }

  // Generate unique coupon code
  public async generateUniqueCode(prefix: string = 'COUPON'): Promise<string> {
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const randomSuffix = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
      const code = `${prefix}-${randomSuffix}`

      const exists = await this.codeExists(code)
      if (!exists) {
        return code
      }

      attempts++
    }

    // If unable to generate unique code, use timestamp
    const timestamp = Date.now().toString(36).toUpperCase()
    return `${prefix}-${timestamp}`
  }

  // Check if coupon is expired
  public isCouponExpired(coupon: Coupon): boolean {
    return new Date() > new Date(coupon.endDate)
  }

  // Check if coupon is active and valid
  public isCouponValid(coupon: Coupon): boolean {
    const now = new Date()
    return (
      coupon.isActive === 1 &&
      now >= new Date(coupon.startDate) &&
      now <= new Date(coupon.endDate)
    )
  }

  // Calculate discount without applying
  public calculateDiscount(
    coupon: Coupon,
    amount: number
  ): { discountAmount: number, finalAmount: number } {
    let discountAmount = 0

    if (coupon.discountType === 'percentage') {
      discountAmount = (amount * coupon.discountValue) / 100

      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, amount)
    }

    return {
      discountAmount,
      finalAmount: amount - discountAmount
    }
  }
}

const couponModel = new CouponModel()
export default couponModel
