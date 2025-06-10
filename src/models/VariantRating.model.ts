import { executeQuery } from '@/lib/db'
import { mapVariantRating, mapVariantRatings } from '@/mappers/mapVariantRating'
import oVariantRatingRep from '@/repository/VariantRating.repository'

import { VariantRatings as VariantRatingRaw } from '@/types/database'
import { VariantRatings as VariantRating } from '@/types/domain'

export interface VariantRatingSummary {
  variantId: number
  totalRatings: number
  averageRating: number
  fiveStar: number
  fourStar: number
  threeStar: number
  twoStar: number
  oneStar: number
  verifiedPurchases: number
}

export interface VariantRatingWithCustomer extends VariantRating {
  customerName: string
  customerPhoto?: string
}

export interface VariantRatingSearchResult {
  ratings: VariantRatingWithCustomer[]
  totalCount: number
  page: number
  totalPages: number
  summary: VariantRatingSummary
}

export class VariantRatingModel {
  // ============================================================================
  // MÉTODOS BÁSICOS (nueva estructura)
  // ============================================================================

  public async getVariantRatings(): Promise<VariantRating[] | undefined> {
    const ratingsRaw = await oVariantRatingRep.getVariantRatings()
    return mapVariantRatings(ratingsRaw)
  }

  public async getVariantRatingById(
    id: number
  ): Promise<VariantRating | undefined> {
    const ratingRaw = await oVariantRatingRep.getVariantRatingById(id)
    if (!ratingRaw) return undefined
    return mapVariantRating(ratingRaw)
  }

  public async getVariantRatingsByVariantId(
    variantId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw =
      await oVariantRatingRep.getVariantRatingsByVariantId(variantId)
    return mapVariantRatings(ratingsRaw)
  }

  public async getVariantRatingsByCustomerId(
    customerId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw =
      await oVariantRatingRep.getVariantRatingsByCustomerId(customerId)
    return mapVariantRatings(ratingsRaw)
  }

  public async createVariantRating(
    ratingData: Omit<VariantRatingRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VariantRating | undefined> {
    const created = await oVariantRatingRep.createVariantRating(ratingData)
    if (!created) return undefined
    return mapVariantRating(created)
  }

  public async updateVariantRating(
    ratingData: Partial<
      Omit<VariantRatingRaw, 'id' | 'created_at' | 'updated_at'>
    >,
    id: number
  ): Promise<VariantRating | undefined> {
    const updated = await oVariantRatingRep.updateVariantRating(ratingData, id)
    if (!updated) return undefined
    return mapVariantRating(updated)
  }

  public async deleteVariantRating(id: number): Promise<void> {
    return await oVariantRatingRep.deleteVariantRating(id)
  }

  // ============================================================================
  // MÉTODOS COMPLEJOS (replicando funcionalidad de RatingModel.ts)
  // ============================================================================

  public async getRatingsByVariantId(
    variantId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<VariantRatingSearchResult> {
    const offset = (page - 1) * limit

    // Obtener las valoraciones con información del cliente
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

    // Obtener el total de valoraciones
    const countResult = await executeQuery<[{ total: number }]>({
      query:
        'SELECT COUNT(*) as total FROM variant_ratings WHERE variant_id = ?',
      values: [variantId]
    })
    const totalCount = countResult[0]?.total || 0
    const totalPages = Math.ceil(totalCount / limit)

    // Obtener el resumen de valoraciones
    const summary = await this.getVariantRatingSummary(variantId)

    // Mapear los ratings con información del cliente
    const ratingDTOs: VariantRatingWithCustomer[] = ratings.map((rating) => ({
      ...mapVariantRating(rating),
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

  public async getRatingsByProductId(
    productId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<VariantRatingSearchResult> {
    const offset = (page - 1) * limit

    // Obtener las valoraciones de todas las variantes del producto
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
          product_variants pv ON vr.variant_id = pv.id
        JOIN
          customers c ON vr.customer_id = c.id
        WHERE 
          pv.product_id = ?
        ORDER BY 
          vr.created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: [productId, limit, offset]
    })

    // Obtener el total de valoraciones
    const countResult = await executeQuery<[{ total: number }]>({
      query: `
        SELECT 
          COUNT(*) as total 
        FROM 
          variant_ratings vr
        JOIN
          product_variants pv ON vr.variant_id = pv.id
        WHERE 
          pv.product_id = ?
      `,
      values: [productId]
    })
    const totalCount = countResult[0]?.total || 0
    const totalPages = Math.ceil(totalCount / limit)

    // Obtener el resumen de valoraciones del producto
    const summary = await this.getProductRatingSummary(productId)

    // Mapear los ratings con información del cliente
    const ratingDTOs: VariantRatingWithCustomer[] = ratings.map((rating) => ({
      ...mapVariantRating(rating),
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

  public async getProductRatingSummary(
    productId: number
  ): Promise<VariantRatingSummary> {
    const summary = await executeQuery<
      {
        product_id: number
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
      query: 'SELECT * FROM product_rating_summary WHERE product_id = ?',
      values: [productId]
    })

    if (summary.length === 0) {
      return {
        variantId: 0, // Para producto, no hay variant específico
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
      variantId: 0,
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
    // Validar rating
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
    const ratings = await executeQuery<{ count: number }[]>({
      query: `
        SELECT COUNT(*) as count 
        FROM variant_ratings 
        WHERE customer_id = ? AND variant_id = ?
      `,
      values: [customerId, variantId]
    })

    return ratings[0]?.count > 0
  }

  public async getAverageRatingForVariant(variantId: number): Promise<number> {
    const result = await executeQuery<{ avg_rating: number | null }[]>({
      query: `
        SELECT AVG(rating) as avg_rating 
        FROM variant_ratings 
        WHERE variant_id = ?
      `,
      values: [variantId]
    })

    return Number(result[0]?.avg_rating || 0)
  }

  public async getTotalRatingsForVariant(variantId: number): Promise<number> {
    const result = await executeQuery<{ total: number }[]>({
      query: `
        SELECT COUNT(*) as total 
        FROM variant_ratings 
        WHERE variant_id = ?
      `,
      values: [variantId]
    })

    return result[0]?.total || 0
  }

  public async getVerifiedPurchaseRatings(
    variantId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw = await executeQuery<VariantRatingRaw[]>({
      query: `
        SELECT * FROM variant_ratings 
        WHERE variant_id = ? AND verified_purchase = 1
        ORDER BY created_at DESC
      `,
      values: [variantId]
    })

    return mapVariantRatings(ratingsRaw)
  }

  public async getRatingsByRatingValue(
    variantId: number,
    ratingValue: number
  ): Promise<VariantRating[] | undefined> {
    if (ratingValue < 1 || ratingValue > 5) {
      throw new Error('Rating value must be between 1 and 5')
    }

    const ratingsRaw = await executeQuery<VariantRatingRaw[]>({
      query: `
        SELECT * FROM variant_ratings 
        WHERE variant_id = ? AND rating = ?
        ORDER BY created_at DESC
      `,
      values: [variantId, ratingValue]
    })

    return mapVariantRatings(ratingsRaw)
  }

  // ============================================================================
  // MÉTODOS PARA BATCH LOADING
  // ============================================================================

  public async getVariantRatingsByVariantIds(
    variantIds: number[]
  ): Promise<Map<number, VariantRating[]>> {
    if (variantIds.length === 0) return new Map()

    const ratingsRaw = await executeQuery<VariantRatingRaw[]>({
      query: `
        SELECT * FROM variant_ratings 
        WHERE variant_id IN (${variantIds.map(() => '?').join(',')})
        ORDER BY created_at DESC
      `,
      values: variantIds
    })

    const ratingsByVariantId = new Map<number, VariantRating[]>()

    for (const ratingRaw of ratingsRaw) {
      const rating = mapVariantRating(ratingRaw)
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

    // Obtener resúmenes para cada variant
    for (const variantId of variantIds) {
      const summary = await this.getVariantRatingSummary(variantId)
      summariesMap.set(variantId, summary)
    }

    return summariesMap
  }

  // ============================================================================
  // ALIAS PARA COMPATIBILIDAD CON RatingModel.ts ORIGINAL
  // ============================================================================

  // Alias para mantener compatibilidad con el código existente
  public async getRatingById(id: number) {
    return await this.getVariantRatingById(id)
  }

  public async deleteRating(id: number) {
    return await this.deleteVariantRating(id)
  }
}

const variantRatingModel = new VariantRatingModel()
export default variantRatingModel
