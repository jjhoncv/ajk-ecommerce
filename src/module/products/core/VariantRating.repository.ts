import { executeQuery } from '@/lib/db'
import { type VariantRatings as VariantRatingRaw, type RatingStatus } from '@/types/database'

export class VariantRatingRepository {
  public async getVariantRatings(): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: 'SELECT * FROM variant_ratings ORDER BY created_at DESC'
    })

    if (ratings.length === 0) return null
    return ratings
  }

  // ============================================================================
  // MÉTODOS PARA ADMIN - MODERACIÓN
  // ============================================================================

  public async getAllRatingsForAdmin(
    status?: RatingStatus,
    limit: number = 50,
    offset: number = 0
  ): Promise<VariantRatingRaw[] | null> {
    let query = `
      SELECT vr.*
      FROM variant_ratings vr
    `
    const values: (string | number)[] = []

    if (status) {
      query += ' WHERE vr.status = ?'
      values.push(status)
    }

    query += ' ORDER BY vr.created_at DESC LIMIT ? OFFSET ?'
    values.push(limit, offset)

    const ratings = await executeQuery<VariantRatingRaw[]>({
      query,
      values
    })

    if (ratings.length === 0) return null
    return ratings
  }

  public async countRatingsForAdmin(status?: RatingStatus): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM variant_ratings'
    const values: string[] = []

    if (status) {
      query += ' WHERE status = ?'
      values.push(status)
    }

    const result = await executeQuery<Array<{ count: number }>>({
      query,
      values
    })

    return result[0].count
  }

  public async updateRatingStatus(
    id: number,
    status: RatingStatus,
    reviewedBy: number
  ): Promise<VariantRatingRaw | null> {
    await executeQuery({
      query: `
        UPDATE variant_ratings
        SET status = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW()
        WHERE id = ?
      `,
      values: [status, reviewedBy, id]
    })

    return await this.getVariantRatingById(id)
  }

  public async getApprovedVariantRatingsByVariantId(
    variantId: number
  ): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: `
        SELECT * FROM variant_ratings
        WHERE variant_id = ? AND status = 'approved'
        ORDER BY created_at DESC
      `,
      values: [variantId]
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
    variantId: number,
    onlyApproved: boolean = true
  ): Promise<VariantRatingRaw[] | null> {
    let query = 'SELECT * FROM variant_ratings WHERE variant_id = ?'
    if (onlyApproved) {
      query += " AND status = 'approved'"
    }
    query += ' ORDER BY created_at DESC'

    const ratings = await executeQuery<VariantRatingRaw[]>({
      query,
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
      query: `
        SELECT * FROM variant_ratings
        WHERE variant_id = ? AND verified_purchase = 1 AND status = 'approved'
        ORDER BY created_at DESC
      `,
      values: [variantId]
    })

    if (ratings.length === 0) return null
    return ratings
  }

  public async getVariantRatingsByVariantIds(
    variantIds: number[],
    onlyApproved: boolean = true
  ): Promise<VariantRatingRaw[] | null> {
    if (variantIds.length === 0) return null

    const placeholders = variantIds.map(() => '?').join(',')
    let query = `
      SELECT * FROM variant_ratings
      WHERE variant_id IN (${placeholders})
    `
    if (onlyApproved) {
      query += " AND status = 'approved'"
    }
    query += ' ORDER BY variant_id, created_at DESC'

    const ratings = await executeQuery<VariantRatingRaw[]>({
      query,
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
        WHERE variant_id = ? AND status = 'approved'
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
        WHERE variant_id = ? AND status = 'approved'
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

  public async countVariantRatings(variantId: number, onlyApproved: boolean = true): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM variant_ratings WHERE variant_id = ?'
    if (onlyApproved) {
      query += " AND status = 'approved'"
    }

    const result = await executeQuery<Array<{ count: number }>>({
      query,
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

  // ============================================================================
  // MÉTODOS PARA IMÁGENES DE RATINGS
  // ============================================================================

  public async createRatingImage(
    ratingId: number,
    imageUrl: string
  ): Promise<{ id: number; ratingId: number; imageUrl: string }> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO rating_images (rating_id, image_url) VALUES (?, ?)',
      values: [ratingId, imageUrl]
    })

    return {
      id: result.insertId,
      ratingId,
      imageUrl
    }
  }

  public async createRatingImages(
    ratingId: number,
    imageUrls: string[]
  ): Promise<Array<{ id: number; ratingId: number; imageUrl: string }>> {
    const results: Array<{ id: number; ratingId: number; imageUrl: string }> = []

    for (const imageUrl of imageUrls) {
      const result = await this.createRatingImage(ratingId, imageUrl)
      results.push(result)
    }

    return results
  }

  public async getRatingImages(
    ratingId: number
  ): Promise<Array<{ id: number; imageUrl: string }>> {
    const images = await executeQuery<Array<{ id: number; image_url: string }>>({
      query: 'SELECT id, image_url FROM rating_images WHERE rating_id = ?',
      values: [ratingId]
    })

    return images.map((img) => ({ id: img.id, imageUrl: img.image_url }))
  }

  public async deleteRatingImage(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM rating_images WHERE id = ?',
      values: [id]
    })
  }

  public async deleteRatingImages(ratingId: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM rating_images WHERE rating_id = ?',
      values: [ratingId]
    })
  }
}

const variantRatingRepository = new VariantRatingRepository()
export default variantRatingRepository
