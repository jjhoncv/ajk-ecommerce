import { Products as ProductRaw } from '@/types/database'
import { Products as Product } from '@/types/domain'

// ✅ Mapper individual puro - NO incluye relaciones
export const mapProduct = (data: ProductRaw): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    basePrice: data.base_price ?? undefined,
    brandId: data.brand_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    brands: undefined, // Se llena en el modelo con lógica de negocio
    productVariants: undefined // Se llena en el modelo con lógica de negocio
  }
}

// ✅ Para arrays - maneja null a nivel de array
export const mapProducts = (
  data: ProductRaw[] | null
): Product[] | undefined => {
  if (data === null) return undefined
  return data.map(mapProduct)
}
