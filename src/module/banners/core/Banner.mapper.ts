import { type Banner as BannerRaw } from '@/types/database'
import { type Banner } from '@/types/domain'

export const BannerMapper = (data: BannerRaw): Banner => {
  return {
    id: data.id,
    title: data.title,
    buttonText: data.button_text,
    displayOrder: data.display_order,
    description: data.description,
    imageUrl: data.image_url,
    link: data.link,
    subtitle: data.subtitle
  }
}

export const BannersMapper = (
  data: BannerRaw[] | null
): Banner[] | undefined => {
  if (data === null) return undefined
  return data.map(BannerMapper)
}
