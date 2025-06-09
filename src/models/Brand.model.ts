import { executeQuery } from '@/lib/db'
import { brands as BrandsRaw } from '@/types/database'

import { Brands as Brand } from '@/types/domain'

import { mapBrand, mapBrands } from '@/mappers/mapBrand'
import oBrandRep from '@/repository/Brand.repository'

export class BrandModel {
  public async getBrands(): Promise<Brand[] | undefined> {
    const brands = await oBrandRep.getBrands()
    return mapBrands(brands)
  }

  public async getBrandById(id: number): Promise<Brand | undefined> {
    const brand = await oBrandRep.getBrandById(id)
    if (brand === null) return undefined
    return mapBrand(brand)
  }

  public async createBrand(
    brand: Omit<BrandsRaw, 'id'>
  ): Promise<Brand | undefined> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO brands SET ?',
      values: [brand]
    })

    return await this.getBrandById(result.insertId)
  }

  public async updateBrand(
    brandData: Omit<BrandsRaw, 'id'>,
    id: number
  ): Promise<Brand | undefined> {
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

const brandModel = new BrandModel()
export default brandModel
