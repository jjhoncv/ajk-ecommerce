import {
  deletePromotion,
  getPromotionById,
  getPromotions,
  getPromotionsWithMetrics,
  getPromotionVariantsWithInfo
} from './promotion'

const PromotionService = {
  getPromotions,
  getPromotionsWithMetrics,
  getPromotionById,
  getPromotionVariantsWithInfo,
  deletePromotion
}

export default PromotionService
