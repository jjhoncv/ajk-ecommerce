import bannerModel from '@/module/banners/core/Banner.model'
import { hydrateBanners } from './hydrators'
import { type Banner } from './types'

export const searchBanners = async (q: string): Promise<Banner[]> => {
  try {
    const bannersData = await bannerModel.searchBanners(q)

    if (bannersData == null || bannersData.length === 0) {
      console.log('No se encontraron banners')
      return []
    }

    return hydrateBanners(bannersData)
  } catch (error) {
    throw new Error(
      `Error al obtener searchBanners ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
