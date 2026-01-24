import { executeQuery } from '@/lib/db'
import {
  type OfferRaw,
  type OfferVariantRaw,
  type VariantActiveOfferRaw,
  type OfferFilters,
  type OfferUsageRaw
} from './Offer.interfaces'

export class OfferRepository {
  // ============================================================================
  // OFERTAS
  // ============================================================================

  /**
   * Obtiene todas las ofertas con filtros opcionales
   */
  public async getOffers(filters?: OfferFilters): Promise<OfferRaw[] | null> {
    let query = 'SELECT * FROM offers WHERE 1=1'
    const values: (string | number | boolean)[] = []

    if (filters?.offerType) {
      query += ' AND offer_type = ?'
      values.push(filters.offerType)
    }

    if (filters?.isActive !== undefined) {
      query += ' AND is_active = ?'
      values.push(filters.isActive ? 1 : 0)
    }

    if (filters?.isFeatured !== undefined) {
      query += ' AND is_featured = ?'
      values.push(filters.isFeatured ? 1 : 0)
    }

    if (!filters?.includeExpired) {
      query += ' AND end_date >= NOW()'
    }

    if (filters?.search) {
      query += ' AND (name LIKE ? OR title LIKE ?)'
      const searchTerm = `%${filters.search}%`
      values.push(searchTerm, searchTerm)
    }

    query += ' ORDER BY priority DESC, start_date DESC'

    const offers = await executeQuery<OfferRaw[]>({ query, values })
    return offers.length > 0 ? offers : null
  }

  /**
   * Obtiene ofertas activas (dentro del rango de fechas y activas)
   */
  public async getActiveOffers(): Promise<OfferRaw[] | null> {
    const offers = await executeQuery<OfferRaw[]>({
      query: `
        SELECT * FROM offers
        WHERE is_active = 1
          AND NOW() BETWEEN start_date AND end_date
          AND (max_uses IS NULL OR current_uses < max_uses)
        ORDER BY priority DESC, end_date ASC
      `
    })

    return offers.length > 0 ? offers : null
  }

  /**
   * Obtiene ofertas destacadas activas
   */
  public async getFeaturedOffers(limit: number = 5): Promise<OfferRaw[] | null> {
    const offers = await executeQuery<OfferRaw[]>({
      query: `
        SELECT * FROM offers
        WHERE is_active = 1
          AND is_featured = 1
          AND NOW() BETWEEN start_date AND end_date
          AND (max_uses IS NULL OR current_uses < max_uses)
        ORDER BY priority DESC, end_date ASC
        LIMIT ?
      `,
      values: [limit]
    })

    return offers.length > 0 ? offers : null
  }

  /**
   * Obtiene una oferta por ID
   */
  public async getOfferById(id: number): Promise<OfferRaw | null> {
    const offers = await executeQuery<OfferRaw[]>({
      query: 'SELECT * FROM offers WHERE id = ?',
      values: [id]
    })

    return offers.length > 0 ? offers[0] : null
  }

  /**
   * Crea una nueva oferta
   */
  public async createOffer(
    data: Omit<OfferRaw, 'id' | 'current_uses' | 'created_at' | 'updated_at'>
  ): Promise<OfferRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO offers (
          name, title, description, offer_type,
          discount_type, discount_value,
          start_date, end_date,
          max_uses, max_uses_per_customer,
          min_quantity, min_purchase_amount,
          badge_text, badge_color,
          show_countdown, show_stock_indicator, show_savings,
          image_url, priority, is_active, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        data.name,
        data.title,
        data.description,
        data.offer_type,
        data.discount_type,
        data.discount_value,
        data.start_date,
        data.end_date,
        data.max_uses,
        data.max_uses_per_customer,
        data.min_quantity,
        data.min_purchase_amount,
        data.badge_text,
        data.badge_color,
        data.show_countdown,
        data.show_stock_indicator,
        data.show_savings,
        data.image_url,
        data.priority,
        data.is_active,
        data.is_featured
      ]
    })

    return this.getOfferById(result.insertId)
  }

  /**
   * Actualiza una oferta
   */
  public async updateOffer(id: number, data: Partial<OfferRaw>): Promise<OfferRaw | null> {
    const fields: string[] = []
    const values: (string | number | Date | null)[] = []

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`)
        values.push(value as string | number | Date | null)
      }
    })

    if (fields.length === 0) return this.getOfferById(id)

    values.push(id)

    await executeQuery({
      query: `UPDATE offers SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    })

    return this.getOfferById(id)
  }

  /**
   * Elimina una oferta
   */
  public async deleteOffer(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM offers WHERE id = ?',
      values: [id]
    })
  }

  /**
   * Incrementa el contador de usos de una oferta
   */
  public async incrementOfferUses(id: number, count: number = 1): Promise<void> {
    await executeQuery({
      query: 'UPDATE offers SET current_uses = current_uses + ? WHERE id = ?',
      values: [count, id]
    })
  }

  // ============================================================================
  // VARIANTES EN OFERTA
  // ============================================================================

  /**
   * Obtiene las variantes de una oferta
   */
  public async getOfferVariants(offerId: number): Promise<OfferVariantRaw[] | null> {
    const variants = await executeQuery<OfferVariantRaw[]>({
      query: 'SELECT * FROM offer_variants WHERE offer_id = ?',
      values: [offerId]
    })

    return variants.length > 0 ? variants : null
  }

  /**
   * Obtiene las variantes de una oferta con datos del producto
   */
  public async getOfferVariantsWithDetails(offerId: number): Promise<Array<OfferVariantRaw & {
    variant_sku: string
    product_name: string
    product_id: number
    current_stock: number
    image_url: string | null
  }> | null> {
    const variants = await executeQuery<Array<OfferVariantRaw & {
      variant_sku: string
      product_name: string
      product_id: number
      current_stock: number
      image_url: string | null
    }>>({
      query: `
        SELECT
          ov.*,
          pv.sku AS variant_sku,
          pv.stock AS current_stock,
          p.name AS product_name,
          p.id AS product_id,
          (SELECT image_url_thumb FROM variant_images vi WHERE vi.variant_id = pv.id AND vi.is_primary = 1 LIMIT 1) AS image_url
        FROM offer_variants ov
        INNER JOIN product_variants pv ON ov.variant_id = pv.id
        INNER JOIN products p ON pv.product_id = p.id
        WHERE ov.offer_id = ?
      `,
      values: [offerId]
    })

    return variants.length > 0 ? variants : null
  }

  /**
   * Agrega una variante a una oferta
   */
  public async addOfferVariant(
    offerId: number,
    variantId: number,
    offerPrice: number,
    originalPrice: number,
    stockLimit?: number | null
  ): Promise<OfferVariantRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO offer_variants (offer_id, variant_id, offer_price, original_price, stock_limit)
        VALUES (?, ?, ?, ?, ?)
      `,
      values: [offerId, variantId, offerPrice, originalPrice, stockLimit ?? null]
    })

    const variants = await executeQuery<OfferVariantRaw[]>({
      query: 'SELECT * FROM offer_variants WHERE id = ?',
      values: [result.insertId]
    })

    return variants.length > 0 ? variants[0] : null
  }

  /**
   * Actualiza una variante en oferta
   */
  public async updateOfferVariant(
    offerId: number,
    variantId: number,
    data: { offerPrice?: number; stockLimit?: number | null }
  ): Promise<void> {
    const fields: string[] = []
    const values: (number | null)[] = []

    if (data.offerPrice !== undefined) {
      fields.push('offer_price = ?')
      values.push(data.offerPrice)
    }

    if (data.stockLimit !== undefined) {
      fields.push('stock_limit = ?')
      values.push(data.stockLimit)
    }

    if (fields.length === 0) return

    values.push(offerId, variantId)

    await executeQuery({
      query: `UPDATE offer_variants SET ${fields.join(', ')} WHERE offer_id = ? AND variant_id = ?`,
      values
    })
  }

  /**
   * Elimina una variante de una oferta
   */
  public async removeOfferVariant(offerId: number, variantId: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM offer_variants WHERE offer_id = ? AND variant_id = ?',
      values: [offerId, variantId]
    })
  }

  /**
   * Elimina todas las variantes de una oferta
   */
  public async removeAllOfferVariants(offerId: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM offer_variants WHERE offer_id = ?',
      values: [offerId]
    })
  }

  /**
   * Incrementa el contador de ventas de una variante en oferta
   */
  public async incrementOfferVariantSold(
    offerId: number,
    variantId: number,
    count: number = 1
  ): Promise<void> {
    await executeQuery({
      query: `
        UPDATE offer_variants
        SET sold_count = sold_count + ?
        WHERE offer_id = ? AND variant_id = ?
      `,
      values: [count, offerId, variantId]
    })
  }

  // ============================================================================
  // OFERTAS ACTIVAS POR VARIANTE (Vista)
  // ============================================================================

  /**
   * Obtiene la oferta activa de mayor prioridad para una variante
   */
  public async getActiveOfferForVariant(variantId: number): Promise<VariantActiveOfferRaw | null> {
    const offers = await executeQuery<VariantActiveOfferRaw[]>({
      query: `
        SELECT * FROM variant_active_offers
        WHERE variant_id = ?
        ORDER BY priority DESC
        LIMIT 1
      `,
      values: [variantId]
    })

    return offers.length > 0 ? offers[0] : null
  }

  /**
   * Obtiene ofertas activas para múltiples variantes
   */
  public async getActiveOffersForVariants(variantIds: number[]): Promise<VariantActiveOfferRaw[] | null> {
    if (variantIds.length === 0) return null

    const placeholders = variantIds.map(() => '?').join(',')
    const offers = await executeQuery<VariantActiveOfferRaw[]>({
      query: `
        SELECT vao.*
        FROM variant_active_offers vao
        INNER JOIN (
          SELECT variant_id, MAX(priority) as max_priority
          FROM variant_active_offers
          WHERE variant_id IN (${placeholders})
          GROUP BY variant_id
        ) grouped ON vao.variant_id = grouped.variant_id AND vao.priority = grouped.max_priority
        WHERE vao.variant_id IN (${placeholders})
      `,
      values: [...variantIds, ...variantIds]
    })

    return offers.length > 0 ? offers : null
  }

  /**
   * Obtiene todas las variantes en ofertas activas
   */
  public async getAllActiveOfferVariants(limit: number = 50): Promise<VariantActiveOfferRaw[] | null> {
    const offers = await executeQuery<VariantActiveOfferRaw[]>({
      query: `
        SELECT * FROM variant_active_offers
        ORDER BY priority DESC, discount_percent DESC
        LIMIT ?
      `,
      values: [limit]
    })

    return offers.length > 0 ? offers : null
  }

  // ============================================================================
  // USO DE OFERTAS
  // ============================================================================

  /**
   * Registra el uso de una oferta
   */
  public async recordOfferUsage(data: {
    offerId: number
    customerId: number
    orderId: number
    variantId: number
    quantity: number
    originalPrice: number
    offerPrice: number
    discountAmount: number
  }): Promise<void> {
    await executeQuery({
      query: `
        INSERT INTO offer_usage (
          offer_id, customer_id, order_id, variant_id,
          quantity, original_price, offer_price, discount_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        data.offerId,
        data.customerId,
        data.orderId,
        data.variantId,
        data.quantity,
        data.originalPrice,
        data.offerPrice,
        data.discountAmount
      ]
    })
  }

  /**
   * Cuenta usos de una oferta por cliente
   */
  public async countOfferUsageByCustomer(offerId: number, customerId: number): Promise<number> {
    const result = await executeQuery<Array<{ count: number }>>({
      query: `
        SELECT COUNT(*) as count FROM offer_usage
        WHERE offer_id = ? AND customer_id = ?
      `,
      values: [offerId, customerId]
    })

    return result[0].count
  }

  /**
   * Obtiene el historial de uso de una oferta
   */
  public async getOfferUsageHistory(offerId: number): Promise<OfferUsageRaw[] | null> {
    const usage = await executeQuery<OfferUsageRaw[]>({
      query: `
        SELECT * FROM offer_usage
        WHERE offer_id = ?
        ORDER BY used_at DESC
      `,
      values: [offerId]
    })

    return usage.length > 0 ? usage : null
  }

  /**
   * Obtiene estadísticas de una oferta
   */
  public async getOfferStats(offerId: number): Promise<{
    totalSold: number
    totalRevenue: number
    totalSavings: number
    uniqueCustomers: number
  }> {
    const result = await executeQuery<Array<{
      total_sold: number
      total_revenue: number
      total_savings: number
      unique_customers: number
    }>>({
      query: `
        SELECT
          COALESCE(SUM(quantity), 0) as total_sold,
          COALESCE(SUM(offer_price * quantity), 0) as total_revenue,
          COALESCE(SUM(discount_amount), 0) as total_savings,
          COUNT(DISTINCT customer_id) as unique_customers
        FROM offer_usage
        WHERE offer_id = ?
      `,
      values: [offerId]
    })

    return {
      totalSold: result[0].total_sold,
      totalRevenue: Number(result[0].total_revenue),
      totalSavings: Number(result[0].total_savings),
      uniqueCustomers: result[0].unique_customers
    }
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Verifica si una variante está en alguna oferta activa
   */
  public async isVariantInActiveOffer(variantId: number): Promise<boolean> {
    const result = await executeQuery<Array<{ count: number }>>({
      query: `
        SELECT COUNT(*) as count FROM variant_active_offers
        WHERE variant_id = ?
      `,
      values: [variantId]
    })

    return result[0].count > 0
  }

  /**
   * Obtiene ofertas que terminan pronto (próximas X horas)
   */
  public async getEndingSoonOffers(hours: number = 24): Promise<OfferRaw[] | null> {
    const offers = await executeQuery<OfferRaw[]>({
      query: `
        SELECT * FROM offers
        WHERE is_active = 1
          AND NOW() BETWEEN start_date AND end_date
          AND end_date <= DATE_ADD(NOW(), INTERVAL ? HOUR)
        ORDER BY end_date ASC
      `,
      values: [hours]
    })

    return offers.length > 0 ? offers : null
  }

  /**
   * Cuenta ofertas por estado
   */
  public async countOffersByStatus(): Promise<{
    active: number
    scheduled: number
    expired: number
    total: number
  }> {
    const result = await executeQuery<Array<{
      active: number
      scheduled: number
      expired: number
      total: number
    }>>({
      query: `
        SELECT
          SUM(CASE WHEN is_active = 1 AND NOW() BETWEEN start_date AND end_date THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN is_active = 1 AND start_date > NOW() THEN 1 ELSE 0 END) as scheduled,
          SUM(CASE WHEN end_date < NOW() THEN 1 ELSE 0 END) as expired,
          COUNT(*) as total
        FROM offers
      `
    })

    return result[0]
  }
}

const offerRepository = new OfferRepository()
export default offerRepository
