import { type Brands as BrandRaw } from '@/types/database'
import { type Brands as Brand } from '@/types/domain'

export const BrandMapper = (data: BrandRaw): Brand => {
  return {
    ...data,
    product: undefined
  }
}

export const BrandsMapper = (data: BrandRaw[] | null): Brand[] | undefined => {
  if (data === null) return undefined
  return data.map(BrandMapper)
}
