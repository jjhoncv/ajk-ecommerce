// import { ProductDTO, ProductVariantDTO } from "@/dto";
import {
  Products as Product,
  ProductVariants as ProductVariant
} from '@/types/domain'

// Props para el componente ProductCard
export interface ProductCardProps {
  product: {
    product: Product
    type?: 'variant' // Hacemos el tipo opcional ya que todos los productos son variantes
  }
  layout?: 'grid' | 'list'
  showCategories?: boolean
  className?: string
}

// Props para el componente ProductCardSlider
export interface ProductCardSliderProps {
  images?: {
    id: number
    imageUrl?: string // Para compatibilidad con versiones anteriores
    imageUrlThumb?: string
    imageUrlNormal?: string
    imageUrlZoom?: string
    isPrimary: boolean
    altText?: string
  }[]
  // productName: string;
  brandName?: string
  layout?: 'grid' | 'list'
  selectedVariant: ProductVariant
  variantProduct: ProductVariant
}

// Props para el componente ProductCardVariants
export interface ProductCardVariantsProps {
  variantProduct: ProductVariant
  layout?: 'grid' | 'list'
}

// Props para el componente ProductCardPromotion
export interface ProductCardPromotionProps {
  variant: ProductVariant
  layout?: 'grid' | 'list'
}
