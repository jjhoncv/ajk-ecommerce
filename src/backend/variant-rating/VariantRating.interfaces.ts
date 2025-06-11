import { VariantRatings as VariantRating } from '@/types/domain'

export interface VariantRatingSummary {
  variantId: number
  totalRatings: number
  averageRating: number
  fiveStar: number
  fourStar: number
  threeStar: number
  twoStar: number
  oneStar: number
  verifiedPurchases: number
}

export interface VariantRatingWithCustomer extends VariantRating {
  customerName: string
  customerPhoto?: string
}

export interface VariantRatingSearchResult {
  ratings: VariantRatingWithCustomer[]
  totalCount: number
  page: number
  totalPages: number
  summary: VariantRatingSummary
}
