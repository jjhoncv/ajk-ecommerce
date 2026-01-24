import { executeQuery } from '@/lib/db'
import { type RatingStatus, type VariantRatings as VariantRatingRaw } from '@/types/database'
import { type VariantRatings as VariantRating } from '@/types/domain'

import {
  type RatingAdminSearchResult,
  type RatingForAdmin,
  type RatingModerationResult,
  type VariantRatingSearchResult,
  type VariantRatingSummary,
  type VariantRatingWithCustomer
} from './VariantRating.interfaces'
import {
  VariantRatingMapper,
  VariantRatingsMapper
} from './VariantRating.mapper'
import oVariantRatingRep from './VariantRating.repository'

export class VariantRatingModel {
  // ============================================================================
  // METODOS BASICOS
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
    await oVariantRatingRep.deleteVariantRating(id)
  }

  // ============================================================================
  // METODOS COMPLEJOS CON JOINS
  // ============================================================================

  public async getRatingsByVariantId(
    variantId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<VariantRatingSearchResult> {
    const offset = (page - 1) * limit

    // Solo mostrar valoraciones aprobadas en el frontend público
    const ratings = await executeQuery<
      Array<VariantRatingRaw & {
        customer_name: string
        customer_photo: string | null
        created_at: Date
      }>
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
          vr.variant_id = ? AND vr.status = 'approved'
        ORDER BY
          vr.created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: [variantId, limit, offset]
    })

    const countResult = await executeQuery<[{ total: number }]>({
      query:
        "SELECT COUNT(*) as total FROM variant_ratings WHERE variant_id = ? AND status = 'approved'",
      values: [variantId]
    })
    const totalCount = countResult[0]?.total || 0
    const totalPages = Math.ceil(totalCount / limit)

    const summary = await this.getVariantRatingSummary(variantId)

    // Obtener imágenes de los ratings
    const ratingIds = ratings.map((r) => r.id)
    let imagesMap = new Map<number, Array<{ id: number; imageUrl: string }>>()

    if (ratingIds.length > 0) {
      const placeholders = ratingIds.map(() => '?').join(',')
      const images = await executeQuery<
        Array<{ id: number; rating_id: number; image_url: string }>
      >({
        query: `SELECT id, rating_id, image_url FROM rating_images WHERE rating_id IN (${placeholders})`,
        values: ratingIds
      })

      // Agrupar imágenes por rating_id
      images.forEach((img) => {
        if (!imagesMap.has(img.rating_id)) {
          imagesMap.set(img.rating_id, [])
        }
        imagesMap.get(img.rating_id)!.push({ id: img.id, imageUrl: img.image_url })
      })
    }

    const ratingDTOs: VariantRatingWithCustomer[] = ratings.map((rating) => ({
      ...VariantRatingMapper(rating),
      customerName: rating.customer_name,
      customerPhoto: rating.customer_photo || undefined,
      createdAt: rating.created_at,
      ratingImages: imagesMap.get(rating.id)?.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        ratingId: rating.id
      })) || []
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
    // La vista variant_rating_summary ya filtra por status = 'approved'
    const summary = await executeQuery<
      Array<{
        variant_id: number
        total_ratings: number
        average_rating: number
        five_star: number
        four_star: number
        three_star: number
        two_star: number
        one_star: number
        verified_purchases: number
      }>
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
  // METODOS DE LOGICA DE NEGOCIO
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
      verified_purchase: verifiedPurchase ? 1 : 0,
      status: 'pending', // Nueva valoración siempre comienza como pendiente
      reviewed_by: null,
      reviewed_at: null
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
  // METODOS PARA BATCH LOADING
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
  // MÉTODOS PARA ADMIN - MODERACIÓN
  // ============================================================================

  public async getRatingsForAdmin(
    status?: RatingStatus,
    page: number = 1,
    limit: number = 20
  ): Promise<RatingAdminSearchResult> {
    const offset = (page - 1) * limit

    // Obtener ratings con información de producto, variante y cliente
    const ratings = await executeQuery<
      Array<
        VariantRatingRaw & {
          customer_name: string
          customer_lastname: string
          customer_email: string
          customer_photo: string | null
          product_name: string
          variant_sku: string
          variant_attributes: string | null
          reviewer_name: string | null
        }
      >
    >({
      query: `
        SELECT
          vr.*,
          c.name as customer_name,
          c.lastname as customer_lastname,
          c.email as customer_email,
          c.photo as customer_photo,
          p.name as product_name,
          pv.sku as variant_sku,
          (
            SELECT GROUP_CONCAT(CONCAT(a.name, ': ', pao.value) SEPARATOR ', ')
            FROM variant_attribute_options vao
            JOIN product_attribute_options pao ON vao.product_attribute_option_id = pao.id
            JOIN attributes a ON pao.attribute_id = a.id
            WHERE vao.variant_id = pv.id
          ) as variant_attributes,
          u.name as reviewer_name
        FROM variant_ratings vr
        JOIN customers c ON vr.customer_id = c.id
        JOIN product_variants pv ON vr.variant_id = pv.id
        JOIN products p ON pv.product_id = p.id
        LEFT JOIN users u ON vr.reviewed_by = u.id
        ${status ? 'WHERE vr.status = ?' : ''}
        ORDER BY vr.created_at DESC
        LIMIT ? OFFSET ?
      `,
      values: status ? [status, limit, offset] : [limit, offset]
    })

    // Obtener imágenes de los ratings
    const ratingIds = ratings.map((r) => r.id)
    let images: Array<{ id: number; rating_id: number; image_url: string }> = []

    if (ratingIds.length > 0) {
      const placeholders = ratingIds.map(() => '?').join(',')
      images = await executeQuery<
        Array<{ id: number; rating_id: number; image_url: string }>
      >({
        query: `SELECT id, rating_id, image_url FROM rating_images WHERE rating_id IN (${placeholders})`,
        values: ratingIds
      })
    }

    // Obtener conteos por estado
    const [pendingCount, approvedCount, rejectedCount, totalCount] =
      await Promise.all([
        oVariantRatingRep.countRatingsForAdmin('pending'),
        oVariantRatingRep.countRatingsForAdmin('approved'),
        oVariantRatingRep.countRatingsForAdmin('rejected'),
        oVariantRatingRep.countRatingsForAdmin(status)
      ])

    const totalPages = Math.ceil(totalCount / limit)

    const ratingsDTO: RatingForAdmin[] = ratings.map((rating) => ({
      ...VariantRatingMapper(rating),
      customerName: rating.customer_name,
      customerLastname: rating.customer_lastname,
      customerEmail: rating.customer_email,
      customerPhoto: rating.customer_photo || undefined,
      productName: rating.product_name,
      variantSku: rating.variant_sku,
      variantAttributes: rating.variant_attributes || undefined,
      reviewerName: rating.reviewer_name || undefined,
      images: images
        .filter((img) => img.rating_id === rating.id)
        .map((img) => ({ id: img.id, imageUrl: img.image_url }))
    }))

    return {
      ratings: ratingsDTO,
      totalCount,
      page,
      totalPages,
      pendingCount,
      approvedCount,
      rejectedCount
    }
  }

  public async getRatingDetailForAdmin(
    id: number
  ): Promise<RatingForAdmin | undefined> {
    const ratings = await executeQuery<
      Array<
        VariantRatingRaw & {
          customer_name: string
          customer_lastname: string
          customer_email: string
          customer_photo: string | null
          product_name: string
          variant_sku: string
          variant_attributes: string | null
          reviewer_name: string | null
        }
      >
    >({
      query: `
        SELECT
          vr.*,
          c.name as customer_name,
          c.lastname as customer_lastname,
          c.email as customer_email,
          c.photo as customer_photo,
          p.name as product_name,
          pv.sku as variant_sku,
          (
            SELECT GROUP_CONCAT(CONCAT(a.name, ': ', pao.value) SEPARATOR ', ')
            FROM variant_attribute_options vao
            JOIN product_attribute_options pao ON vao.product_attribute_option_id = pao.id
            JOIN attributes a ON pao.attribute_id = a.id
            WHERE vao.variant_id = pv.id
          ) as variant_attributes,
          u.name as reviewer_name
        FROM variant_ratings vr
        JOIN customers c ON vr.customer_id = c.id
        JOIN product_variants pv ON vr.variant_id = pv.id
        JOIN products p ON pv.product_id = p.id
        LEFT JOIN users u ON vr.reviewed_by = u.id
        WHERE vr.id = ?
      `,
      values: [id]
    })

    if (ratings.length === 0) return undefined

    const rating = ratings[0]

    // Obtener imágenes
    const images = await executeQuery<
      Array<{ id: number; image_url: string }>
    >({
      query: 'SELECT id, image_url FROM rating_images WHERE rating_id = ?',
      values: [id]
    })

    return {
      ...VariantRatingMapper(rating),
      customerName: rating.customer_name,
      customerLastname: rating.customer_lastname,
      customerEmail: rating.customer_email,
      customerPhoto: rating.customer_photo || undefined,
      productName: rating.product_name,
      variantSku: rating.variant_sku,
      variantAttributes: rating.variant_attributes || undefined,
      reviewerName: rating.reviewer_name || undefined,
      images: images.map((img) => ({ id: img.id, imageUrl: img.image_url }))
    }
  }

  public async moderateRating(
    id: number,
    status: RatingStatus,
    reviewedBy: number
  ): Promise<RatingModerationResult> {
    if (status !== 'approved' && status !== 'rejected') {
      return {
        success: false,
        rating: {} as VariantRating,
        message: 'Estado inválido. Use "approved" o "rejected".'
      }
    }

    const updated = await oVariantRatingRep.updateRatingStatus(
      id,
      status,
      reviewedBy
    )

    if (!updated) {
      return {
        success: false,
        rating: {} as VariantRating,
        message: 'No se encontró la valoración.'
      }
    }

    const statusMessage =
      status === 'approved' ? 'aprobada' : 'rechazada'

    return {
      success: true,
      rating: VariantRatingMapper(updated),
      message: `Valoración ${statusMessage} exitosamente.`
    }
  }

  // ============================================================================
  // ALIAS PARA COMPATIBILIDAD
  // ============================================================================

  public async getRatingById(id: number) {
    return await this.getVariantRatingById(id)
  }

  public async deleteRating(id: number) {
    await this.deleteVariantRating(id)
  }
}

const variantRatingModel = new VariantRatingModel()
export default variantRatingModel
