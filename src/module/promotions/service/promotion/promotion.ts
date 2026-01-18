import { executeQuery } from '@/lib/db'
import { promotionModel, promotionVariantModel } from '../../core'
import { type Promotion, type PromotionVariantWithInfo, type PromotionWithMetrics } from './types'

export const getPromotions = async (): Promise<Promotion[]> => {
  const promotions = await promotionModel.getPromotions()
  if (!promotions) return []

  return promotions.map((promo) => ({
    id: promo.id,
    name: promo.name,
    description: promo.description,
    discountType: promo.discountType as 'fixed_amount' | 'percentage',
    discountValue: Number(promo.discountValue),
    startDate: promo.startDate,
    endDate: promo.endDate,
    minPurchaseAmount: promo.minPurchaseAmount,
    imageUrl: promo.imageUrl,
    isActive: promo.isActive,
    type: promo.type
  }))
}

export const getPromotionsWithMetrics = async (): Promise<PromotionWithMetrics[]> => {
  const promotions = await getPromotions()

  const promotionsWithMetrics = await Promise.all(
    promotions.map(async (promotion) => {
      const metrics = await promotionVariantModel.getPromotionMetrics(promotion.id)
      return {
        ...promotion,
        variantCount: metrics?.totalVariants || 0,
        variantsWithStock: metrics?.variantsWithStock || 0,
        totalStockLimit: metrics?.totalStockLimit || 0
      }
    })
  )

  return promotionsWithMetrics
}

export const getPromotionById = async (id: number): Promise<Promotion | undefined> => {
  const promotion = await promotionModel.getPromotionById(id)
  if (!promotion) return undefined

  return {
    id: promotion.id,
    name: promotion.name,
    description: promotion.description,
    discountType: promotion.discountType as 'fixed_amount' | 'percentage',
    discountValue: Number(promotion.discountValue),
    startDate: promotion.startDate,
    endDate: promotion.endDate,
    minPurchaseAmount: promotion.minPurchaseAmount,
    imageUrl: promotion.imageUrl,
    isActive: promotion.isActive,
    type: promotion.type
  }
}

export const deletePromotion = async (id: number): Promise<void> => {
  // First delete all promotion variants
  await promotionVariantModel.deletePromotionVariantsByPromotionId(id)
  // Then delete the promotion
  await promotionModel.deletePromotion(id)
}

export const getPromotionVariantsWithInfo = async (promotionId: number): Promise<PromotionVariantWithInfo[]> => {
  const variantsWithInfo = await executeQuery<any[]>({
    query: `
      SELECT
        pv.promotion_id,
        pv.variant_id,
        pv.promotion_price,
        pv.stock_limit,
        pv.created_at,
        v.id as variant_id,
        v.sku,
        v.price as variant_price,
        v.stock as variant_stock,
        v.product_id,
        p.name as product_name
      FROM promotion_variants pv
      JOIN product_variants v ON pv.variant_id = v.id
      JOIN products p ON v.product_id = p.id
      WHERE pv.promotion_id = ?
      ORDER BY p.name, v.sku
    `,
    values: [promotionId]
  })

  return variantsWithInfo.map((row) => ({
    variantId: row.variant_id,
    promotionPrice: row.promotion_price ? Number(row.promotion_price) : null,
    stockLimit: row.stock_limit,
    createdAt: row.created_at,
    variant: {
      id: row.variant_id,
      sku: row.sku,
      price: Number(row.variant_price),
      stock: row.variant_stock,
      productId: row.product_id,
      productName: row.product_name
    }
  }))
}
