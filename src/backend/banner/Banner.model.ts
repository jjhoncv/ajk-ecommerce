import { type Banner as BannersRaw } from '@/types/database'
import { type Banner } from '@/types/domain'

// me
import { BannerMapper, BannersMapper } from './Banner.mapper'
import oBannerRep from './Banner.repository'

export class BannerModel {
  public async getBanners(): Promise<Banner[] | undefined> {
    const BannersRaw = await oBannerRep.getBanners()
    return BannersMapper(BannersRaw)
  }

  public async getBannerById(id: number): Promise<Banner | undefined> {
    const BannersRaw = await oBannerRep.getBannerById(id)
    if (BannersRaw == null) return undefined
    return BannerMapper(BannersRaw)
  }

  public async createBanner(
    bannerData: Omit<BannersRaw, 'id'>
  ): Promise<Banner | undefined> {
    const created = await oBannerRep.createBanner(bannerData)
    if (created == null) return undefined
    return BannerMapper(created)
  }

  public async updateBanner(
    bannerData: Omit<BannersRaw, 'id'>,
    id: number
  ): Promise<Banner | undefined> {
    const updated = await oBannerRep.updateBanner(bannerData, id)
    if (updated == null) return undefined
    return BannerMapper(updated)
  }

  public async deleteBanner(id: number): Promise<void> {
    await oBannerRep.deleteBanner(id)
  }
}

const bannerModel = new BannerModel()
export default bannerModel
