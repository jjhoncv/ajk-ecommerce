import { type VariantAttributeOptionWithDetailsRaw } from '@/backend/variant-attribute-option'
import { type VariantAttributeOptions as VariantAttributeOptionRaw } from '@/types/database'
import { type VariantAttributeOptions as VariantAttributeOption } from '@/types/domain'

export const VariantAttributeOptionMapper = (
  data: VariantAttributeOptionRaw
): VariantAttributeOption => {
  return {
    variantId: data.variant_id,
    productAttributeOptionId: data.product_attribute_option_id,
    additionalCost: data.additional_cost ?? undefined,
    productAttributeOption: undefined, // Se llena en el modelo con lógica de negocio
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
    productAttributeOptionId: item.product_attribute_option_id,
    variantId: item.variant_id,
    additionalCost: item.variant_additional_cost ?? undefined,
    productAttributeOption: {
      attributeId: item.attribute_id,
      id: item.product_attribute_option_id,
      value: item.attribute_option_value,
      productId: 0, // Not available in this query
      displayOrder: undefined,
      attribute: {
        displayType: item.attribute_display_type,
        id: item.attribute_id,
        name: item.attribute_name
      }
    },
    productVariants: undefined
  }))
}
