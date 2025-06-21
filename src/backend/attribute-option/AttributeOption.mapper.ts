// generated
import { type AttributeOptions as AttributeOptionRaw } from '@/types/database'
import {
  type AttributeOptions as AttributeOption,
  type AttributeOptionImages,
  type VariantAttributeOptions
} from '@/types/domain'

export const AttributeOptionMapper = (
  data: AttributeOptionRaw
): AttributeOption => {
  return {
    id: data.id,
    attributeId: data.attribute_id,
    value: data.value,
    additionalCost: data.additional_cost ?? undefined,
    attributeOptionImages: undefined,
    variantAttributeOptions: undefined
  }
}

export const AttributeOptionMapperWithImages = (
  data: AttributeOptionRaw,
  images?: AttributeOptionImages[]
): AttributeOption => {
  return {
    ...AttributeOptionMapper(data),
    attributeOptionImages: images
  }
}

export const AttributeOptionMapperWithVariantOptions = (
  data: AttributeOptionRaw,
  variantOptions?: VariantAttributeOptions[]
): AttributeOption => {
  return {
    ...AttributeOptionMapper(data),
    variantAttributeOptions: variantOptions
  }
}

export const AttributeOptionMapperComplete = (
  data: AttributeOptionRaw,
  images?: AttributeOptionImages[],
  variantOptions?: VariantAttributeOptions[]
): AttributeOption => {
  return {
    ...AttributeOptionMapper(data),
    attributeOptionImages: images,
    variantAttributeOptions: variantOptions
  }
}

export const AttributeOptionsMapper = (
  data: AttributeOptionRaw[] | null
): AttributeOption[] | undefined => {
  if (data === null) return undefined
  return data.map(AttributeOptionMapper)
}
