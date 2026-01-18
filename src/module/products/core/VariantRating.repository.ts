import { executeQuery } from '@/lib/db'
import { type VariantRatings as VariantRatingRaw } from '@/types/database'

export class VariantRatingRepository {
  public async getVariantRatings(): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: 'SELECT * FROM variant_ratings ORDER BY created_at DESC'
    })

    if (ratings.length === 0) return null
    return ratings
  }

  public async getVariantRatingById(
    id: number
  ): Promise<VariantRatingRaw | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: 'SELECT * FROM variant_ratings WHERE id = ?',
      values: [id]
    })

    if (ratings.length === 0) return null
    return ratings[0]
  }

  public async getVariantRatingsByVariantId(
    variantId: number
  ): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query:
        'SELECT * FROM variant_ratings WHERE variant_id = ? ORDER BY created_at DESC',
      values: [variantId]
    })

    if (ratings.length === 0) return null
    return ratings
  }

  public async getVariantRatingsByCustomerId(
    customerId: number
  ): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query:
        'SELECT * FROM variant_ratings WHERE customer_id = ? ORDER BY created_at DESC',
      values: [customerId]
    })

    if (ratings.length === 0) return null
    return ratings
  }

  public async getVerifiedVariantRatingsByVariantId(
    variantId: number
  ): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query:
        'SELECT * FROM variant_ratings WHERE variant_id = ? AND verified_purchase = 1 ORDER BY created_at DESC',
      values: [variantId]
    })

    if (ratings.length === 0) return null
    return ratings
  }

  public async getVariantRatingsByVariantIds(
    variantIds: number[]
  ): Promise<VariantRatingRaw[] | null> {
    if (variantIds.length === 0) return null

    const placeholders = variantIds.map(() => '?').join(',')
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: `
        SELECT * FROM variant_ratings
        WHERE variant_id IN (${placeholders})
        ORDER BY variant_id, created_at DESC
      `,
      values: variantIds
    })

    if (ratings.length === 0) return null
    return ratings
  }

  public async getVariantRatingByCustomerAndVariant(
    customerId: number,
    variantId: number
  ): Promise<VariantRatingRaw | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query:
        'SELECT * FROM variant_ratings WHERE customer_id = ? AND variant_id = ?',
      values: [customerId, variantId]
    })

    if (ratings.length === 0) return null
    return ratings[0]
  }

  public async getVariantRatingStats(variantId: number): Promise<{
    averageRating: number
    totalRatings: number
    verifiedRatings: number
    ratingDistribution: Array<{ rating: number, count: number }>
  } | null> {
    const statsResult = await executeQuery<
      Array<{
        average_rating: number | null
        total_ratings: number
        verified_ratings: number
      }>
    >({
      query: `
        SELECT
          AVG(rating) as average_rating,
          COUNT(*) as total_ratings,
          SUM(CASE WHEN verified_purchase = 1 THEN 1 ELSE 0 END) as verified_ratings
        FROM variant_ratings
        WHERE variant_id = ?
      `,
      values: [variantId]
    })

    if (statsResult[0].total_ratings === 0) return null

    const distributionResult = await executeQuery<
      Array<{
        rating: number
        count: number
      }>
    >({
      query: `
        SELECT
          rating,
          COUNT(*) as count
        FROM variant_ratings
        WHERE variant_id = ?
        GROUP BY rating
        ORDER BY rating DESC
      `,
      values: [variantId]
    })

    return {
      averageRating: Number(statsResult[0].average_rating?.toFixed(2)) || 0,
      totalRatings: statsResult[0].total_ratings,
      verifiedRatings: statsResult[0].verified_ratings,
      ratingDistribution: distributionResult
    }
  }

  public async createVariantRating(
    rating: Omit<VariantRatingRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VariantRatingRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO variant_ratings SET ?',
      values: [rating]
    })

    return await this.getVariantRatingById(result.insertId)
  }

  public async updateVariantRating(
    ratingData: Partial<
      Omit<
        VariantRatingRaw,
        'id' | 'customer_id' | 'variant_id' | 'created_at' | 'updated_at'
      >
    >,
    id: number
  ): Promise<VariantRatingRaw | null> {
    await executeQuery({
      query: 'UPDATE variant_ratings SET ?, updated_at = NOW() WHERE id = ?',
      values: [ratingData, id]
    })

    return await this.getVariantRatingById(id)
  }

  public async deleteVariantRating(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_ratings WHERE id = ?',
      values: [id]
    })
  }

  public async deleteVariantRatingsByVariantId(
    variantId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_ratings WHERE variant_id = ?',
      values: [variantId]
    })
  }

  public async deleteVariantRatingsByCustomerId(
    customerId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_ratings WHERE customer_id = ?',
      values: [customerId]
    })
  }

  public async countVariantRatings(variantId: number): Promise<number> {
    const result = await executeQuery<Array<{ count: number }>>({
      query:
        'SELECT COUNT(*) as count FROM variant_ratings WHERE variant_id = ?',
      values: [variantId]
    })

    return result[0].count
  }

  public async checkDuplicateRating(
    customerId: number,
    variantId: number
  ): Promise<boolean> {
    const result = await executeQuery<Array<{ count: number }>>({
      query:
        'SELECT COUNT(*) as count FROM variant_ratings WHERE customer_id = ? AND variant_id = ?',
      values: [customerId, variantId]
    })

    return result[0].count > 0
  }
}

const variantRatingRepository = new VariantRatingRepository()
export default variantRatingRepository
