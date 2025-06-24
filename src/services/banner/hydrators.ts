import { type Banner } from '@/types/domain'
import { type Banner as BannerModel } from './types'
export const hydrateBanners = (data: Banner[]): BannerModel[] =>
  data.map(hydrateBanner)

export const hydrateBanner = (item: Banner): BannerModel => ({
  title: item.title,
  subtitle: item.subtitle ?? '',
  description: item.description ?? '',
  image: item.imageUrl ?? '',
  ctaLink: item.link ?? '',
  cta: item.buttonText ?? ''
})
