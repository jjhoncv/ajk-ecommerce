import bannerModel from '@/module/banners/core'
import userModel from '@/module/users/core/User.model'
import { hydrateBanner, hydrateBanners } from './hydrators'
import { type Banner } from './types'

export interface BannerWithAudit {
  banner: Banner
  audit: {
    createdAt: Date | null
    createdByName: string | null
    updatedAt: Date | null
    updatedByName: string | null
  }
}

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

export const getBannerWithAudit = async (id: number): Promise<BannerWithAudit | null> => {
  try {
    const bannerData = await bannerModel.getBannerById(id)
    if (bannerData === undefined) return null

    const banner = hydrateBanner(bannerData)

    // Obtener nombres de usuarios
    const [createdByName, updatedByName] = await Promise.all([
      bannerData.createdBy ? userModel.getUserFullName(bannerData.createdBy) : null,
      bannerData.updatedBy ? userModel.getUserFullName(bannerData.updatedBy) : null
    ])

    return {
      banner,
      audit: {
        createdAt: bannerData.createdAt ?? null,
        createdByName,
        updatedAt: bannerData.updatedAt ?? null,
        updatedByName
      }
    }
  } catch (error) {
    throw new Error(
      `Error al obtener getBannerWithAudit ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
