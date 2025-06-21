import { type Promotions as PromotionRaw } from '@/types/database'
import { type Promotions as Promotion } from '@/types/domain'

// me
import { PromotionMapper, PromotionsMapper } from './Promotion.mapper'
import oPromotionRep from './Promotion.repository'

export class PromotionModel {
  public async getPromotions(): Promise<Promotion[] | undefined> {
    const brandsRaw = await oPromotionRep.getPromotions()
    return PromotionsMapper(brandsRaw)
  }

  public async getPromotionById(id: number): Promise<Promotion | undefined> {
    const brandRaw = await oPromotionRep.getPromotionById(id)
    if (!brandRaw) return undefined
    return PromotionMapper(brandRaw)
  }

  public async createPromotion(
    brandData: Omit<PromotionRaw, 'id'>
  ): Promise<Promotion | undefined> {
    const created = await oPromotionRep.createPromotion(brandData)
    if (!created) return undefined
    return PromotionMapper(created)
  }

  public async updatePromotion(
    brandData: Omit<PromotionRaw, 'id'>,
    id: number
  ): Promise<Promotion | undefined> {
    const updated = await oPromotionRep.updatePromotion(brandData, id)
    if (!updated) return undefined
    return PromotionMapper(updated)
  }

  public async deletePromotion(id: number): Promise<void> {
    await oPromotionRep.deletePromotion(id)
  }
}

const promotionModel = new PromotionModel()
export default promotionModel
