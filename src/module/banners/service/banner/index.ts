import { getBanner, getBanners, getBannerWithAudit } from './banner'
import { searchBanners } from './search'

export type { BannerWithAudit } from './banner'

const BannerService = {
  getBanners,
  searchBanners,
  getBanner,
  getBannerWithAudit
}

export default BannerService
