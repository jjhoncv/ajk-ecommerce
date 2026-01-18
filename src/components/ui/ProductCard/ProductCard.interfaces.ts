// import { ProductComplete } from '@/module/products/core'
import { type ProductComplete, type ProductVariantComplete } from '@/module/products/core'
import { type ItemImage } from '@/shared'
import { type ProductVariants } from '@/types/domain'

// Props para el componente ProductCard
export interface ProductCardProps {
  product: ProductComplete
}

// Props para el componente ProductCardVariants
export interface ProductCardVariantsProps {
  variant: ProductVariants
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
