import { VariantAttributeOptions as VariantAttributeOptionRaw } from '@/types/database'
import { VariantAttributeOptions as VariantAttributeOption } from '@/types/domain'

export const VariantAttributeOptionMapper = (
  data: VariantAttributeOptionRaw
): VariantAttributeOption => {
  return {
    variantId: data.variant_id,
    attributeOptionId: data.attribute_option_id,
    attributeOptions: undefined, // Se llena en el modelo con lógica de negocio
    productVariants: undefined // Se llena en el modelo con lógica de negocio
  }
}

export const VariantAttributeOptionsMapper = (
  data: VariantAttributeOptionRaw[] | null
): VariantAttributeOption[] | undefined => {
  if (data === null) return undefined
  return data.map(VariantAttributeOptionMapper)
}
