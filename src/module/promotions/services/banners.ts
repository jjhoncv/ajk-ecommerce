import { getPromotions } from './promotion'
import { type BannerPromotion } from './types'

export const getBanners = async (): Promise<BannerPromotion[]> => {
  const promotionsData = await getPromotions()

  const sideBanners = promotionsData.map((promotion) => ({
    title: promotion.name,
    subtitle: promotion.description ?? '',
    image: promotion.imageUrl ?? '',
    link: `/promotion/${promotion.slug}`
  }))

  return sideBanners
}
