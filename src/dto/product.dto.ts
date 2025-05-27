// DTO para productos

// DTO para productos
export interface ProductDTO {
  id: number;
  name: string;
  description: string | null;
  brandId: number;
  brandName: string;
  basePrice: number;
  categories: {
    id: number;
    name: string;
  }[];
  variants: ProductVariantDTO[];
  mainImage: string | null;
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
  }[];
  images: {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
  }[];
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
      options: {
        id: number;
        value: string;
        count: number;
      }[];
    }[];
  };
}
