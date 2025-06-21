import { executeQuery } from '@/lib/db'
import { type Promotions as PromotionRaw } from '@/types/database'

export class PromotionRepository {
  public async getPromotions(): Promise<PromotionRaw[] | null> {
    const promotions = await executeQuery<PromotionRaw[]>({
      query: 'SELECT * FROM promotions'
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

  public async createPromotion(
    promotion: Omit<PromotionRaw, 'id'>
  ): Promise<PromotionRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO promotions SET ?',
      values: [promotion]
    })

    return await this.getPromotionById(result.insertId)
  }

  public async updatePromotion(
    promotionData: Omit<PromotionRaw, 'id'>,
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
