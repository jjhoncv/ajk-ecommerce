import { executeQuery } from '@/lib/db'
import { type Promotions as PromotionRaw } from '@/types/database'

export class PromotionRepository {
  public async getPromotions(): Promise<PromotionRaw[] | null> {
    const promotions = await executeQuery<PromotionRaw[]>({
      query: 'SELECT * FROM promotions ORDER BY display_order ASC'
    })

    if (promotions.length === 0) return null
    return promotions
  }

  public async getPromotionById(id: number): Promise<PromotionRaw | null> {
    const promotions = await executeQuery<PromotionRaw[]>({
      query: 'SELECT * FROM promotions WHERE id = ?',
      values: [id]
    })

    if (promotions.length === 0) return null
    return promotions[0]
  }

  public async getPromotionBySlug(slug: string): Promise<PromotionRaw | null> {
    const promotions = await executeQuery<PromotionRaw[]>({
      query: 'SELECT * FROM promotions WHERE slug = ?',
      values: [slug]
    })

    if (promotions.length === 0) return null
    return promotions[0]
  }

  public async updatePromotionSlug(id: number, slug: string): Promise<PromotionRaw | null> {
    await executeQuery({
      query: 'UPDATE promotions SET slug = ? WHERE id = ?',
      values: [slug, id]
    })

    return await this.getPromotionById(id)
  }

  public async createPromotion(
    promotion: Omit<PromotionRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PromotionRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO promotions SET ?',
      values: [promotion]
    })

    return await this.getPromotionById(result.insertId)
  }

  public async updatePromotion(
    promotionData: Partial<Omit<PromotionRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<PromotionRaw | null> {
    await executeQuery({
      query: 'UPDATE promotions SET ? WHERE id=?',
      values: [promotionData, id]
    })

    return await this.getPromotionById(id)
  }

  public async deletePromotion(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM promotions WHERE id=?',
      values: [id]
    })
  }
}

const promotionRepository = new PromotionRepository()
export default promotionRepository
