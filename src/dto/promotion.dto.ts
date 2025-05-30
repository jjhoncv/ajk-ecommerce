// DTO para promociones

// Tipo de descuento
export type DiscountType = "percentage" | "fixed_amount";

// DTO para promociones
export interface PromotionDTO {
  id: number;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseAmount: number | null;
  isActive: boolean;
}

// DTO para variantes en promoción
export interface PromotionVariantDTO {
  promotionId: number;
  variantId: number;
  promotionPrice: number | null;
  stockLimit: number | null;
  promotion?: PromotionDTO;
}

// DTO para resultados de búsqueda de promociones
export interface PromotionSearchResultDTO {
  promotions: PromotionDTO[];
  totalCount: number;
  page: number;
  totalPages: number;
}
