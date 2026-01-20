// ProductImageSlider exports
export * from './ProductImageSlider'

// ProductCard exports
export { default as ProductCard } from './ProductCard/ProductCard'
export { default as ProductCardSlider } from './ProductCard/ProductCardSlider'
export { default as ProductCardVariants } from './ProductCard/ProductCardVariants'
export { default as ProductCardPromotion } from './ProductCard/ProductCardPromotion'
export { default as ProductCardDeal } from './ProductCard/ProductCardDeal'
export { default as ProductCardPrice } from './ProductCard/ProductCardPrice'
export { default as ProductCardButtonAddToCart } from './ProductCard/ProductCardButtonAddToCart'
export { default as ProductCardButtonView } from './ProductCard/ProductCardButtonView'
export { PromotionBadge } from './ProductCard/PromotionBadge'
export * from './ProductCard/ProductCard.interfaces'
export * from './ProductCard/ProductCard.helpers'

// ProductVariant components
export { default as ProductVariantInteractive } from './ProductVariantInteractive'
export { default as ProductVariantView } from './ProductVariantView'
export { ProductVariantPrice } from './ProductVariantPrice'
export { ProductVariantInfo } from './ProductVariantInfo'
export { ProductVariantPurchase } from './ProductVariantPurchase'
export { ProductVariantPromotion } from './ProductVariantPromotion'
export { default as ProductVariantButtonAddToCart } from './ProductVariantButtonAddToCart'
export { default as ProductVariantButtonBuyNow } from './ProductVariantButtonBuyNow'
export { default as ProductVariantAttributeSelector } from './ProductVariantAttributeSelector'
export { ProductVariantInteractiveShimmer } from './ProductVariantInteractiveShimmer'
// ProductVariantNotFound no se exporta aquí porque usa Layout que tiene código del servidor
// Usar: import { ProductVariantNotFound } from '@/module/products/components/ProductVariantNotFound'

// AddressSelectionModal
export { AddressSelectionModal } from './AddressSelectionModal'

// ProductVariantRating exports
export * from './ProductVariantRating'

// ProductVariantShipping exports
export * from './ProductVariantShipping'

// Helpers
export {
  getPriceIfHasPromotion,
  cleanAndValidateImages,
  findPrimaryImageIndex,
  getImageTypeLabel
} from './ProductVariant.helpers'
export type { CleanImage } from './ProductVariant.helpers'
