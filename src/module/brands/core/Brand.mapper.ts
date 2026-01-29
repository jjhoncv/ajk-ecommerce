import { type Brands as BrandRaw } from '@/types/database'
import { type Brands as Brand } from '@/types/domain'

export const BrandMapper = (data: BrandRaw): Brand => {
  return {
    id: data.id,
    name: data.name,
    imageUrl: data.image_url ?? undefined,
    createdBy: data.created_by ?? undefined,
    updatedBy: data.updated_by ?? undefined,
    product: undefined
  }
}

export const BrandsMapper = (data: BrandRaw[] | null): Brand[] | undefined => {
  if (data === null) return undefined
  return data.map(BrandMapper)
}
