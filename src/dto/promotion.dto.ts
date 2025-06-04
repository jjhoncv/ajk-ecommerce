// DTO para promociones

// Tipo de descuento
export type DiscountType = "percentage" | "fixed_amount";

// Interface para datos de promoción desde la base de datos
export interface PromotionDBRecord {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  discount_type: DiscountType;
  discount_value: string | number;
  min_purchase_amount: string | number | null;
  is_active: number;
}

// Interface para datos de promoción-variante desde la base de datos
export interface PromotionVariantDBRecord extends PromotionDBRecord {
  promotion_id: number;
  variant_id: number;
  promotion_price: string | number | null;
  stock_limit: number | null;
}

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
