import { VariantRatings } from '@/types/domain'

// Interfaces para el resumen de valoraciones
export interface RatingSummary {
  averageRating: number
  totalRatings: number
  oneStar: number
  twoStar: number
  threeStar: number
  fourStar: number
  fiveStar: number
}

export interface RatingSearchResultDTO {
  ratings: VariantRatings[]
  summary: RatingSummary
  totalPages: number
  currentPage: number
}
