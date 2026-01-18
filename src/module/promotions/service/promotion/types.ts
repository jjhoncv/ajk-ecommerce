export interface Promotion {
  id: number
  name: string
  description?: string | null
  discountType: 'fixed_amount' | 'percentage'
  discountValue: number
  startDate: Date
  endDate: Date
  minPurchaseAmount?: number | null
  imageUrl?: string | null
  isActive?: number | null
  type?: string | null
}

export interface PromotionWithMetrics extends Promotion {
  variantCount: number
  variantsWithStock: number
  totalStockLimit: number
}

export interface PromotionVariant {
  promotionId: number
  variantId: number
  promotionPrice?: number | null
  stockLimit: number
  createdAt?: Date
}

export interface PromotionVariantWithInfo {
  variantId: number
  promotionPrice: number | null
  stockLimit: number
  createdAt: Date
  variant: {
    id: number
    sku: string
    price: number
    stock: number
    productId: number
    productName: string
  }
}
