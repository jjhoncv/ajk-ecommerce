// import { ProductComplete } from '@/backend/product'
import { type ProductComplete } from '@/backend/product'
import { type ProductVariantComplete } from '@/backend/product-variant'
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
