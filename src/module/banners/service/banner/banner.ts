import bannerModel from '@/module/banners/core'
import { hydrateBanner, hydrateBanners } from './hydrators'
import { type Banner } from './types'

export const getBanners = async (): Promise<Banner[]> => {
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

export const getBanner = async (id: number): Promise<Banner | undefined> => {
  try {
    // Obtener todos los banners
    const bannersData = await bannerModel.getBannerById(id)
    if (bannersData === undefined) {
      console.log('No se encontraron banners')
      return bannersData
    }

    return hydrateBanner(bannersData)
  } catch (error) {
    throw new Error(
      `Error al obtener getBanner ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
