import { mapVariantRating, mapVariantRatings } from '@/mappers/mapVariantRating'
import oVariantRatingRep from '@/repository/VariantRating.repository'

import { variant_ratings as VariantRatingRaw } from '@/types/database'
import { VariantRatings as VariantRating } from '@/types/domain'

export interface VariantRatingStats {
  averageRating: number
  totalRatings: number
  verifiedRatings: number
  ratingDistribution: { rating: number; count: number }[]
}

export interface VariantRatingFilters {
  variantId?: number
  rating?: number
  verifiedOnly?: boolean
  limit?: number
  offset?: number
}

export class VariantRatingModel {
  // ✅ Obtener todas las variant ratings
  public async getVariantRatings(): Promise<VariantRating[] | undefined> {
    const ratingsRaw = await oVariantRatingRep.getVariantRatings()
    return mapVariantRatings(ratingsRaw)
  }

  // ✅ Obtener variant rating por ID
  public async getVariantRatingById(
    id: number
  ): Promise<VariantRating | undefined> {
    const ratingRaw = await oVariantRatingRep.getVariantRatingById(id)

    if (!ratingRaw) return undefined

    return mapVariantRating(ratingRaw)
  }

  // ✅ Obtener variant ratings por variant ID
  public async getVariantRatingsByVariantId(
    variantId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw =
      await oVariantRatingRep.getVariantRatingsByVariantId(variantId)
    return mapVariantRatings(ratingsRaw)
  }

  // ✅ Obtener variant ratings por customer ID
  public async getVariantRatingsByCustomerId(
    customerId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw =
      await oVariantRatingRep.getVariantRatingsByCustomerId(customerId)
    return mapVariantRatings(ratingsRaw)
  }

  // ✅ Obtener variant ratings verificadas por variant ID (lógica de negocio)
  public async getVerifiedVariantRatingsByVariantId(
    variantId: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw =
      await oVariantRatingRep.getVerifiedVariantRatingsByVariantId(variantId)
    return mapVariantRatings(ratingsRaw)
  }

  // ✅ Obtener variant ratings para múltiples variants (batch loading)
  public async getVariantRatingsByVariantIds(
    variantIds: number[]
  ): Promise<Map<number, VariantRating[]>> {
    const ratingsRaw =
      await oVariantRatingRep.getVariantRatingsByVariantIds(variantIds)

    if (!ratingsRaw) return new Map()

    // Agrupar ratings por variant_id
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

  // ✅ Obtener rating específico de un customer para un variant
  public async getVariantRatingByCustomerAndVariant(
    customerId: number,
    variantId: number
  ): Promise<VariantRating | undefined> {
    const ratingRaw =
      await oVariantRatingRep.getVariantRatingByCustomerAndVariant(
        customerId,
        variantId
      )

    if (!ratingRaw) return undefined

    return mapVariantRating(ratingRaw)
  }

  // ✅ Verificar si un customer ya ha calificado un variant (lógica de negocio)
  public async hasCustomerRatedVariant(
    customerId: number,
    variantId: number
  ): Promise<boolean> {
    return await oVariantRatingRep.checkDuplicateRating(customerId, variantId)
  }

  // ✅ Obtener estadísticas de ratings para un variant (lógica de negocio)
  public async getVariantRatingStats(
    variantId: number
  ): Promise<VariantRatingStats | undefined> {
    const stats = await oVariantRatingRep.getVariantRatingStats(variantId)
    return stats || undefined
  }

  // ✅ Obtener ratings con paginación y filtros (lógica de negocio)
  public async getVariantRatingsPaginated(
    filters: VariantRatingFilters
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw = await oVariantRatingRep.getVariantRatingsPaginated(
      filters.variantId,
      filters.rating,
      filters.verifiedOnly,
      filters.limit || 10,
      filters.offset || 0
    )
    return mapVariantRatings(ratingsRaw)
  }

  // ✅ Buscar ratings por contenido (lógica de negocio)
  public async searchVariantRatings(
    searchTerm: string,
    limit: number = 10
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw = await oVariantRatingRep.searchVariantRatings(
      searchTerm,
      limit
    )
    return mapVariantRatings(ratingsRaw)
  }

  // ✅ Obtener top ratings (mejor valorados) con paginación
  public async getTopVariantRatings(
    limit: number,
    offset: number
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw = await oVariantRatingRep.getTopVariantRatings(
      limit,
      offset
    )
    return mapVariantRatings(ratingsRaw)
  }

  // ✅ Obtener ratings recientes por variant (lógica de negocio)
  public async getRecentVariantRatings(
    variantId: number,
    days: number = 30
  ): Promise<VariantRating[] | undefined> {
    const ratingsRaw = await oVariantRatingRep.getRecentVariantRatings(
      variantId,
      days
    )
    return mapVariantRatings(ratingsRaw)
  }

  // ✅ Obtener resumen de actividad de ratings (lógica de negocio)
  public async getVariantRatingsSummary(variantId: number): Promise<{
    stats: VariantRatingStats | undefined
    recentRatings: VariantRating[] | undefined
    topRatings: VariantRating[] | undefined
  }> {
    const [stats, recentRatings, topRatings] = await Promise.all([
      this.getVariantRatingStats(variantId),
      this.getRecentVariantRatings(variantId, 7), // Últimos 7 días
      this.getVariantRatingsPaginated({
        variantId,
        rating: 5,
        verifiedOnly: true,
        limit: 3
      }) // Top 3 ratings de 5 estrellas verificadas
    ])

    return {
      stats,
      recentRatings,
      topRatings
    }
  }

  // ✅ Validar datos de rating antes de crear (lógica de negocio)
  private validateRatingData(
    ratingData: Omit<VariantRatingRaw, 'id' | 'created_at' | 'updated_at'>
  ): void {
    // Validar rating entre 1 y 5
    if (ratingData.rating < 1 || ratingData.rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    // Validar que verified_purchase sea boolean
    if (typeof ratingData.verified_purchase !== 'boolean') {
      throw new Error('Verified purchase must be a boolean')
    }

    // Validar longitud del título si existe
    if (ratingData.title && ratingData.title.length > 100) {
      throw new Error('Title must not exceed 100 characters')
    }

    // Validar longitud del review si existe
    if (ratingData.review && ratingData.review.length > 2000) {
      throw new Error('Review must not exceed 2000 characters')
    }
  }

  // ✅ Crear variant rating (con validación de negocio)
  public async createVariantRating(
    ratingData: Omit<VariantRatingRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VariantRating | undefined> {
    // Validar datos
    this.validateRatingData(ratingData)

    // Verificar que el customer no haya calificado ya este variant
    const hasRated = await this.hasCustomerRatedVariant(
      ratingData.customer_id,
      ratingData.variant_id
    )

    if (hasRated) {
      throw new Error('Customer has already rated this variant')
    }

    const created = await oVariantRatingRep.createVariantRating(ratingData)

    if (!created) return undefined

    return mapVariantRating(created)
  }

  // ✅ Actualizar variant rating (solo el owner puede actualizar)
  public async updateVariantRating(
    ratingData: Partial<
      Omit<
        VariantRatingRaw,
        'id' | 'customer_id' | 'variant_id' | 'created_at' | 'updated_at'
      >
    >,
    id: number,
    customerId: number
  ): Promise<VariantRating | undefined> {
    // Verificar que el rating pertenece al customer
    const existingRating = await this.getVariantRatingById(id)

    if (!existingRating || existingRating.customerId !== customerId) {
      throw new Error('Rating not found or not owned by customer')
    }

    // Validar solo los campos que se están actualizando
    if (ratingData.rating !== undefined) {
      if (ratingData.rating < 1 || ratingData.rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }
    }

    if (ratingData.title && ratingData.title.length > 100) {
      throw new Error('Title must not exceed 100 characters')
    }

    if (ratingData.review && ratingData.review.length > 2000) {
      throw new Error('Review must not exceed 2000 characters')
    }

    const updated = await oVariantRatingRep.updateVariantRating(ratingData, id)

    if (!updated) return undefined

    return mapVariantRating(updated)
  }

  // ✅ Eliminar variant rating (solo el owner puede eliminar)
  public async deleteVariantRating(
    id: number,
    customerId: number
  ): Promise<void> {
    // Verificar que el rating pertenece al customer
    const existingRating = await this.getVariantRatingById(id)

    if (!existingRating || existingRating.customerId !== customerId) {
      throw new Error('Rating not found or not owned by customer')
    }

    return await oVariantRatingRep.deleteVariantRating(id)
  }

  // ✅ Eliminar todas las ratings de un variant (admin)
  public async deleteVariantRatingsByVariantId(
    variantId: number
  ): Promise<void> {
    return await oVariantRatingRep.deleteVariantRatingsByVariantId(variantId)
  }

  // ✅ Eliminar todas las ratings de un customer (admin)
  public async deleteVariantRatingsByCustomerId(
    customerId: number
  ): Promise<void> {
    return await oVariantRatingRep.deleteVariantRatingsByCustomerId(customerId)
  }

  // ✅ Obtener métricas de rating para dashboard (lógica de negocio)
  public async getVariantRatingMetrics(variantId: number): Promise<
    | {
        totalRatings: number
        verifiedRatings: number
        averageRating: number
        verificationRate: number
        ratingTrend: 'up' | 'down' | 'stable'
      }
    | undefined
  > {
    const [stats, recentCount, olderCount] = await Promise.all([
      this.getVariantRatingStats(variantId),
      oVariantRatingRep.countVariantRatings(variantId),
      this.getRecentVariantRatings(variantId, 30)
    ])

    if (!stats) return undefined

    const verificationRate =
      stats.totalRatings > 0
        ? (stats.verifiedRatings / stats.totalRatings) * 100
        : 0

    // Determinar tendencia comparando últimos 30 días con los 30 anteriores
    let ratingTrend: 'up' | 'down' | 'stable' = 'stable'
    if (recentCount && olderCount) {
      const recentAvg =
        recentCount.reduce(
          (sum: number, r: VariantRating) => sum + r.rating,
          0
        ) / recentCount.length
      // Simplificado: comparar con promedio general
      if (recentAvg > stats.averageRating) ratingTrend = 'up'
      else if (recentAvg < stats.averageRating) ratingTrend = 'down'
    }

    return {
      totalRatings: stats.totalRatings,
      verifiedRatings: stats.verifiedRatings,
      averageRating: stats.averageRating,
      verificationRate: Number(verificationRate.toFixed(2)),
      ratingTrend
    }
  }
}

const variantRatingModel = new VariantRatingModel()
export default variantRatingModel
