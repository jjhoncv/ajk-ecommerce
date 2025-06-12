import { VariantAttributeOptionWithDetailsRaw } from '@/backend/variant-attribute-option'
import { VariantAttributeOptions as VariantAttributeOptionRaw } from '@/types/database'
import { VariantAttributeOptions as VariantAttributeOption } from '@/types/domain'

export const VariantAttributeOptionMapper = (
  data: VariantAttributeOptionRaw
): VariantAttributeOption => {
  return {
    variantId: data.variant_id,
    attributeOptionId: data.attribute_option_id,
    attributeOption: undefined, // Se llena en el modelo con lógica de negocio
    productVariants: undefined // Se llena en el modelo con lógica de negocio
  }
}

export const VariantAttributeOptionsMapper = (
  data: VariantAttributeOptionRaw[] | null
): VariantAttributeOption[] | undefined => {
  if (data === null) return undefined
  return data.map(VariantAttributeOptionMapper)
}

export const VariantAttributeOptionsWithDetailMapper = (
  data: VariantAttributeOptionWithDetailsRaw[]
): VariantAttributeOption[] => {
  return data.map((item) => ({
    attributeOptionId: item.attribute_option_id,
    variantId: item.variant_id,
    attributeOption: {
      attributeId: item.attribute_id,
      id: item.attribute_option_id,
      value: item.attribute_option_value,
      additionalCost: item.additional_cost
    }
  }))
  // return data.map((item) => ({
  //   additionalCost: Number(item.additional_cost),
  //   attributeDisplayType: item.attribute_display_type,
  //   attributeId: item.attribute_id,
  //   attributeName: item.attribute_name,
  //   attributeOptionValue: item.attribute_option_value,
  //   attributeOptionId: item.attribute_option_id,
  //   variantId: item.variant_id
  // }))
}
