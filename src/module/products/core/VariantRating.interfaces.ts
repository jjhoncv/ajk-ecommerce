import { type VariantRatings as VariantRating } from '@/types/domain'

// Rating status type - defined locally since it's not in the generated types
export type RatingStatus = 'pending' | 'approved' | 'rejected'

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
  createdAt?: Date
}

export interface VariantRatingSearchResult {
  ratings: VariantRatingWithCustomer[]
  totalCount: number
  page: number
  totalPages: number
  summary: VariantRatingSummary
}

// ============================================================================
// INTERFACES PARA ADMIN - MODERACIÓN
// ============================================================================

export interface RatingForAdmin extends VariantRating {
  customerName: string
  customerLastname: string
  customerEmail: string
  customerPhoto?: string
  productName: string
  variantSku: string
  variantAttributes?: string
  reviewerName?: string
  images: Array<{ id: number; imageUrl: string }>
}

export interface RatingAdminSearchResult {
  ratings: RatingForAdmin[]
  totalCount: number
  page: number
  totalPages: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
}

export interface RatingModerationResult {
  success: boolean
  rating: VariantRating
  message: string
}

export { type RatingStatus }
