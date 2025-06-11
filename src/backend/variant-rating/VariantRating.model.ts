import { executeQuery } from '@/lib/db'
import { VariantRatings as VariantRatingRaw } from '@/types/database'
import { VariantRatings as VariantRating } from '@/types/domain'

// me
import {
  VariantRatingSearchResult,
  VariantRatingSummary,
  VariantRatingWithCustomer
} from './VariantRating.interfaces'
import {
  VariantRatingMapper,
  VariantRatingsMapper
} from './VariantRating.mapper'
import oVariantRatingRep from './VariantRating.repository'

export class VariantRatingModel {
  // ============================================================================
  // MÉTODOS BÁSICOS
  // ============================================================================

  public async getVariantRatings(): Promise<VariantRating[] | undefined> {
    const ratingsRaw = await oVariantRatingRep.getVariantRatings()
    return VariantRatingsMapper(ratingsRaw)
  }

  public async getVariantRatingById(
    id: number
  ): Promise<VariantRating | undefined> {
    const ratingRaw = await oVariantRatingRep.getVariantRatingById(id)
    if (!ratingRaw) return undefined
    return VariantRatingMapper(ratingRaw)
  }

  public async getVariantRatingsByVariantId(
    variantId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw =
      await oVariantRatingRep.getVariantRatingsByVariantId(variantId)
    return VariantRatingsMapper(ratingsRaw)
  }

  public async getVariantRatingsByCustomerId(
    customerId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw =
      await oVariantRatingRep.getVariantRatingsByCustomerId(customerId)
    return VariantRatingsMapper(ratingsRaw)
  }

  public async createVariantRating(
    ratingData: Omit<VariantRatingRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VariantRating | undefined> {
    const created = await oVariantRatingRep.createVariantRating(ratingData)
    if (!created) return undefined
    return VariantRatingMapper(created)
  }

  public async updateVariantRating(
    ratingData: Partial<
      Omit<VariantRatingRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<VariantRating | undefined> {
    const updated = await oVariantRatingRep.updateVariantRating(ratingData, id)
    if (!updated) return undefined
    return VariantRatingMapper(updated)
  }

  public async deleteVariantRating(id: number): Promise<void> {
    return await oVariantRatingRep.deleteVariantRating(id)
  }

  // ============================================================================
  // MÉTODOS COMPLEJOS CON JOINS
  // ============================================================================

  public async getRatingsByVariantId(
    variantId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<VariantRatingSearchResult> {
    const offset = (page - 1) * limit

    const ratings = await executeQuery<
      (VariantRatingRaw & {
        customer_name: string
        customer_photo: string | null
      })[]
    >({
      query: `
        SELECT 
          vr.*, 
          c.name as customer_name,
          c.photo as customer_photo
        FROM 
          variant_ratings vr
        JOIN
          customers c ON vr.customer_id = c.id
        WHERE 
          vr.variant_id = ?
        ORDER BY 
          vr.created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: [variantId, limit, offset]
    })

    const countResult = await executeQuery<[{ total: number }]>({
      query:
        'SELECT COUNT(*) as total FROM variant_ratings WHERE variant_id = ?',
      values: [variantId]
    })
    const totalCount = countResult[0]?.total || 0
    const totalPages = Math.ceil(totalCount / limit)

    const summary = await this.getVariantRatingSummary(variantId)

    const ratingDTOs: VariantRatingWithCustomer[] = ratings.map((rating) => ({
      ...VariantRatingMapper(rating),
      customerName: rating.customer_name,
      customerPhoto: rating.customer_photo || undefined
    }))

    return {
      ratings: ratingDTOs,
      totalCount,
      page,
      totalPages,
      summary
    }
  }

  public async getVariantRatingSummary(
    variantId: number
  ): Promise<VariantRatingSummary> {
    const summary = await executeQuery<
      {
        variant_id: number
        total_ratings: number
        average_rating: number
        five_star: number
        four_star: number
        three_star: number
        two_star: number
        one_star: number
        verified_purchases: number
      }[]
    >({
      query: 'SELECT * FROM variant_rating_summary WHERE variant_id = ?',
      values: [variantId]
    })

    if (summary.length === 0) {
      return {
        variantId,
        totalRatings: 0,
        averageRating: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
        verifiedPurchases: 0
      }
    }

    const data = summary[0]
    return {
      variantId,
      totalRatings: Number(data.total_ratings),
      averageRating: Number(data.average_rating),
      fiveStar: Number(data.five_star),
      fourStar: Number(data.four_star),
      threeStar: Number(data.three_star),
      twoStar: Number(data.two_star),
      oneStar: Number(data.one_star),
      verifiedPurchases: Number(data.verified_purchases)
    }
  }

  // ============================================================================
  // MÉTODOS DE LÓGICA DE NEGOCIO
  // ============================================================================

  public async createRating(
    variantId: number,
    customerId: number,
    rating: number,
    review?: string,
    title?: string,
    verifiedPurchase: boolean = false
  ): Promise<VariantRating | undefined> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    const ratingData: Omit<
      VariantRatingRaw,
      'id' | 'created_at' | 'updated_at'
    > = {
      variant_id: variantId,
      customer_id: customerId,
      rating,
      review: review || null,
      title: title || null,
      verified_purchase: verifiedPurchase ? 1 : 0
    }

    return await this.createVariantRating(ratingData)
  }

  public async hasCustomerRatedVariant(
    customerId: number,
    variantId: number
  ): Promise<boolean> {
    return await oVariantRatingRep.checkDuplicateRating(customerId, variantId)
  }

  public async getAverageRatingForVariant(variantId: number): Promise<number> {
    const stats = await oVariantRatingRep.getVariantRatingStats(variantId)
    return stats?.averageRating || 0
  }

  public async getTotalRatingsForVariant(variantId: number): Promise<number> {
    return await oVariantRatingRep.countVariantRatings(variantId)
  }

  public async getVerifiedPurchaseRatings(
    variantId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw =
      await oVariantRatingRep.getVerifiedVariantRatingsByVariantId(variantId)
    return VariantRatingsMapper(ratingsRaw)
  }

  // ============================================================================
  // MÉTODOS PARA BATCH LOADING
  // ============================================================================

  public async getVariantRatingsByVariantIds(
    variantIds: number[]
  ): Promise<Map<number, VariantRating[]>> {
    const ratingsRaw =
      await oVariantRatingRep.getVariantRatingsByVariantIds(variantIds)

    if (!ratingsRaw) return new Map()

    const ratingsByVariantId = new Map<number, VariantRating[]>()

    for (const ratingRaw of ratingsRaw) {
      const rating = VariantRatingMapper(ratingRaw)
      const variantId = rating.variantId

      if (!ratingsByVariantId.has(variantId)) {
        ratingsByVariantId.set(variantId, [])
      }

      ratingsByVariantId.get(variantId)!.push(rating)
    }

    return ratingsByVariantId
  }

  public async getVariantRatingSummariesByVariantIds(
    variantIds: number[]
  ): Promise<Map<number, VariantRatingSummary>> {
    if (variantIds.length === 0) return new Map()

    const summariesMap = new Map<number, VariantRatingSummary>()

    for (const variantId of variantIds) {
      const summary = await this.getVariantRatingSummary(variantId)
      summariesMap.set(variantId, summary)
    }

    return summariesMap
  }

  // ============================================================================
  // ALIAS PARA COMPATIBILIDAD
  // ============================================================================

  public async getRatingById(id: number) {
    return await this.getVariantRatingById(id)
  }

  public async deleteRating(id: number) {
    return await this.deleteVariantRating(id)
  }
}

const variantRatingModel = new VariantRatingModel()
export default variantRatingModel
