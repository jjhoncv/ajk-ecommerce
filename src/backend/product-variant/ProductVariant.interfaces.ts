import {
  AttributeOptionImages as AttributeOptionImage,
  ProductVariants as ProductVariant,
  VariantAttributeOptions as VariantAttributeOption,
  VariantImages as VariantImage
} from '@/types/domain'

export interface ProductVariantWithAttributeOptions extends ProductVariant {
  variantAttributeOptions: VariantAttributeOption[]
}

export interface ProductVariantWithImages extends ProductVariant {
  variantImages?: VariantImage[]
}
export interface ProductVariantComplete extends ProductVariant {
  variantAttributeOptions: VariantAttributeOption[]
  variantImages?: VariantImage[]
  attributeImages: AttributeOptionImage[]
  promotion?: {
    id: number
    name: string
    discountType: 'percentage' | 'fixed_amount'
    discountValue: number
    promotionPrice: number | null
    startDate: Date
    endDate: Date
    stockLimit: number | null
  }
  ratings?: {
    totalRatings: number
    averageRating: number
    fiveStar: number
    fourStar: number
    threeStar: number
    twoStar: number
    oneStar: number
    verifiedPurchases: number
  }
}
