import { product_variants as ProductVariantRaw } from '@/types/database'
import { ProductVariants as ProductVariant } from '@/types/domain'

// ✅ Mapper individual puro - NO incluye relaciones
export const mapProductVariant = (data: ProductVariantRaw): ProductVariant => {
  return {
    id: data.id,
    productId: data.product_id,
    sku: data.sku,
    price: data.price,
    stock: data.stock,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    products: undefined, // Se llena en el modelo con lógica de negocio
    promotionVariants: undefined, // Se llena en el modelo con lógica de negocio
    variantAttributeOptions: undefined, // Se llena en el modelo con lógica de negocio
    variantImages: undefined, // Se llena en el modelo con lógica de negocio
    variantRatings: undefined // Se llena en el modelo con lógica de negocio
  }
}

// ✅ Para arrays - maneja null a nivel de array
export const mapProductVariants = (
  data: ProductVariantRaw[] | null
): ProductVariant[] | undefined => {
  if (data === null) return undefined
  return data.map(mapProductVariant)
}
