import { executeQuery } from '@/lib/db'
import { brands as BrandsRaw } from '@/types/database'

export class BrandRepository {
  public async getBrands(): Promise<BrandsRaw[] | null> {
    const brands = await executeQuery<BrandsRaw[]>({
      query: 'SELECT * FROM brands'
    })

    if (brands.length === 0) return null
    return brands
  }

  public async getBrandById(id: number): Promise<BrandsRaw | null> {
    const brands = await executeQuery<BrandsRaw[]>({
      query: 'SELECT * FROM brands WHERE id = ?',
      values: [id]
    })

    if (brands.length === 0) return null
    return brands[0]
  }

  public async createBrand(
    brand: Omit<BrandsRaw, 'id'>
  ): Promise<BrandsRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO brands SET ?',
      values: [brand]
    })

    return await this.getBrandById(result.insertId)
  }

  public async updateBrand(
    brandData: Omit<BrandsRaw, 'id'>,
    id: number
  ): Promise<BrandsRaw | null> {
    await executeQuery({
      query: 'UPDATE brands SET ? WHERE id=?',
      values: [brandData, id]
    })

    return await this.getBrandById(id)
  }

  public async deleteBrand(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM brands WHERE id=?',
      values: [id]
    })
  }
}

const brandRepository = new BrandRepository()
export default brandRepository
