import { type ProductVariants as ProductVariantRaw } from '@/types/database'
import { type ProductVariants as ProductVariant } from '@/types/domain'

export const ProductVariantMapper = (
  data: ProductVariantRaw
): ProductVariant => {
  return {
    id: data.id,
    productId: data.product_id,
    sku: data.sku,
    price: Number(data.price),
    stock: Number(data.stock),
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
