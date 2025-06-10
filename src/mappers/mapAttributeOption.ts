import { AttributeOptions as AttributeOptionRaw } from '@/types/database'
import {
  AttributeOptions as AttributeOption,
  AttributeOptionImages,
  VariantAttributeOptions
} from '@/types/domain'

// ✅ Mapper individual puro - NO incluye relaciones
export const mapAttributeOption = (
  data: AttributeOptionRaw
): AttributeOption => {
  return {
    id: data.id,
    attributeId: data.attribute_id,
    value: data.value,
    additionalCost: data.additional_cost ?? undefined,
    attributeOptionImages: undefined, // Se llena en el modelo con lógica de negocio
    variantAttributeOptions: undefined // Se llena en el modelo con lógica de negocio
  }
}

// ✅ Mapper con images (para usar en modelo cuando ya tienes las images)
export const mapAttributeOptionWithImages = (
  data: AttributeOptionRaw,
  images?: AttributeOptionImages[]
): AttributeOption => {
  return {
    ...mapAttributeOption(data),
    attributeOptionImages: images
  }
}

// ✅ Mapper con variant attribute options (para usar en modelo cuando ya tienes las relaciones)
export const mapAttributeOptionWithVariantOptions = (
  data: AttributeOptionRaw,
  variantOptions?: VariantAttributeOptions[]
): AttributeOption => {
  return {
    ...mapAttributeOption(data),
    variantAttributeOptions: variantOptions
  }
}

// ✅ Mapper completo con todas las relaciones
export const mapAttributeOptionComplete = (
  data: AttributeOptionRaw,
  images?: AttributeOptionImages[],
  variantOptions?: VariantAttributeOptions[]
): AttributeOption => {
  return {
    ...mapAttributeOption(data),
    attributeOptionImages: images,
    variantAttributeOptions: variantOptions
  }
}

// ✅ Para arrays - maneja null a nivel de array
export const mapAttributeOptions = (
  data: AttributeOptionRaw[] | null
): AttributeOption[] | undefined => {
  if (data === null) return undefined
  return data.map(mapAttributeOption)
}
