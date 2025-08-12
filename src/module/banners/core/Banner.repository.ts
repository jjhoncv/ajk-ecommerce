import { executeQuery } from '@/lib/db'
import { type Banner as BannerRaw } from '@/types/database'

export class BannerRepository {
  public async getBanners(): Promise<BannerRaw[] | null> {
    const banners = await executeQuery<BannerRaw[]>({
      query: 'SELECT * FROM banner ORDER BY display_order ASC'
    })

    if (banners.length === 0) return null
    return banners
  }

  public async searchBanners(q?: string): Promise<BannerRaw[] | null> {
    const banners = await executeQuery<BannerRaw[]>({
      query:
        'SELECT * FROM banner WHERE title LIKE ? OR subtitle LIKE ? ORDER BY display_order ASC',
      values: [`%${q}%`, `%${q}%`]
    })

    if (banners.length === 0) return null
    return banners
  }

  public async getBannerById(id: number): Promise<BannerRaw | null> {
    const banners = await executeQuery<BannerRaw[]>({
      query: 'SELECT * FROM banner WHERE id = ?',
      values: [id]
    })

    if (banners.length === 0) return null
    return banners[0]
  }

  public async createBanner(
    banner: Omit<BannerRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<BannerRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO banner SET ?',
      values: [banner]
    })

    return await this.getBannerById(result.insertId)
  }

  public async updateBanner(
    bannerData: Omit<BannerRaw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<BannerRaw | null> {
    await executeQuery({
      query: 'UPDATE banner SET ? WHERE id=?',
      values: [bannerData, id]
    })

    return await this.getBannerById(id)
  }

  public async updateBannerOrder(
    id: number,
    displayOrder: number
  ): Promise<void> {
    await executeQuery({
      query: 'UPDATE banner SET display_order = ? WHERE id = ?',
      values: [displayOrder, id]
    })
  }

  public async deleteBanner(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM banner WHERE id=?',
      values: [id]
    })
  }
}

const bannerRepository = new BannerRepository()
export default bannerRepository
