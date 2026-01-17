import { type ProductAttributeOptions as ProductAttributeOptionRaw } from '@/types/database'
import { type ProductAttributeOptions as ProductAttributeOption } from '@/types/domain'

export const ProductAttributeOptionMapper = (
  data: ProductAttributeOptionRaw
): ProductAttributeOption => {
  return {
    id: data.id,
    productId: data.product_id,
    attributeId: data.attribute_id,
    value: data.value,
    displayOrder: data.display_order,
    product: undefined,
    attribute: undefined,
    productAttributeOptionImages: undefined
  }
}

export const ProductAttributeOptionsMapper = (
  data: ProductAttributeOptionRaw[] | null
): ProductAttributeOption[] | undefined => {
  if (!data) return undefined
  return data.map((item) => ProductAttributeOptionMapper(item))
}
