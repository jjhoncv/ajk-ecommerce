// Product exports
export { default as productModel } from './Product.model'
export { ProductMapper, ProductsMapper } from './Product.mapper'
export { default as productRepository } from './Product.repository'
export { type ProductComplete, type ProductVariantComplete } from './Product.interfaces'

// ProductVariant exports
export { default as productVariantModel } from './ProductVariant.model'
export { ProductVariantMapper, ProductVariantsMapper } from './ProductVariant.mapper'
export { default as productVariantRepository } from './ProductVariant.repository'
export {
  type ProductVariantWithAttributeOptions,
  type ProductVariantWithImages,
  type ProductVariantComplete as ProductVariantCompleteType
} from './ProductVariant.interfaces'

// VariantImage exports
export { default as variantImageModel } from './VariantImage.model'
export { VariantImageMapper, VariantImagesMapper } from './VariantImage.mapper'
export { default as variantImageRepository } from './VariantImage.repository'

// VariantAttributeOption exports
export { default as variantAttributeOptionModel } from './VariantAttributeOption.model'
export {
  VariantAttributeOptionMapper,
  VariantAttributeOptionsMapper,
  VariantAttributeOptionsWithDetailMapper
} from './VariantAttributeOption.mapper'
export { default as variantAttributeOptionRepository } from './VariantAttributeOption.repository'
export { type VariantAttributeOptionWithDetailsRaw } from './VariantAttributeOption.repository'

// VariantRating exports
export { default as variantRatingModel } from './VariantRating.model'
export { VariantRatingMapper, VariantRatingsMapper } from './VariantRating.mapper'
export { default as variantRatingRepository } from './VariantRating.repository'
export {
  type VariantRatingSummary,
  type VariantRatingWithCustomer,
  type VariantRatingSearchResult
} from './VariantRating.interfaces'

// ProductAttributeOption exports
export { default as productAttributeOptionModel } from './ProductAttributeOption.model'
export {
  ProductAttributeOptionMapper,
  ProductAttributeOptionsMapper
} from './ProductAttributeOption.mapper'
export { default as productAttributeOptionRepository } from './ProductAttributeOption.repository'
