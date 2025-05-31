// Interfaces para los componentes de búsqueda
import { AttributeDTO, BrandDTO, CategoryDTO } from "@/dto";

// Interfaces para SearchFilters
export interface FilterCategory {
  id: number;
  name: string;
  count: number;
}

export interface FilterBrand {
  id: number;
  name: string;
  count: number;
}

export interface FilterPriceRange {
  min: number;
  max: number;
}

export interface FilterAttributeOption {
  id: number;
  value: string;
  count: number;
}

export interface FilterAttribute {
  id: number;
  name: string;
  options: FilterAttributeOption[];
}

export interface SearchFiltersProps {
  categories: CategoryDTO[];
  brands: BrandDTO[];
  attributes: AttributeDTO[];
  availableFilters: {
    categories: FilterCategory[];
    brands: FilterBrand[];
    priceRange: FilterPriceRange;
    attributes: FilterAttribute[];
  };
  currentFilters: {
    query?: string;
    categoryId?: number;
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    attributes?: {
      [attributeId: number]: number[];
    };
    page?: number;
    limit?: number;
    sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
  };
}

// Interfaces para SearchResults
export interface SearchResultsProps {
  products: {
    product: {
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
      variants: {
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
        images: {
          id: number;
          imageUrl: string;
          isPrimary: boolean;
        }[];
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
      }[];
      mainImage: string | null;
    };
    type?: "variant"; // Hacemos el tipo opcional ya que todos los productos son variantes
  }[];
  totalPages: number;
  currentPage: number;
  currentFilters: {
    query?: string;
    categoryId?: number;
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    attributes?: {
      [attributeId: number]: number[];
    };
    page?: number;
    limit?: number;
    sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
  };
}

// Interfaces para SearchSorting
export interface SearchSortingProps {
  currentSort?: string;
}
