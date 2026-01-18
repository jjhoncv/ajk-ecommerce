import { type Brands as BrandsRaw } from '@/types/database'
import { type Brands as Brand } from '@/types/domain'

import { BrandMapper, BrandsMapper } from './Brand.mapper'
import oBrandRep from './Brand.repository'

export class BrandModel {
  public async getBrands(): Promise<Brand[] | undefined> {
    const brandsRaw = await oBrandRep.getBrands()
    return BrandsMapper(brandsRaw)
  }

  public async getBrandById(id: number): Promise<Brand | undefined> {
    const brandRaw = await oBrandRep.getBrandById(id)
    if (!brandRaw) return undefined
    return BrandMapper(brandRaw)
  }

  public async createBrand(
    brandData: Omit<BrandsRaw, 'id'>
  ): Promise<Brand | undefined> {
    const created = await oBrandRep.createBrand(brandData)
    if (!created) return undefined
    return BrandMapper(created)
  }

  public async updateBrand(
    brandData: Omit<BrandsRaw, 'id'>,
    id: number
  ): Promise<Brand | undefined> {
    const updated = await oBrandRep.updateBrand(brandData, id)
    if (!updated) return undefined
    return BrandMapper(updated)
  }

  public async deleteBrand(id: number): Promise<void> {
    await oBrandRep.deleteBrand(id)
  }
}

const brandModel = new BrandModel()
export default brandModel
