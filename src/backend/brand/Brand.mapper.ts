import { Brands as BrandRaw } from '@/types/database'
import { Brands as Brand } from '@/types/domain'

export const BrandMapper = (data: BrandRaw): Brand => {
  return {
    ...data,
    products: undefined
  }
}

export const BrandsMapper = (data: BrandRaw[] | null): Brand[] | undefined => {
  if (data === null) return undefined
  return data.map(BrandMapper)
}
