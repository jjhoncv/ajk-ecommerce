// DTO para valoraciones de productos

// DTO para imágenes de valoraciones
export interface RatingImageDTO {
  id: number;
  ratingId: number;
  imageUrl: string;
}

// DTO para valoraciones individuales
export interface RatingDTO {
  id: number;
  variantId: number;
  customerId: number;
  customerName: string;
  customerPhoto?: string;
  rating: number; // 1-5 estrellas
  review?: string;
  title?: string;
  verifiedPurchase: boolean;
  createdAt: Date;
  images: RatingImageDTO[];
}

// DTO para resumen de valoraciones de una variante
export interface VariantRatingSummaryDTO {
  variantId: number;
  totalRatings: number;
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  verifiedPurchases: number;
}

// DTO para resumen de valoraciones de un producto (todas sus variantes)
export interface ProductRatingSummaryDTO {
  productId: number;
  totalRatings: number;
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  verifiedPurchases: number;
}

// DTO para resultados de búsqueda de valoraciones
export interface RatingSearchResultDTO {
  ratings: RatingDTO[];
  totalCount: number;
  page: number;
  totalPages: number;
  summary: VariantRatingSummaryDTO | ProductRatingSummaryDTO;
}
