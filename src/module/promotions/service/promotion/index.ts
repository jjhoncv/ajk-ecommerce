import {
  deletePromotion,
  getPromotionById,
  getPromotions,
  getPromotionsWithMetrics,
  getPromotionVariantsWithInfo,
  getPromotionWithAudit
} from './promotion'

const PromotionService = {
  getPromotions,
  getPromotionsWithMetrics,
  getPromotionById,
  getPromotionVariantsWithInfo,
  deletePromotion,
  getPromotionWithAudit
}

export default PromotionService
