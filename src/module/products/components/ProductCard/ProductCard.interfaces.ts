import { type ProductComplete, type ProductVariantComplete } from '@/module/products/core'
import { type ItemImage } from '@/module/shared/types/shared'
import { type VariantActiveOffer } from '@/module/offers/core'

// Props para el componente ProductCard
export interface ProductCardProps {
  product: ProductComplete
  offer?: VariantActiveOffer | null
}

// Props para el componente ProductCardVariants
export interface ProductCardVariantsProps {
  variantProduct: {
    variants: Array<{
      price: number
      promotion?: { promotionPrice?: number }
      attributes: Array<{ name: string; value: string; display_type?: string }>
    }>
  }
  selectedVariantIndex: number
  setSelectedVariantIndex: (index: number) => void
}

// Props para el componente ProductCardPromotion
export interface ProductCardPromotionProps {
  variant: ProductVariantComplete
  layout?: 'grid' | 'list'
}

export interface ProductCardSliderProps {
  images: ItemImage[]
  onFavoriteClick?: () => void
}

// Props para el componente ProductCardDeal
export interface ProductCardDealProps {
  product: {
    id: number
    variantId: number
    image: string
    name: string
    discount: number
    price: number
    originalPrice?: number
    stock: number
    timer: string
    quantity: number
  }
  layout?: 'grid' | 'list'
}
