// 📄 backend/coupon/Coupon.model.ts
import { CouponUsage as CouponUsageRaw } from '@/types/database'
import { Coupons as Coupon, CouponUsage } from '@/types/domain'

import {
  ApplyCouponData,
  ApplyCouponResult,
  CouponFilters,
  CouponStats,
  CouponValidationResult,
  CouponWithStats
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
    // Convertir solo los campos que se van a actualizar
    const updateRaw: any = {}

    if (couponData.name !== undefined) updateRaw.name = couponData.name
    if (couponData.description !== undefined)
      updateRaw.description = couponData.description
    if (couponData.code !== undefined) updateRaw.code = couponData.code
    if (couponData.discountType !== undefined)
      updateRaw.discount_type = couponData.discountType
    if (couponData.discountValue !== undefined)
      updateRaw.discount_value = couponData.discountValue
    if (couponData.startDate !== undefined)
      updateRaw.start_date = couponData.startDate
    if (couponData.endDate !== undefined)
      updateRaw.end_date = couponData.endDate
    if (couponData.isActive !== undefined)
      updateRaw.is_active = couponData.isActive
    if (couponData.usageLimit !== undefined)
      updateRaw.usage_limit = couponData.usageLimit
    if (couponData.usageLimitPerCustomer !== undefined)
      updateRaw.usage_limit_per_customer = couponData.usageLimitPerCustomer
    if (couponData.usedCount !== undefined)
      updateRaw.used_count = couponData.usedCount
    if (couponData.minPurchaseAmount !== undefined)
      updateRaw.min_purchase_amount = couponData.minPurchaseAmount
    if (couponData.maxDiscountAmount !== undefined)
      updateRaw.max_discount_amount = couponData.maxDiscountAmount
    if (couponData.applicableTo !== undefined)
      updateRaw.applicable_to = couponData.applicableTo
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
    return await oCouponRep.deleteCoupon(id)
  }

  public async activateCoupon(id: number): Promise<void> {
    return await oCouponRep.activateCoupon(id)
  }

  public async deactivateCoupon(id: number): Promise<void> {
    return await oCouponRep.deactivateCoupon(id)
  }

  // Validar cupón para un cliente y monto específico
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
      const coupon = await this.getCouponByCode(code)

      if (!coupon) {
        return {
          isValid: false,
          discountAmount: 0,
          error: 'Cupón no válido'
        }
      }

      // Verificar si está activo
      if (!coupon.isActive) {
        return {
          isValid: false,
          discountAmount: 0,
          error: 'Cupón no activo'
        }
      }

      // Verificar fechas
      const now = new Date()
      if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
        return {
          isValid: false,
          discountAmount: 0,
          error: 'Cupón expirado'
        }
      }

      // Verificar monto mínimo
      if (coupon.minPurchaseAmount && orderTotal < coupon.minPurchaseAmount) {
        return {
          isValid: false,
          discountAmount: 0,
          error: `Monto mínimo requerido: S/ ${coupon.minPurchaseAmount}`
        }
      }

      // Verificar límite de uso general
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

      // Verificar límite de uso por cliente
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

      // Calcular descuento
      let discountAmount = 0
      let applicableAmount = orderTotal

      // Si el cupón es específico para productos/categorías
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

        // Aplicar descuento máximo si existe
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

  // Aplicar cupón a una orden
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

      // Registrar el uso del cupón
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

      // Incrementar contador de uso
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

  // Calcular monto aplicable según restricciones del cupón
  private calculateApplicableAmount(
    coupon: Coupon,
    items: Array<{ productId?: number; categoryId?: number; amount: number }>
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

  // Obtener estadísticas generales
  public async getCouponStats(): Promise<CouponStats | undefined> {
    const statsRaw = await oCouponRep.getCouponStats()
    if (!statsRaw) return undefined

    const averageDiscountPerUsage =
      statsRaw.total_usages > 0
        ? statsRaw.total_discount_given / statsRaw.total_usages
        : 0

    // Obtener top cupones
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

  // Filtrar cupones
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

    // Aplicar filtros adicionales en memoria
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

  // Verificar si un código ya existe
  public async codeExists(code: string, excludeId?: number): Promise<boolean> {
    return await oCouponRep.codeExists(code, excludeId)
  }

  // Obtener usos de un cupón
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
      coupon: null, // Se puede cargar por separado si es necesario
      customer: null, // Se puede cargar por separado si es necesario
      order: null // Se puede cargar por separado si es necesario
    }))
  }

  // Generar código único para cupón
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

    // Si no se pudo generar un código único, usar timestamp
    const timestamp = Date.now().toString(36).toUpperCase()
    return `${prefix}-${timestamp}`
  }

  // Verificar si un cupón está expirado
  public isCouponExpired(coupon: Coupon): boolean {
    return new Date() > new Date(coupon.endDate)
  }

  // Verificar si un cupón está activo y válido
  public isCouponValid(coupon: Coupon): boolean {
    const now = new Date()
    return (
      coupon.isActive === 1 &&
      now >= new Date(coupon.startDate) &&
      now <= new Date(coupon.endDate)
    )
  }

  // Calcular descuento sin aplicar
  public calculateDiscount(
    coupon: Coupon,
    amount: number
  ): { discountAmount: number; finalAmount: number } {
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
