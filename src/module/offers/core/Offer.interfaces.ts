// Tipos de oferta
export type OfferType =
  | 'flash_sale'
  | 'daily_deal'
  | 'clearance'
  | 'bundle'
  | 'volume_discount'
  | 'seasonal'

// Tipos de descuento
export type OfferDiscountType = 'percentage' | 'fixed_amount' | 'fixed_price'

// Interfaz raw de base de datos
export interface OfferRaw {
  id: number
  name: string
  title: string
  description: string | null
  offer_type: OfferType
  discount_type: OfferDiscountType
  discount_value: number
  start_date: Date | string
  end_date: Date | string
  max_uses: number | null
  max_uses_per_customer: number
  current_uses: number
  min_quantity: number
  min_purchase_amount: number | null
  badge_text: string | null
  badge_color: string
  show_countdown: number
  show_stock_indicator: number
  show_savings: number
  image_url: string | null
  priority: number
  is_active: number
  is_featured: number
  created_at: Date | string
  updated_at: Date | string
}

// Interfaz raw de variante en oferta
export interface OfferVariantRaw {
  id: number
  offer_id: number
  variant_id: number
  offer_price: number
  original_price: number
  stock_limit: number | null
  sold_count: number
  created_at: Date | string
}

// Interfaz raw de vista variant_active_offers
export interface VariantActiveOfferRaw {
  variant_id: number
  offer_id: number
  offer_price: number
  original_price: number
  stock_limit: number | null
  sold_count: number
  remaining_stock: number | null
  offer_name: string
  offer_title: string
  offer_type: OfferType
  discount_type: OfferDiscountType
  discount_value: number
  start_date: Date | string
  end_date: Date | string
  badge_text: string | null
  badge_color: string
  show_countdown: number
  show_stock_indicator: number
  show_savings: number
  priority: number
  discount_percent: number
  savings_amount: number
}

// Interfaz de dominio (camelCase)
export interface Offer {
  id: number
  name: string
  title: string
  description: string | null
  offerType: OfferType
  discountType: OfferDiscountType
  discountValue: number
  startDate: Date
  endDate: Date
  maxUses: number | null
  maxUsesPerCustomer: number
  currentUses: number
  minQuantity: number
  minPurchaseAmount: number | null
  badgeText: string | null
  badgeColor: string
  showCountdown: boolean
  showStockIndicator: boolean
  showSavings: boolean
  imageUrl: string | null
  priority: number
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  // Campos calculados opcionales
  variants?: OfferVariant[]
  totalVariants?: number
  totalSold?: number
  minPrice?: number
  maxDiscountPercent?: number
}

// Interfaz de variante en oferta (dominio)
export interface OfferVariant {
  id: number
  offerId: number
  variantId: number
  offerPrice: number
  originalPrice: number
  stockLimit: number | null
  soldCount: number
  remainingStock: number | null
  createdAt: Date
  // Datos adicionales de la variante
  variantSku?: string
  variantName?: string
  productName?: string
  productId?: number
}

// Interfaz para oferta activa de una variante
export interface VariantActiveOffer {
  variantId: number
  offerId: number
  offerPrice: number
  originalPrice: number
  stockLimit: number | null
  soldCount: number
  remainingStock: number | null
  offerName: string
  offerTitle: string
  offerType: OfferType
  discountType: OfferDiscountType
  discountValue: number
  startDate: Date
  endDate: Date
  badgeText: string | null
  badgeColor: string
  showCountdown: boolean
  showStockIndicator: boolean
  showSavings: boolean
  priority: number
  discountPercent: number
  savingsAmount: number
  // Tiempo restante calculado
  timeRemaining?: {
    days: number
    hours: number
    minutes: number
    seconds: number
    totalSeconds: number
  }
}

// Interfaz para crear oferta
export interface CreateOfferInput {
  name: string
  title: string
  description?: string | null
  offerType: OfferType
  discountType: OfferDiscountType
  discountValue: number
  startDate: Date | string
  endDate: Date | string
  maxUses?: number | null
  maxUsesPerCustomer?: number
  minQuantity?: number
  minPurchaseAmount?: number | null
  badgeText?: string | null
  badgeColor?: string
  showCountdown?: boolean
  showStockIndicator?: boolean
  showSavings?: boolean
  imageUrl?: string | null
  priority?: number
  isActive?: boolean
  isFeatured?: boolean
  variants?: CreateOfferVariantInput[]
}

// Interfaz para agregar variante a oferta
export interface CreateOfferVariantInput {
  variantId: number
  offerPrice: number
  originalPrice: number
  stockLimit?: number | null
}

// Interfaz para actualizar oferta
export interface UpdateOfferInput {
  name?: string
  title?: string
  description?: string | null
  offerType?: OfferType
  discountType?: OfferDiscountType
  discountValue?: number
  startDate?: Date | string
  endDate?: Date | string
  maxUses?: number | null
  maxUsesPerCustomer?: number
  minQuantity?: number
  minPurchaseAmount?: number | null
  badgeText?: string | null
  badgeColor?: string
  showCountdown?: boolean
  showStockIndicator?: boolean
  showSavings?: boolean
  imageUrl?: string | null
  priority?: number
  isActive?: boolean
  isFeatured?: boolean
}

// Interfaz para filtros de ofertas
export interface OfferFilters {
  offerType?: OfferType
  isActive?: boolean
  isFeatured?: boolean
  includeExpired?: boolean
  search?: string
}

// Interfaz para uso de oferta
export interface OfferUsageRaw {
  id: number
  offer_id: number
  customer_id: number
  order_id: number
  variant_id: number
  quantity: number
  original_price: number
  offer_price: number
  discount_amount: number
  used_at: Date | string
}

export interface OfferUsage {
  id: number
  offerId: number
  customerId: number
  orderId: number
  variantId: number
  quantity: number
  originalPrice: number
  offerPrice: number
  discountAmount: number
  usedAt: Date
}

// Para el admin - oferta con detalles extendidos
export interface OfferForAdmin extends Offer {
  variants: OfferVariantForAdmin[]
  stats: {
    totalVariants: number
    totalSold: number
    totalRevenue: number
    totalSavings: number
  }
}

export interface OfferVariantForAdmin extends OfferVariant {
  productName: string
  variantSku: string
  variantAttributes?: string
  currentStock: number
  imageUrl?: string
}
