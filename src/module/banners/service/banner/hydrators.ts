import { type Banner } from '@/types/domain'
import { type Banner as BannerModel } from './types'
export const hydrateBanners = (data: Banner[]): BannerModel[] =>
  data.map(hydrateBanner)

export const hydrateBanner = (item: Banner): BannerModel => ({
  id: item.id.toString(),
  title: item.title,
  subtitle: item.subtitle ?? '',
  description: item.description ?? '',
  image: item.imageUrl ?? '',
  ctaLink: item.link ?? '',
  cta: item.buttonText ?? '',
  link: item.link ?? '',
  buttonText: item.buttonText ?? ''
})
