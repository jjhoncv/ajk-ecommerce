import { type Products as ProductRaw } from '@/types/database'
import { type Products as Product } from '@/types/domain'

export const ProductMapper = (data: ProductRaw): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    basePrice: Number(data.base_price) ?? undefined,
    brandId: data.brand_id,
    brand: undefined,
    productVariants: undefined,
    productCategories: undefined
  }
}

export const ProductsMapper = (
  data: ProductRaw[] | null
): Product[] | undefined => {
  if (data === null) return undefined
  return data.map(ProductMapper)
}
