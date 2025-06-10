import { executeQuery } from '@/lib/db'
import { PromotionVariants as PromotionVariantRaw } from '@/types/database'

export class PromotionVariantRepository {
  // ✅ Obtener todas las promotion variants
  public async getPromotionVariants(): Promise<PromotionVariantRaw[] | null> {
    const promotionVariants = await executeQuery<PromotionVariantRaw[]>({
      query:
        'SELECT * FROM promotion_variants ORDER BY promotion_id, variant_id ASC'
    })

    if (promotionVariants.length === 0) return null
    return promotionVariants
  }

  // ✅ Obtener promotion variants por variant ID
  public async getPromotionVariantsByVariantId(
    variantId: number
  ): Promise<PromotionVariantRaw[] | null> {
    const promotionVariants = await executeQuery<PromotionVariantRaw[]>({
      query: 'SELECT * FROM promotion_variants WHERE variant_id = ?',
      values: [variantId]
    })

    if (promotionVariants.length === 0) return null
    return promotionVariants
  }

  // ✅ Obtener promotion variants por promotion ID
  public async getPromotionVariantsByPromotionId(
    promotionId: number
  ): Promise<PromotionVariantRaw[] | null> {
    const promotionVariants = await executeQuery<PromotionVariantRaw[]>({
      query:
        'SELECT * FROM promotion_variants WHERE promotion_id = ? ORDER BY variant_id ASC',
      values: [promotionId]
    })

    if (promotionVariants.length === 0) return null
    return promotionVariants
  }

  // ✅ Obtener promotion variant específica por promotion_id y variant_id
  public async getPromotionVariant(
    promotionId: number,
    variantId: number
  ): Promise<PromotionVariantRaw | null> {
    const promotionVariants = await executeQuery<PromotionVariantRaw[]>({
      query:
        'SELECT * FROM promotion_variants WHERE promotion_id = ? AND variant_id = ?',
      values: [promotionId, variantId]
    })

    if (promotionVariants.length === 0) return null
    return promotionVariants[0]
  }

  // ✅ Obtener promotion variants por múltiples variant IDs (batch loading)
  public async getPromotionVariantsByVariantIds(
    variantIds: number[]
  ): Promise<PromotionVariantRaw[] | null> {
    if (variantIds.length === 0) return null

    const placeholders = variantIds.map(() => '?').join(',')
    const promotionVariants = await executeQuery<PromotionVariantRaw[]>({
      query: `SELECT * FROM promotion_variants WHERE variant_id IN (${placeholders}) ORDER BY variant_id, promotion_id ASC`,
      values: variantIds
    })

    if (promotionVariants.length === 0) return null
    return promotionVariants
  }

  // ✅ Obtener promotion variants por múltiples promotion IDs (batch loading)
  public async getPromotionVariantsByPromotionIds(
    promotionIds: number[]
  ): Promise<PromotionVariantRaw[] | null> {
    if (promotionIds.length === 0) return null

    const placeholders = promotionIds.map(() => '?').join(',')
    const promotionVariants = await executeQuery<PromotionVariantRaw[]>({
      query: `SELECT * FROM promotion_variants WHERE promotion_id IN (${placeholders}) ORDER BY promotion_id, variant_id ASC`,
      values: promotionIds
    })

    if (promotionVariants.length === 0) return null
    return promotionVariants
  }

  // ✅ Crear promotion variant
  public async createPromotionVariant(
    promotionVariant: Omit<PromotionVariantRaw, 'created_at'>
  ): Promise<PromotionVariantRaw | null> {
    await executeQuery({
      query: 'INSERT INTO promotion_variants SET ?',
      values: [promotionVariant]
    })

    return await this.getPromotionVariant(
      promotionVariant.promotion_id,
      promotionVariant.variant_id
    )
  }

  // ✅ Actualizar promotion variant
  public async updatePromotionVariant(
    promotionVariantData: Partial<
      Omit<PromotionVariantRaw, 'promotion_id' | 'variant_id' | 'created_at'>
    >,
    promotionId: number,
    variantId: number
  ): Promise<PromotionVariantRaw | null> {
    await executeQuery({
      query:
        'UPDATE promotion_variants SET ? WHERE promotion_id = ? AND variant_id = ?',
      values: [promotionVariantData, promotionId, variantId]
    })

    return await this.getPromotionVariant(promotionId, variantId)
  }

  // ✅ Eliminar promotion variant específica
  public async deletePromotionVariant(
    promotionId: number,
    variantId: number
  ): Promise<void> {
    await executeQuery({
      query:
        'DELETE FROM promotion_variants WHERE promotion_id = ? AND variant_id = ?',
      values: [promotionId, variantId]
    })
  }

  // ✅ Eliminar todas las promotion variants de un variant
  public async deletePromotionVariantsByVariantId(
    variantId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM promotion_variants WHERE variant_id = ?',
      values: [variantId]
    })
  }

  // ✅ Eliminar todas las promotion variants de una promotion
  public async deletePromotionVariantsByPromotionId(
    promotionId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM promotion_variants WHERE promotion_id = ?',
      values: [promotionId]
    })
  }
}

const promotionVariantRepository = new PromotionVariantRepository()
export default promotionVariantRepository
