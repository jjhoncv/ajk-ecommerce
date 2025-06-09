import { variant_attribute_options as VariantAttributeOptionRaw } from '@/types/database'
import { VariantAttributeOptions as VariantAttributeOption } from '@/types/domain'

// ✅ Mapper individual puro - NO incluye relaciones
export const mapVariantAttributeOption = (
  data: VariantAttributeOptionRaw
): VariantAttributeOption => {
  return {
    variantId: data.variant_id,
    attributeOptionId: data.attribute_option_id,
    attributeOptions: undefined, // Se llena en el modelo con lógica de negocio
    productVariants: undefined // Se llena en el modelo con lógica de negocio
  }
}

// ✅ Para arrays - maneja null a nivel de array
export const mapVariantAttributeOptions = (
  data: VariantAttributeOptionRaw[] | null
): VariantAttributeOption[] | undefined => {
  if (data === null) return undefined
  return data.map(mapVariantAttributeOption)
}
