import { executeQuery } from '@/lib/db'
import { variant_ratings as VariantRatingRaw } from '@/types/database'

export class VariantRatingRepository {
  // ✅ Obtener todas las variant ratings
  public async getVariantRatings(): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: 'SELECT * FROM variant_ratings ORDER BY created_at DESC'
    })

    if (ratings.length === 0) return null
    return ratings
  }

  // ✅ Obtener variant rating por ID
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

  // ✅ Obtener variant ratings por variant ID
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

  // ✅ Obtener variant ratings por customer ID
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

  // ✅ Obtener variant ratings verificadas por variant ID
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

  // ✅ Obtener variant ratings por múltiples variant IDs (batch loading)
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

  // ✅ Obtener rating específico de un customer para un variant
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

  // ✅ Obtener estadísticas de ratings para un variant
  public async getVariantRatingStats(variantId: number): Promise<{
    averageRating: number
    totalRatings: number
    verifiedRatings: number
    ratingDistribution: { rating: number; count: number }[]
  } | null> {
    // Promedio y total
    const statsResult = await executeQuery<
      {
        average_rating: number | null
        total_ratings: number
        verified_ratings: number
      }[]
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

    // Distribución por rating (1-5 estrellas)
    const distributionResult = await executeQuery<
      {
        rating: number
        count: number
      }[]
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

  // ✅ Obtener ratings con paginación y filtros
  public async getVariantRatingsPaginated(
    variantId?: number,
    rating?: number,
    verifiedOnly?: boolean,
    limit: number = 10,
    offset: number = 0
  ): Promise<VariantRatingRaw[] | null> {
    let query = 'SELECT * FROM variant_ratings WHERE 1=1'
    const values: unknown[] = []

    if (variantId) {
      query += ' AND variant_id = ?'
      values.push(variantId)
    }

    if (rating) {
      query += ' AND rating = ?'
      values.push(rating)
    }

    if (verifiedOnly) {
      query += ' AND verified_purchase = 1'
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    values.push(limit, offset)

    const ratings = await executeQuery<VariantRatingRaw[]>({
      query,
      values
    })

    if (ratings.length === 0) return null
    return ratings
  }

  // ✅ Buscar ratings por contenido (título o review)
  public async searchVariantRatings(
    searchTerm: string,
    limit: number = 10
  ): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: `
        SELECT * FROM variant_ratings 
        WHERE (title LIKE ? OR review LIKE ?)
        AND (title IS NOT NULL OR review IS NOT NULL)
        ORDER BY created_at DESC
        LIMIT ?
      `,
      values: [`%${searchTerm}%`, `%${searchTerm}%`, limit]
    })

    if (ratings.length === 0) return null
    return ratings
  }

  // ✅ Obtener top ratings (mejor valorados) con paginación
  public async getTopVariantRatings(
    limit: number,
    offset: number
  ): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: `
        SELECT * FROM variant_ratings 
        WHERE rating >= 4
        ORDER BY rating DESC, verified_purchase DESC, created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: [limit, offset]
    })

    if (ratings.length === 0) return null
    return ratings
  }

  // ✅ Obtener ratings recientes por variant
  public async getRecentVariantRatings(
    variantId: number,
    days: number = 30
  ): Promise<VariantRatingRaw[] | null> {
    const ratings = await executeQuery<VariantRatingRaw[]>({
      query: `
        SELECT * FROM variant_ratings 
        WHERE variant_id = ? 
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        ORDER BY created_at DESC
      `,
      values: [variantId, days]
    })

    if (ratings.length === 0) return null
    return ratings
  }

  // ✅ Crear variant rating
  public async createVariantRating(
    rating: Omit<VariantRatingRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VariantRatingRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO variant_ratings SET ?',
      values: [rating]
    })

    return await this.getVariantRatingById(result.insertId)
  }

  // ✅ Actualizar variant rating
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

  // ✅ Eliminar variant rating
  public async deleteVariantRating(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_ratings WHERE id = ?',
      values: [id]
    })
  }

  // ✅ Eliminar todas las ratings de un variant
  public async deleteVariantRatingsByVariantId(
    variantId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_ratings WHERE variant_id = ?',
      values: [variantId]
    })
  }

  // ✅ Eliminar todas las ratings de un customer
  public async deleteVariantRatingsByCustomerId(
    customerId: number
  ): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM variant_ratings WHERE customer_id = ?',
      values: [customerId]
    })
  }

  // ✅ Contar total de ratings por variant
  public async countVariantRatings(variantId: number): Promise<number> {
    const result = await executeQuery<{ count: number }[]>({
      query:
        'SELECT COUNT(*) as count FROM variant_ratings WHERE variant_id = ?',
      values: [variantId]
    })

    return result[0].count
  }

  // ✅ Contar ratings verificadas por variant
  public async countVerifiedVariantRatings(variantId: number): Promise<number> {
    const result = await executeQuery<{ count: number }[]>({
      query:
        'SELECT COUNT(*) as count FROM variant_ratings WHERE variant_id = ? AND verified_purchase = 1',
      values: [variantId]
    })

    return result[0].count
  }

  // ✅ Verificar si existe rating duplicado
  public async checkDuplicateRating(
    customerId: number,
    variantId: number
  ): Promise<boolean> {
    const result = await executeQuery<{ count: number }[]>({
      query:
        'SELECT COUNT(*) as count FROM variant_ratings WHERE customer_id = ? AND variant_id = ?',
      values: [customerId, variantId]
    })

    return result[0].count > 0
  }
}

const variantRatingRepository = new VariantRatingRepository()
export default variantRatingRepository
