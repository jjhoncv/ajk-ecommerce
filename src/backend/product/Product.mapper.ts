import { Products as ProductRaw } from '@/types/database'
import { Products as Product } from '@/types/domain'

export const ProductMapper = (data: ProductRaw): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    basePrice: data.base_price ?? undefined,
    brandId: data.brand_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    brands: undefined,
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
