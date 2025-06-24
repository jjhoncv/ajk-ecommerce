import bannerModel from '@/backend/banner'
import { hydrateBanners } from './hydrators'
import { type Banner } from './types'

export const getBanner = async (): Promise<Banner[]> => {
  try {
    // Obtener todos los banners
    const bannersData = await bannerModel.getBanners()

    if (bannersData == null || bannersData.length === 0) {
      console.log('No se encontraron banners')
      return []
    }

    return hydrateBanners(bannersData)
  } catch (error) {
    throw new Error(
      `Error al obtener getBanner ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
