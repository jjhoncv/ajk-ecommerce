// Promotion exports
export { default as promotionModel } from './Promotion.model'
export { PromotionMapper, PromotionsMapper } from './Promotion.mapper'
export { default as promotionRepository } from './Promotion.repository'

// PromotionVariant exports
export { default as promotionVariantModel } from './PromotionVariant.model'
export { PromotionVariantMapper, PromotionVariantsMapper } from './PromotionVariant.mapper'
export { default as promotionVariantRepository } from './PromotionVariant.repository'
export { type PromotionMetrics, type PromotionSummaryForVariant } from './PromotionVariant.interfaces'
