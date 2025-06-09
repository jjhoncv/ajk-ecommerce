import {
  mapPromotionVariant,
  mapPromotionVariants
} from '@/mappers/mapPromotionVariant'
import oPromotionVariantRep from '@/repository/PromotionVariant.repository'

import { promotion_variants as PromotionVariantRaw } from '@/types/database'
import { PromotionVariants as PromotionVariant } from '@/types/domain'

export class PromotionVariantModel {
  // ✅ Obtener todas las promotion variants
  public async getPromotionVariants(): Promise<PromotionVariant[] | undefined> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariants()
    return mapPromotionVariants(promotionVariantsRaw)
  }

  // ✅ Obtener promotion variants por variant ID
  public async getPromotionVariantsByVariantId(
    variantId: number
  ): Promise<PromotionVariant[] | undefined> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariantsByVariantId(variantId)
    return mapPromotionVariants(promotionVariantsRaw)
  }

  // ✅ Obtener promotion variants por promotion ID
  public async getPromotionVariantsByPromotionId(
    promotionId: number
  ): Promise<PromotionVariant[] | undefined> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariantsByPromotionId(promotionId)
    return mapPromotionVariants(promotionVariantsRaw)
  }

  // ✅ Obtener promotion variant específica
  public async getPromotionVariant(
    promotionId: number,
    variantId: number
  ): Promise<PromotionVariant | undefined> {
    const promotionVariantRaw = await oPromotionVariantRep.getPromotionVariant(
      promotionId,
      variantId
    )

    if (!promotionVariantRaw) return undefined

    return mapPromotionVariant(promotionVariantRaw)
  }

  // ✅ Verificar si existe una promoción para un variant específico
  public async hasPromotionForVariant(
    promotionId: number,
    variantId: number
  ): Promise<boolean> {
    const promotion = await this.getPromotionVariant(promotionId, variantId)
    return promotion !== undefined
  }

  // ✅ Obtener promotion variants para múltiples variants (batch loading)
  public async getPromotionVariantsByVariantIds(
    variantIds: number[]
  ): Promise<Map<number, PromotionVariant[]>> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariantsByVariantIds(variantIds)

    if (!promotionVariantsRaw) return new Map()

    // Agrupar promotion variants por variant_id
    const promotionsByVariantId = new Map<number, PromotionVariant[]>()

    for (const promotionRaw of promotionVariantsRaw) {
      const promotion = mapPromotionVariant(promotionRaw)
      const variantId = promotion.variantId

      if (!promotionsByVariantId.has(variantId)) {
        promotionsByVariantId.set(variantId, [])
      }

      promotionsByVariantId.get(variantId)!.push(promotion)
    }

    return promotionsByVariantId
  }

  // ✅ Obtener promotion variants para múltiples promotions (batch loading)
  public async getPromotionVariantsByPromotionIds(
    promotionIds: number[]
  ): Promise<Map<number, PromotionVariant[]>> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariantsByPromotionIds(
        promotionIds
      )

    if (!promotionVariantsRaw) return new Map()

    // Agrupar promotion variants por promotion_id
    const variantsByPromotionId = new Map<number, PromotionVariant[]>()

    for (const promotionRaw of promotionVariantsRaw) {
      const promotion = mapPromotionVariant(promotionRaw)
      const promotionId = promotion.promotionId

      if (!variantsByPromotionId.has(promotionId)) {
        variantsByPromotionId.set(promotionId, [])
      }

      variantsByPromotionId.get(promotionId)!.push(promotion)
    }

    return variantsByPromotionId
  }

  // ✅ Obtener la mejor promoción para un variant (lógica de negocio)
  public async getBestPromotionForVariant(
    variantId: number
  ): Promise<PromotionVariant | undefined> {
    const promotions = await this.getPromotionVariantsByVariantId(variantId)

    if (!promotions || promotions.length === 0) return undefined

    // Lógica de negocio: encontrar la promoción con menor precio
    return promotions.reduce((best, current) => {
      // Comparar por precio promocional (menor es mejor)
      if (!best.promotionPrice && current.promotionPrice) return current
      if (best.promotionPrice && !current.promotionPrice) return best
      if (!best.promotionPrice && !current.promotionPrice) return best

      return current.promotionPrice! < best.promotionPrice! ? current : best
    })
  }

  // ✅ Obtener promociones con stock disponible (lógica de negocio)
  public async getPromotionsWithStock(
    variantId: number
  ): Promise<PromotionVariant[] | undefined> {
    const promotions = await this.getPromotionVariantsByVariantId(variantId)

    if (!promotions) return undefined

    // Filtrar promociones que tengan stock disponible (sin límite o con límite > 0)
    return promotions.filter(
      (promotion) => !promotion.stockLimit || promotion.stockLimit > 0
    )
  }

  // ✅ Validar datos de promotion variant antes de crear (lógica de negocio)
  private validatePromotionVariantData(
    data: Omit<PromotionVariantRaw, 'created_at'>
  ): void {
    // Validar que el precio promocional sea positivo si existe
    if (
      data.promotion_price !== null &&
      data.promotion_price !== undefined &&
      data.promotion_price <= 0
    ) {
      throw new Error('Promotion price must be positive')
    }

    // Validar que el stock limit sea positivo si existe
    if (
      data.stock_limit !== null &&
      data.stock_limit !== undefined &&
      data.stock_limit < 0
    ) {
      throw new Error('Stock limit must be non-negative')
    }

    // Validar que promotion_id y variant_id sean válidos
    if (!data.promotion_id || data.promotion_id <= 0) {
      throw new Error('Valid promotion ID is required')
    }

    if (!data.variant_id || data.variant_id <= 0) {
      throw new Error('Valid variant ID is required')
    }
  }

  // ✅ Crear promotion variant (con validación de negocio)
  public async createPromotionVariant(
    promotionVariantData: Omit<PromotionVariantRaw, 'created_at'>
  ): Promise<PromotionVariant | undefined> {
    // Validar datos
    this.validatePromotionVariantData(promotionVariantData)

    // Verificar que no exista ya esta combinación promotion-variant
    const exists = await this.hasPromotionForVariant(
      promotionVariantData.promotion_id,
      promotionVariantData.variant_id
    )

    if (exists) {
      throw new Error('Promotion variant already exists for this combination')
    }

    const created =
      await oPromotionVariantRep.createPromotionVariant(promotionVariantData)

    if (!created) return undefined

    return mapPromotionVariant(created)
  }

  // ✅ Actualizar promotion variant
  public async updatePromotionVariant(
    promotionVariantData: Partial<
      Omit<PromotionVariantRaw, 'promotion_id' | 'variant_id' | 'created_at'>
    >,
    promotionId: number,
    variantId: number
  ): Promise<PromotionVariant | undefined> {
    // Verificar que la promotion variant existe
    const exists = await this.hasPromotionForVariant(promotionId, variantId)

    if (!exists) {
      throw new Error('Promotion variant not found')
    }

    // Validar datos a actualizar
    if (promotionVariantData.promotion_price !== undefined) {
      if (
        promotionVariantData.promotion_price !== null &&
        promotionVariantData.promotion_price <= 0
      ) {
        throw new Error('Promotion price must be positive')
      }
    }

    if (promotionVariantData.stock_limit !== undefined) {
      if (
        promotionVariantData.stock_limit !== null &&
        promotionVariantData.stock_limit < 0
      ) {
        throw new Error('Stock limit must be non-negative')
      }
    }

    const updated = await oPromotionVariantRep.updatePromotionVariant(
      promotionVariantData,
      promotionId,
      variantId
    )

    if (!updated) return undefined

    return mapPromotionVariant(updated)
  }

  // ✅ Actualizar stock de una promoción (lógica de negocio común)
  public async updatePromotionStock(
    promotionId: number,
    variantId: number,
    newStock: number
  ): Promise<PromotionVariant | undefined> {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative')
    }

    return await this.updatePromotionVariant(
      { stock_limit: newStock },
      promotionId,
      variantId
    )
  }

  // ✅ Decrementar stock de promoción (para compras)
  public async decrementPromotionStock(
    promotionId: number,
    variantId: number,
    quantity: number = 1
  ): Promise<PromotionVariant | undefined> {
    const promotion = await this.getPromotionVariant(promotionId, variantId)

    if (!promotion) {
      throw new Error('Promotion variant not found')
    }

    if (!promotion.stockLimit) {
      // Si no hay límite de stock, no hacer nada
      return promotion
    }

    const newStock = promotion.stockLimit - quantity

    if (newStock < 0) {
      throw new Error('Insufficient stock for promotion')
    }

    return await this.updatePromotionStock(promotionId, variantId, newStock)
  }

  // ✅ Eliminar promotion variant específica
  public async deletePromotionVariant(
    promotionId: number,
    variantId: number
  ): Promise<void> {
    // Verificar que existe antes de eliminar
    const exists = await this.hasPromotionForVariant(promotionId, variantId)

    if (!exists) {
      throw new Error('Promotion variant not found')
    }

    return await oPromotionVariantRep.deletePromotionVariant(
      promotionId,
      variantId
    )
  }

  // ✅ Eliminar todas las promotion variants de un variant
  public async deletePromotionVariantsByVariantId(
    variantId: number
  ): Promise<void> {
    return await oPromotionVariantRep.deletePromotionVariantsByVariantId(
      variantId
    )
  }

  // ✅ Eliminar todas las promotion variants de una promotion
  public async deletePromotionVariantsByPromotionId(
    promotionId: number
  ): Promise<void> {
    return await oPromotionVariantRep.deletePromotionVariantsByPromotionId(
      promotionId
    )
  }

  // ✅ Obtener resumen de promociones para un variant (lógica de negocio)
  public async getPromotionSummaryForVariant(variantId: number): Promise<{
    totalPromotions: number
    bestPromotion: PromotionVariant | undefined
    availablePromotions: PromotionVariant[] | undefined
    averageDiscountPercentage: number
  }> {
    const [allPromotions, bestPromotion, availablePromotions] =
      await Promise.all([
        this.getPromotionVariantsByVariantId(variantId),
        this.getBestPromotionForVariant(variantId),
        this.getPromotionsWithStock(variantId)
      ])

    const totalPromotions = allPromotions?.length || 0

    // Calcular descuento promedio (esto requeriría el precio original del variant)
    // Por ahora simplificado
    const averageDiscountPercentage = 0

    return {
      totalPromotions,
      bestPromotion,
      availablePromotions,
      averageDiscountPercentage
    }
  }

  // ✅ Obtener métricas de promociones para dashboard (lógica de negocio)
  public async getPromotionMetrics(promotionId: number): Promise<
    | {
        totalVariants: number
        variantsWithStock: number
        totalStockLimit: number
        averagePromotionPrice: number
      }
    | undefined
  > {
    const promotionVariants =
      await this.getPromotionVariantsByPromotionId(promotionId)

    if (!promotionVariants || promotionVariants.length === 0) return undefined

    const totalVariants = promotionVariants.length
    const variantsWithStock = promotionVariants.filter(
      (pv) => !pv.stockLimit || pv.stockLimit > 0
    ).length

    const totalStockLimit = promotionVariants.reduce(
      (sum, pv) => sum + (pv.stockLimit || 0),
      0
    )

    const promotionPrices = promotionVariants
      .filter((pv) => pv.promotionPrice)
      .map((pv) => pv.promotionPrice!)

    const averagePromotionPrice =
      promotionPrices.length > 0
        ? promotionPrices.reduce((sum, price) => sum + price, 0) /
          promotionPrices.length
        : 0

    return {
      totalVariants,
      variantsWithStock,
      totalStockLimit,
      averagePromotionPrice: Number(averagePromotionPrice.toFixed(2))
    }
  }
}

const promotionVariantModel = new PromotionVariantModel()
export default promotionVariantModel
