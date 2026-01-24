import offerRepository from './Offer.repository'
import offerMapper from './Offer.mapper'
import {
  type Offer,
  type OfferVariant,
  type VariantActiveOffer,
  type OfferFilters,
  type CreateOfferInput,
  type UpdateOfferInput,
  type OfferForAdmin,
  type OfferVariantForAdmin
} from './Offer.interfaces'

export class OfferModel {
  // ============================================================================
  // OFERTAS - LECTURA
  // ============================================================================

  /**
   * Obtiene todas las ofertas con filtros
   */
  public async getOffers(filters?: OfferFilters): Promise<Offer[] | null> {
    const rawOffers = await offerRepository.getOffers(filters)
    if (!rawOffers) return null
    return offerMapper.toOffers(rawOffers)
  }

  /**
   * Obtiene ofertas activas
   */
  public async getActiveOffers(): Promise<Offer[] | null> {
    const rawOffers = await offerRepository.getActiveOffers()
    if (!rawOffers) return null
    return offerMapper.toOffers(rawOffers)
  }

  /**
   * Obtiene ofertas destacadas activas
   */
  public async getFeaturedOffers(limit: number = 5): Promise<Offer[] | null> {
    const rawOffers = await offerRepository.getFeaturedOffers(limit)
    if (!rawOffers) return null
    return offerMapper.toOffers(rawOffers)
  }

  /**
   * Obtiene una oferta por ID
   */
  public async getOfferById(id: number): Promise<Offer | null> {
    const rawOffer = await offerRepository.getOfferById(id)
    if (!rawOffer) return null
    return offerMapper.toOffer(rawOffer)
  }

  /**
   * Obtiene una oferta con sus variantes
   */
  public async getOfferWithVariants(id: number): Promise<Offer | null> {
    const offer = await this.getOfferById(id)
    if (!offer) return null

    const rawVariants = await offerRepository.getOfferVariants(id)
    if (rawVariants) {
      offer.variants = offerMapper.toOfferVariants(rawVariants)
    }

    return offer
  }

  /**
   * Obtiene ofertas que terminan pronto
   */
  public async getEndingSoonOffers(hours: number = 24): Promise<Offer[] | null> {
    const rawOffers = await offerRepository.getEndingSoonOffers(hours)
    if (!rawOffers) return null
    return offerMapper.toOffers(rawOffers)
  }

  // ============================================================================
  // OFERTAS - ADMIN
  // ============================================================================

  /**
   * Obtiene oferta con detalles completos para admin
   */
  public async getOfferForAdmin(id: number): Promise<OfferForAdmin | null> {
    const offer = await this.getOfferById(id)
    if (!offer) return null

    const rawVariants = await offerRepository.getOfferVariantsWithDetails(id)
    const stats = await offerRepository.getOfferStats(id)

    const variants: OfferVariantForAdmin[] = rawVariants
      ? rawVariants.map((rv) => ({
          id: rv.id,
          offerId: rv.offer_id,
          variantId: rv.variant_id,
          offerPrice: Number(rv.offer_price),
          originalPrice: Number(rv.original_price),
          stockLimit: rv.stock_limit,
          soldCount: rv.sold_count,
          remainingStock: rv.stock_limit !== null ? rv.stock_limit - rv.sold_count : null,
          createdAt: new Date(rv.created_at),
          productName: rv.product_name,
          variantSku: rv.variant_sku,
          currentStock: rv.current_stock,
          imageUrl: rv.image_url ?? undefined,
          productId: rv.product_id
        }))
      : []

    return {
      ...offer,
      variants,
      stats: {
        totalVariants: variants.length,
        totalSold: stats.totalSold,
        totalRevenue: stats.totalRevenue,
        totalSavings: stats.totalSavings
      }
    }
  }

  /**
   * Cuenta ofertas por estado
   */
  public async getOfferStats(): Promise<{
    active: number
    scheduled: number
    expired: number
    total: number
  }> {
    return offerRepository.countOffersByStatus()
  }

  // ============================================================================
  // OFERTAS - ESCRITURA
  // ============================================================================

  /**
   * Crea una nueva oferta
   */
  public async createOffer(input: CreateOfferInput): Promise<Offer | null> {
    const rawData = offerMapper.toCreateOfferRaw(input)
    const rawOffer = await offerRepository.createOffer(rawData)

    if (!rawOffer) return null

    // Si hay variantes, agregarlas
    if (input.variants && input.variants.length > 0) {
      for (const variant of input.variants) {
        await offerRepository.addOfferVariant(
          rawOffer.id,
          variant.variantId,
          variant.offerPrice,
          variant.originalPrice,
          variant.stockLimit
        )
      }
    }

    return offerMapper.toOffer(rawOffer)
  }

  /**
   * Actualiza una oferta
   */
  public async updateOffer(id: number, input: UpdateOfferInput): Promise<Offer | null> {
    const rawData = offerMapper.toUpdateOfferRaw(input)
    const rawOffer = await offerRepository.updateOffer(id, rawData)
    if (!rawOffer) return null
    return offerMapper.toOffer(rawOffer)
  }

  /**
   * Elimina una oferta
   */
  public async deleteOffer(id: number): Promise<void> {
    await offerRepository.deleteOffer(id)
  }

  /**
   * Activa/desactiva una oferta
   */
  public async toggleOfferStatus(id: number, isActive: boolean): Promise<Offer | null> {
    return this.updateOffer(id, { isActive })
  }

  // ============================================================================
  // VARIANTES EN OFERTA
  // ============================================================================

  /**
   * Obtiene las variantes de una oferta
   */
  public async getOfferVariants(offerId: number): Promise<OfferVariant[] | null> {
    const rawVariants = await offerRepository.getOfferVariants(offerId)
    if (!rawVariants) return null
    return offerMapper.toOfferVariants(rawVariants)
  }

  /**
   * Agrega una variante a una oferta
   */
  public async addVariantToOffer(
    offerId: number,
    variantId: number,
    offerPrice: number,
    originalPrice: number,
    stockLimit?: number | null
  ): Promise<OfferVariant | null> {
    const rawVariant = await offerRepository.addOfferVariant(
      offerId,
      variantId,
      offerPrice,
      originalPrice,
      stockLimit
    )
    if (!rawVariant) return null
    return offerMapper.toOfferVariant(rawVariant)
  }

  /**
   * Actualiza una variante en oferta
   */
  public async updateVariantInOffer(
    offerId: number,
    variantId: number,
    data: { offerPrice?: number; stockLimit?: number | null }
  ): Promise<void> {
    await offerRepository.updateOfferVariant(offerId, variantId, data)
  }

  /**
   * Elimina una variante de una oferta
   */
  public async removeVariantFromOffer(offerId: number, variantId: number): Promise<void> {
    await offerRepository.removeOfferVariant(offerId, variantId)
  }

  /**
   * Reemplaza todas las variantes de una oferta
   */
  public async replaceOfferVariants(
    offerId: number,
    variants: Array<{
      variantId: number
      offerPrice: number
      originalPrice: number
      stockLimit?: number | null
    }>
  ): Promise<void> {
    await offerRepository.removeAllOfferVariants(offerId)

    for (const variant of variants) {
      await offerRepository.addOfferVariant(
        offerId,
        variant.variantId,
        variant.offerPrice,
        variant.originalPrice,
        variant.stockLimit
      )
    }
  }

  // ============================================================================
  // OFERTAS ACTIVAS POR VARIANTE
  // ============================================================================

  /**
   * Obtiene la oferta activa para una variante (la de mayor prioridad)
   */
  public async getActiveOfferForVariant(variantId: number): Promise<VariantActiveOffer | null> {
    const rawOffer = await offerRepository.getActiveOfferForVariant(variantId)
    if (!rawOffer) return null
    return offerMapper.toVariantActiveOffer(rawOffer)
  }

  /**
   * Obtiene ofertas activas para múltiples variantes
   */
  public async getActiveOffersForVariants(variantIds: number[]): Promise<Map<number, VariantActiveOffer>> {
    const result = new Map<number, VariantActiveOffer>()
    if (variantIds.length === 0) return result

    const rawOffers = await offerRepository.getActiveOffersForVariants(variantIds)
    if (!rawOffers) return result

    for (const raw of rawOffers) {
      result.set(raw.variant_id, offerMapper.toVariantActiveOffer(raw))
    }

    return result
  }

  /**
   * Obtiene todas las variantes en ofertas activas
   */
  public async getAllActiveOfferVariants(limit: number = 50): Promise<VariantActiveOffer[] | null> {
    const rawOffers = await offerRepository.getAllActiveOfferVariants(limit)
    if (!rawOffers) return null
    return offerMapper.toVariantActiveOffers(rawOffers)
  }

  /**
   * Verifica si una variante está en oferta activa
   */
  public async isVariantInActiveOffer(variantId: number): Promise<boolean> {
    return offerRepository.isVariantInActiveOffer(variantId)
  }

  // ============================================================================
  // USO DE OFERTAS
  // ============================================================================

  /**
   * Verifica si un cliente puede usar una oferta
   */
  public async canCustomerUseOffer(offerId: number, customerId: number): Promise<{
    canUse: boolean
    reason?: string
  }> {
    const offer = await this.getOfferById(offerId)
    if (!offer) {
      return { canUse: false, reason: 'Oferta no encontrada' }
    }

    if (!offer.isActive) {
      return { canUse: false, reason: 'Oferta no activa' }
    }

    const now = new Date()
    if (now < offer.startDate || now > offer.endDate) {
      return { canUse: false, reason: 'Oferta fuera de fecha' }
    }

    if (offer.maxUses !== null && offer.currentUses >= offer.maxUses) {
      return { canUse: false, reason: 'Oferta agotada' }
    }

    const customerUsage = await offerRepository.countOfferUsageByCustomer(offerId, customerId)
    if (customerUsage >= offer.maxUsesPerCustomer) {
      return { canUse: false, reason: 'Has alcanzado el límite de uso de esta oferta' }
    }

    return { canUse: true }
  }

  /**
   * Registra el uso de una oferta (llamado al completar compra)
   */
  public async recordOfferUsage(data: {
    offerId: number
    customerId: number
    orderId: number
    variantId: number
    quantity: number
    originalPrice: number
    offerPrice: number
  }): Promise<void> {
    const discountAmount = (data.originalPrice - data.offerPrice) * data.quantity

    await offerRepository.recordOfferUsage({
      ...data,
      discountAmount
    })

    // Incrementar contadores
    await offerRepository.incrementOfferUses(data.offerId, 1)
    await offerRepository.incrementOfferVariantSold(data.offerId, data.variantId, data.quantity)
  }

  // ============================================================================
  // CÁLCULOS DE PRECIO
  // ============================================================================

  /**
   * Calcula el precio final de una variante considerando ofertas
   */
  public async calculateFinalPrice(
    variantId: number,
    originalPrice: number,
    quantity: number = 1
  ): Promise<{
    finalPrice: number
    hasOffer: boolean
    offer: VariantActiveOffer | null
    savings: number
  }> {
    const offer = await this.getActiveOfferForVariant(variantId)

    if (!offer) {
      return {
        finalPrice: originalPrice,
        hasOffer: false,
        offer: null,
        savings: 0
      }
    }

    // Verificar cantidad mínima (para descuentos por volumen)
    const rawOffer = await offerRepository.getOfferById(offer.offerId)
    if (rawOffer && rawOffer.min_quantity > quantity) {
      return {
        finalPrice: originalPrice,
        hasOffer: false,
        offer: null,
        savings: 0
      }
    }

    return {
      finalPrice: offer.offerPrice,
      hasOffer: true,
      offer,
      savings: originalPrice - offer.offerPrice
    }
  }
}

const offerModel = new OfferModel()
export default offerModel
