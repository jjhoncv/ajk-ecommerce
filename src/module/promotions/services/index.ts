import { getBanners } from './banners'
import { getPromotion, getPromotionBySlug, getPromotions } from './promotion'

const PromotionService = {
  getPromotions,
  getPromotion,
  getPromotionBySlug,
  getBanners
}

export default PromotionService
