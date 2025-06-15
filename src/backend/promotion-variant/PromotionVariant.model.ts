import { PromotionVariants as PromotionVariantRaw } from '@/types/database'
import { PromotionVariants as PromotionVariant } from '@/types/domain'

// me
import promotionModel from '@/backend/promotion/Promotion.model'
import {
  PromotionMetrics,
  PromotionSummaryForVariant
} from './PromotionVariant.interfaces'
import {
  PromotionVariantMapper,
  PromotionVariantsMapper
} from './PromotionVariant.mapper'
import oPromotionVariantRep from './PromotionVariant.repository'

export class PromotionVariantModel {
  // ============================================================================
  // MÉTODOS BÁSICOS
  // ============================================================================

  public async getPromotionVariants(): Promise<PromotionVariant[] | undefined> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariants()
    return PromotionVariantsMapper(promotionVariantsRaw)
  }

  public async getPromotionVariantsByVariantId(
    variantId: number
  ): Promise<PromotionVariant[] | undefined> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariantsByVariantId(variantId)
    return PromotionVariantsMapper(promotionVariantsRaw)
  }

  public async getPromotionVariantsByPromotionId(
    promotionId: number
  ): Promise<PromotionVariant[] | undefined> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariantsByPromotionId(promotionId)
    return PromotionVariantsMapper(promotionVariantsRaw)
  }

  public async getPromotionVariant(
    promotionId: number,
    variantId: number
  ): Promise<PromotionVariant | undefined> {
    const promotionVariantRaw = await oPromotionVariantRep.getPromotionVariant(
      promotionId,
      variantId
    )
    if (!promotionVariantRaw) return undefined
    return PromotionVariantMapper(promotionVariantRaw)
  }

  public async hasPromotionForVariant(
    promotionId: number,
    variantId: number
  ): Promise<boolean> {
    const promotion = await this.getPromotionVariant(promotionId, variantId)
    return promotion !== undefined
  }

  // ============================================================================
  // BATCH LOADING
  // ============================================================================

  public async getPromotionVariantsByVariantIds(
    variantIds: number[]
  ): Promise<Map<number, PromotionVariant[]>> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariantsByVariantIds(variantIds)

    if (!promotionVariantsRaw) return new Map()

    const promotionsByVariantId = new Map<number, PromotionVariant[]>()

    for (const promotionRaw of promotionVariantsRaw) {
      const promotion = PromotionVariantMapper(promotionRaw)
      const variantId = promotion.variantId

      if (!promotionsByVariantId.has(variantId)) {
        promotionsByVariantId.set(variantId, [])
      }

      promotionsByVariantId.get(variantId)!.push(promotion)
    }

    return promotionsByVariantId
  }

  public async getPromotionVariantsByPromotionIds(
    promotionIds: number[]
  ): Promise<Map<number, PromotionVariant[]>> {
    const promotionVariantsRaw =
      await oPromotionVariantRep.getPromotionVariantsByPromotionIds(
        promotionIds
      )

    if (!promotionVariantsRaw) return new Map()

    const variantsByPromotionId = new Map<number, PromotionVariant[]>()

    for (const promotionRaw of promotionVariantsRaw) {
      const promotion = PromotionVariantMapper(promotionRaw)
      const promotionId = promotion.promotionId

      if (!variantsByPromotionId.has(promotionId)) {
        variantsByPromotionId.set(promotionId, [])
      }

      variantsByPromotionId.get(promotionId)!.push(promotion)
    }

    return variantsByPromotionId
  }

  // ============================================================================
  // LÓGICA DE NEGOCIO
  // ============================================================================

  public async getPromotionsForVariant(
    variantId: number
  ): Promise<PromotionVariant[] | undefined> {
    const promotionsVariant =
      await this.getPromotionVariantsByVariantId(variantId)

    const promotions = await Promise.all(
      (promotionsVariant ?? []).map(async (promotionVariant) => {
        return {
          ...promotionVariant,
          createdAt: promotionVariant.createdAt,
          stockLimit: promotionVariant.stockLimit,
          promotionId: promotionVariant.promotionId,
          promotion: await promotionModel.getPromotionById(
            promotionVariant?.promotionId
          )
        }
      })
    )

    if (!promotions || promotions.length === 0) return undefined

    const promotionsActive: PromotionVariant[] = promotions.filter(
      (promotion) => promotion.promotion?.isActive
    )

    const promotionsWithStock: PromotionVariant[] = promotionsActive.filter(
      (promotion) => promotion.stockLimit > 0
    )

    const promotionsAvailable: PromotionVariant[] = promotionsWithStock.filter(
      (promotionVariant) => {
        // if (promotionVariant.promotion) return false
        if (promotionVariant.promotion) {
          // const now > Date(promotion.promotion?.startDate)
          const now = new Date()
          const startDate = new Date(promotionVariant.promotion.startDate)
          const endDate = new Date(promotionVariant.promotion.endDate)

          if (now > startDate && now < endDate) {
            return promotionVariant
          }
        }
      }
    )

    return promotionsAvailable
  }

  public async getBestPromotionForVariant(
    variantId: number
  ): Promise<PromotionVariant | undefined> {
    const promotions = await this.getPromotionVariantsByVariantId(variantId)

    if (!promotions || promotions.length === 0) return undefined

    const promotionsActive: PromotionVariant[] = promotions.filter(
      (promotion) => promotion.promotion?.isActive
    )

    const promotionsWithStock: PromotionVariant[] = promotionsActive.filter(
      (promotion) => promotion.stockLimit > 0
    )

    const promotionsAvailable: PromotionVariant[] = promotionsWithStock.filter(
      (promotionVariant) => {
        // if (promotionVariant.promotion) return false
        if (promotionVariant.promotion) {
          // const now > Date(promotion.promotion?.startDate)
          const now = new Date()
          const startDate = new Date(promotionVariant.promotion.startDate)
          const endDate = new Date(promotionVariant.promotion.endDate)

          if (now > startDate && now < endDate) {
            return promotionVariant
          }
        }
      }
    )

    if (promotionsAvailable.length === 0) return undefined

    return promotionsAvailable

    // return promotionsAvailable.reduce((best, current) => {
    //   if (!best.promotionPrice && current.promotionPrice) return current
    //   if (best.promotionPrice && !current.promotionPrice) return best
    //   if (!best.promotionPrice && !current.promotionPrice) return best

    //   return current.promotionPrice! < best.promotionPrice! ? current : best
    // })
  }

  public async getPromotionsWithStock(
    variantId: number
  ): Promise<PromotionVariant[] | undefined> {
    const promotions = await this.getPromotionVariantsByVariantId(variantId)

    if (!promotions) return undefined

    return promotions.filter(
      (promotion) => !promotion.stockLimit || promotion.stockLimit > 0
    )
  }

  private validatePromotionVariantData(
    data: Omit<PromotionVariantRaw, 'created_at'>
  ): void {
    if (
      data.promotion_price !== null &&
      data.promotion_price !== undefined &&
      data.promotion_price <= 0
    ) {
      throw new Error('Promotion price must be positive')
    }

    if (
      data.stock_limit !== null &&
      data.stock_limit !== undefined &&
      data.stock_limit < 0
    ) {
      throw new Error('Stock limit must be non-negative')
    }

    if (!data.promotion_id || data.promotion_id <= 0) {
      throw new Error('Valid promotion ID is required')
    }

    if (!data.variant_id || data.variant_id <= 0) {
      throw new Error('Valid variant ID is required')
    }
  }

  public async createPromotionVariant(
    promotionVariantData: Omit<PromotionVariantRaw, 'created_at'>
  ): Promise<PromotionVariant | undefined> {
    this.validatePromotionVariantData(promotionVariantData)

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
    return PromotionVariantMapper(created)
  }

  public async updatePromotionVariant(
    promotionVariantData: Partial<
      Omit<PromotionVariantRaw, 'promotion_id' | 'variant_id' | 'created_at'>
    >,
    promotionId: number,
    variantId: number
  ): Promise<PromotionVariant | undefined> {
    const exists = await this.hasPromotionForVariant(promotionId, variantId)

    if (!exists) {
      throw new Error('Promotion variant not found')
    }

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
    return PromotionVariantMapper(updated)
  }

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
      return promotion
    }

    const newStock = promotion.stockLimit - quantity

    if (newStock < 0) {
      throw new Error('Insufficient stock for promotion')
    }

    return await this.updatePromotionStock(promotionId, variantId, newStock)
  }

  public async deletePromotionVariant(
    promotionId: number,
    variantId: number
  ): Promise<void> {
    const exists = await this.hasPromotionForVariant(promotionId, variantId)

    if (!exists) {
      throw new Error('Promotion variant not found')
    }

    return await oPromotionVariantRep.deletePromotionVariant(
      promotionId,
      variantId
    )
  }

  public async deletePromotionVariantsByVariantId(
    variantId: number
  ): Promise<void> {
    return await oPromotionVariantRep.deletePromotionVariantsByVariantId(
      variantId
    )
  }

  public async deletePromotionVariantsByPromotionId(
    promotionId: number
  ): Promise<void> {
    return await oPromotionVariantRep.deletePromotionVariantsByPromotionId(
      promotionId
    )
  }

  // ============================================================================
  // MÉTRICAS Y RESÚMENES
  // ============================================================================

  public async getPromotionSummaryForVariant(
    variantId: number
  ): Promise<PromotionSummaryForVariant> {
    const [allPromotions, bestPromotion, availablePromotions] =
      await Promise.all([
        this.getPromotionVariantsByVariantId(variantId),
        this.getBestPromotionForVariant(variantId),
        this.getPromotionsWithStock(variantId)
      ])

    const totalPromotions = allPromotions?.length || 0
    const averageDiscountPercentage = 0

    return {
      totalPromotions,
      bestPromotion,
      availablePromotions,
      averageDiscountPercentage
    }
  }

  public async getPromotionMetrics(
    promotionId: number
  ): Promise<PromotionMetrics | undefined> {
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
