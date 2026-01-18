import {
  type ProductVariants as ProductVariant,
  type VariantAttributeOptions as VariantAttributeOption,
  type VariantImages as VariantImage,
  type VariantRatingSummary
} from '@/types/domain'

export interface ProductVariantWithAttributeOptions extends ProductVariant {
  variantAttributeOptions: VariantAttributeOption[]
}

export interface ProductVariantWithImages extends ProductVariant {
  variantImages?: VariantImage[]
}
export interface ProductVariantComplete extends ProductVariant {
  variantRatingSummary?: VariantRatingSummary
}
