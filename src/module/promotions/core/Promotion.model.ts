import { type Promotions as PromotionRaw } from '@/types/database'
import { type Promotions as Promotion } from '@/types/domain'

import { PromotionMapper, PromotionsMapper } from './Promotion.mapper'
import oPromotionRep from './Promotion.repository'

export class PromotionModel {
  public async getPromotions(): Promise<Promotion[] | undefined> {
    const brandsRaw = await oPromotionRep.getPromotions()
    return PromotionsMapper(brandsRaw)
  }

  public async getPromotionById(id: number): Promise<Promotion | undefined> {
    const brandRaw = await oPromotionRep.getPromotionById(id)
    if (brandRaw == null) return undefined
    return PromotionMapper(brandRaw)
  }

  public async getPromotionBySlug(slug: string): Promise<Promotion | undefined> {
    const promotionRaw = await oPromotionRep.getPromotionBySlug(slug)
    if (promotionRaw == null) return undefined
    return PromotionMapper(promotionRaw)
  }

  public async updatePromotionSlug(id: number, slug: string): Promise<Promotion | undefined> {
    const updated = await oPromotionRep.updatePromotionSlug(id, slug)
    if (updated == null) return undefined
    return PromotionMapper(updated)
  }

  public async createPromotion(
    brandData: Omit<PromotionRaw, 'id'>
  ): Promise<Promotion | undefined> {
    const created = await oPromotionRep.createPromotion(brandData)
    if (created == null) return undefined
    return PromotionMapper(created)
  }

  public async updatePromotion(
    brandData: Omit<PromotionRaw, 'id'>,
    id: number
  ): Promise<Promotion | undefined> {
    const updated = await oPromotionRep.updatePromotion(brandData, id)
    if (updated == null) return undefined
    return PromotionMapper(updated)
  }

  public async deletePromotion(id: number): Promise<void> {
    await oPromotionRep.deletePromotion(id)
  }
}

const promotionModel = new PromotionModel()
export default promotionModel
