import {
  ProductVariants as ProductVariant,
  VariantAttributeOptions as VariantAttributeOption,
  VariantImages as VariantImage,
  VariantRatingSummary
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
