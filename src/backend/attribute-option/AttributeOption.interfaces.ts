// generated
import { type AttributeOptions as AttributeOption } from '@/types/domain'

// me
export interface AttributeOptionWithImages extends AttributeOption {
  attributeOptionImages?: AttributeOption['attributeOptionImages']
}

export interface AttributeOptionWithVariantOptions extends AttributeOption {
  variantAttributeOptions?: AttributeOption['variantAttributeOptions']
}

export interface AttributeOptionComplete extends AttributeOption {
  attributeOptionImages?: AttributeOption['attributeOptionImages']
  variantAttributeOptions?: AttributeOption['variantAttributeOptions']
}
