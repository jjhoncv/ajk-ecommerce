import { ProductComplete } from '@/backend/product'
import { ProductVariantComplete } from '@/backend/product-variant'
import { ItemImage } from '@/shared'

// Props para el componente ProductCard
export interface ProductCardProps {
  product: ProductComplete
}

// Props para el componente ProductCardVariants
export interface ProductCardVariantsProps {
  variantProduct: ProductVariantComplete
  layout?: 'grid' | 'list'
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
