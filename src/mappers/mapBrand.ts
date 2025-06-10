import { Brands as BrandRaw } from '@/types/database'
import { Brands as Brand } from '@/types/domain'

export const mapBrand = (data: BrandRaw): Brand => {
  return {
    ...data,
    products: undefined
  }
}

export const mapBrands = (data: BrandRaw[] | null): Brand[] | undefined => {
  if (data === null) return undefined
  return data.map(mapBrand)
}
