// DTO para productos
import { VariantImageDTO, AttributeOptionImageDTO } from "./image.dto";

export interface ProductDTO {
  id: number;
  name: string;
  description: string | null;
  brandId: number;
  brandName: string;
  basePrice: number;
  minVariantPrice?: number; // Precio mínimo de las variantes
  categories: {
    id: number;
    name: string;
  }[];
  variants: ProductVariantDTO[];
  mainImage: string | null;
  // Campos adicionales para variantes individuales en resultados de búsqueda
  variantId?: number;
  variantSku?: string;
  variantPrice?: number;
  variantStock?: number;
}

// DTO para variantes de productos
export interface ProductVariantDTO {
  id: number;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    id: number;
    name: string;
    value: string;
    optionId: number;
    display_type?: string;
    additional_cost?: number;
  }[];
  images: VariantImageDTO[];
  // Imágenes de atributos (para selectores de color, etc.)
  attributeImages: AttributeOptionImageDTO[];
  // Información de promoción
  promotion?: {
    id: number;
    name: string;
    discountType: "percentage" | "fixed_amount";
    discountValue: number;
    promotionPrice: number | null;
    startDate: Date;
    endDate: Date;
    stockLimit: number | null;
  };
  // Información de valoraciones
  ratings?: {
    totalRatings: number;
    averageRating: number;
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
    verifiedPurchases: number;
  };
}

// DTO para filtros de búsqueda
export interface ProductSearchFiltersDTO {
  query?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  attributes?: {
    [attributeId: number]: number[]; // attributeId -> array de optionIds
  };
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
}

// DTO para resultados de búsqueda
export interface ProductSearchResultDTO {
  products: ProductDTO[];
  totalCount: number;
  page: number;
  totalPages: number;
  filters: {
    categories: {
      id: number;
      name: string;
      count: number;
    }[];
    brands: {
      id: number;
      name: string;
      count: number;
    }[];
    priceRange: {
      min: number;
      max: number;
    };
    attributes: {
      id: number;
      name: string;
      display_type?: string;
      options: {
        id: number;
        value: string;
        additional_cost?: number;
        count: number;
      }[];
    }[];
  };
}
