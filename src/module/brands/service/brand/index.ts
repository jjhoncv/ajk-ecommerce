import { getBrand, getBrands, getBrandWithAudit, searchBrands } from './brand'

export type { BrandWithAudit } from './brand'
export type { Brand } from './types'

const BrandService = {
  getBrands,
  searchBrands,
  getBrand,
  getBrandWithAudit
}

export default BrandService
