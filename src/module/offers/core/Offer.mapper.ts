import {
  type Offer,
  type OfferRaw,
  type OfferVariant,
  type OfferVariantRaw,
  type VariantActiveOffer,
  type VariantActiveOfferRaw,
  type CreateOfferInput,
  type UpdateOfferInput,
  type OfferUsage,
  type OfferUsageRaw
} from './Offer.interfaces'

export class OfferMapper {
  /**
   * Convierte OfferRaw a Offer (dominio)
   */
  public toOffer(raw: OfferRaw): Offer {
    return {
      id: raw.id,
      name: raw.name,
      title: raw.title,
      description: raw.description,
      offerType: raw.offer_type,
      discountType: raw.discount_type,
      discountValue: Number(raw.discount_value),
      startDate: new Date(raw.start_date),
      endDate: new Date(raw.end_date),
      maxUses: raw.max_uses,
      maxUsesPerCustomer: raw.max_uses_per_customer,
      currentUses: raw.current_uses,
      minQuantity: raw.min_quantity,
      minPurchaseAmount: raw.min_purchase_amount ? Number(raw.min_purchase_amount) : null,
      badgeText: raw.badge_text,
      badgeColor: raw.badge_color,
      showCountdown: raw.show_countdown === 1,
      showStockIndicator: raw.show_stock_indicator === 1,
      showSavings: raw.show_savings === 1,
      imageUrl: raw.image_url,
      priority: raw.priority,
      isActive: raw.is_active === 1,
      isFeatured: raw.is_featured === 1,
      createdAt: new Date(raw.created_at),
      updatedAt: new Date(raw.updated_at)
    }
  }

  /**
   * Convierte array de OfferRaw a array de Offer
   */
  public toOffers(rawList: OfferRaw[]): Offer[] {
    return rawList.map((raw) => this.toOffer(raw))
  }

  /**
   * Convierte OfferVariantRaw a OfferVariant
   */
  public toOfferVariant(raw: OfferVariantRaw): OfferVariant {
    return {
      id: raw.id,
      offerId: raw.offer_id,
      variantId: raw.variant_id,
      offerPrice: Number(raw.offer_price),
      originalPrice: Number(raw.original_price),
      stockLimit: raw.stock_limit,
      soldCount: raw.sold_count,
      remainingStock: raw.stock_limit !== null ? raw.stock_limit - raw.sold_count : null,
      createdAt: new Date(raw.created_at)
    }
  }

  /**
   * Convierte array de OfferVariantRaw a array de OfferVariant
   */
  public toOfferVariants(rawList: OfferVariantRaw[]): OfferVariant[] {
    return rawList.map((raw) => this.toOfferVariant(raw))
  }

  /**
   * Convierte VariantActiveOfferRaw a VariantActiveOffer
   */
  public toVariantActiveOffer(raw: VariantActiveOfferRaw): VariantActiveOffer {
    const endDate = new Date(raw.end_date)
    const now = new Date()
    const totalSeconds = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / 1000))

    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      variantId: raw.variant_id,
      offerId: raw.offer_id,
      offerPrice: Number(raw.offer_price),
      originalPrice: Number(raw.original_price),
      stockLimit: raw.stock_limit,
      soldCount: raw.sold_count,
      remainingStock: raw.remaining_stock,
      offerName: raw.offer_name,
      offerTitle: raw.offer_title,
      offerType: raw.offer_type,
      discountType: raw.discount_type,
      discountValue: Number(raw.discount_value),
      startDate: new Date(raw.start_date),
      endDate,
      badgeText: raw.badge_text,
      badgeColor: raw.badge_color,
      showCountdown: raw.show_countdown === 1,
      showStockIndicator: raw.show_stock_indicator === 1,
      showSavings: raw.show_savings === 1,
      priority: raw.priority,
      discountPercent: Number(raw.discount_percent),
      savingsAmount: Number(raw.savings_amount),
      timeRemaining: {
        days,
        hours,
        minutes,
        seconds,
        totalSeconds
      }
    }
  }

  /**
   * Convierte array de VariantActiveOfferRaw a array de VariantActiveOffer
   */
  public toVariantActiveOffers(rawList: VariantActiveOfferRaw[]): VariantActiveOffer[] {
    return rawList.map((raw) => this.toVariantActiveOffer(raw))
  }

  /**
   * Convierte OfferUsageRaw a OfferUsage
   */
  public toOfferUsage(raw: OfferUsageRaw): OfferUsage {
    return {
      id: raw.id,
      offerId: raw.offer_id,
      customerId: raw.customer_id,
      orderId: raw.order_id,
      variantId: raw.variant_id,
      quantity: raw.quantity,
      originalPrice: Number(raw.original_price),
      offerPrice: Number(raw.offer_price),
      discountAmount: Number(raw.discount_amount),
      usedAt: new Date(raw.used_at)
    }
  }

  /**
   * Convierte CreateOfferInput a datos para INSERT
   */
  public toCreateOfferRaw(input: CreateOfferInput): Omit<OfferRaw, 'id' | 'current_uses' | 'created_at' | 'updated_at'> {
    return {
      name: input.name,
      title: input.title,
      description: input.description ?? null,
      offer_type: input.offerType,
      discount_type: input.discountType,
      discount_value: input.discountValue,
      start_date: new Date(input.startDate),
      end_date: new Date(input.endDate),
      max_uses: input.maxUses ?? null,
      max_uses_per_customer: input.maxUsesPerCustomer ?? 1,
      min_quantity: input.minQuantity ?? 1,
      min_purchase_amount: input.minPurchaseAmount ?? null,
      badge_text: input.badgeText ?? null,
      badge_color: input.badgeColor ?? 'red',
      show_countdown: input.showCountdown ? 1 : 0,
      show_stock_indicator: input.showStockIndicator ? 1 : 0,
      show_savings: input.showSavings !== false ? 1 : 0,
      image_url: input.imageUrl ?? null,
      priority: input.priority ?? 0,
      is_active: input.isActive !== false ? 1 : 0,
      is_featured: input.isFeatured ? 1 : 0
    }
  }

  /**
   * Convierte UpdateOfferInput a datos para UPDATE
   */
  public toUpdateOfferRaw(input: UpdateOfferInput): Partial<OfferRaw> {
    const data: Partial<OfferRaw> = {}

    if (input.name !== undefined) data.name = input.name
    if (input.title !== undefined) data.title = input.title
    if (input.description !== undefined) data.description = input.description
    if (input.offerType !== undefined) data.offer_type = input.offerType
    if (input.discountType !== undefined) data.discount_type = input.discountType
    if (input.discountValue !== undefined) data.discount_value = input.discountValue
    if (input.startDate !== undefined) data.start_date = new Date(input.startDate)
    if (input.endDate !== undefined) data.end_date = new Date(input.endDate)
    if (input.maxUses !== undefined) data.max_uses = input.maxUses
    if (input.maxUsesPerCustomer !== undefined) data.max_uses_per_customer = input.maxUsesPerCustomer
    if (input.minQuantity !== undefined) data.min_quantity = input.minQuantity
    if (input.minPurchaseAmount !== undefined) data.min_purchase_amount = input.minPurchaseAmount
    if (input.badgeText !== undefined) data.badge_text = input.badgeText
    if (input.badgeColor !== undefined) data.badge_color = input.badgeColor
    if (input.showCountdown !== undefined) data.show_countdown = input.showCountdown ? 1 : 0
    if (input.showStockIndicator !== undefined) data.show_stock_indicator = input.showStockIndicator ? 1 : 0
    if (input.showSavings !== undefined) data.show_savings = input.showSavings ? 1 : 0
    if (input.imageUrl !== undefined) data.image_url = input.imageUrl
    if (input.priority !== undefined) data.priority = input.priority
    if (input.isActive !== undefined) data.is_active = input.isActive ? 1 : 0
    if (input.isFeatured !== undefined) data.is_featured = input.isFeatured ? 1 : 0

    return data
  }
}

const offerMapper = new OfferMapper()
export default offerMapper
