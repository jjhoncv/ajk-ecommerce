import { ProductVariants as ProductVariantRaw } from '@/types/database'
import { ProductVariants as ProductVariant } from '@/types/domain'

export const ProductVariantMapper = (
  data: ProductVariantRaw
): ProductVariant => {
  return {
    id: data.id,
    productId: data.product_id,
    sku: data.sku,
    price: data.price,
    stock: data.stock,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    product: undefined,
    promotionVariants: undefined,
    variantAttributeOptions: undefined,
    variantImages: undefined,
    variantRatings: undefined
  }
}

export const ProductVariantsMapper = (
  data: ProductVariantRaw[] | null
): ProductVariant[] | undefined => {
  if (data === null) return undefined
  return data.map(ProductVariantMapper)
}
