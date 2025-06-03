import {
  AttributeDTO,
  BrandDTO,
  CategoryDTO,
  ProductSearchFiltersDTO,
  ProductSearchResultDTO,
} from "@/dto";
import {
  SearchFiltersProps,
  SearchResultsProps,
  SearchSortingProps,
} from "@/interfaces/components/search.interface";

/**
 * Hidratador para convertir DTOs a props para el componente SearchFilters
 */
export function hydrateSearchFiltersProps(
  categories: CategoryDTO[],
  brands: BrandDTO[],
  attributes: AttributeDTO[],
  searchResult: ProductSearchResultDTO,
  filters: ProductSearchFiltersDTO
): SearchFiltersProps {
  return {
    categories: categories.map((category) => ({
      ...category,
      id: Number(category.id),
      parentId: category.parentId !== null ? Number(category.parentId) : null,
      children: category.children
        ? category.children.map((child) => ({
            ...child,
            id: Number(child.id),
            parentId: child.parentId !== null ? Number(child.parentId) : null,
          }))
        : undefined,
    })),
    brands: brands.map((brand) => ({
      ...brand,
      id: Number(brand.id),
    })),
    attributes: attributes.map((attribute) => ({
      ...attribute,
      id: Number(attribute.id),
      options: attribute.options.map((option) => ({
        ...option,
        id: Number(option.id),
        attributeId: Number(option.attributeId),
      })),
    })),
    availableFilters: {
      categories: searchResult.filters.categories.map((category) => ({
        id: Number(category.id),
        name: category.name,
        count: Number(category.count),
      })),
      brands: searchResult.filters.brands.map((brand) => ({
        id: Number(brand.id),
        name: brand.name,
        count: Number(brand.count),
      })),
      priceRange: {
        min: Number(searchResult.filters.priceRange.min),
        max: Number(searchResult.filters.priceRange.max),
      },
      attributes: searchResult.filters.attributes.map((attribute) => ({
        id: Number(attribute.id),
        name: attribute.name,
        options: attribute.options.map((option) => ({
          id: Number(option.id),
          value: option.value,
          count: Number(option.count),
        })),
      })),
    },
    currentFilters: {
      ...filters,
      categoryId:
        filters.categoryId !== undefined
          ? Number(filters.categoryId)
          : undefined,
      brandId:
        filters.brandId !== undefined ? Number(filters.brandId) : undefined,
      minPrice:
        filters.minPrice !== undefined ? Number(filters.minPrice) : undefined,
      maxPrice:
        filters.maxPrice !== undefined ? Number(filters.maxPrice) : undefined,
      page: filters.page !== undefined ? Number(filters.page) : undefined,
      limit: filters.limit !== undefined ? Number(filters.limit) : undefined,
      attributes: filters.attributes
        ? Object.entries(filters.attributes).reduce((acc, [key, value]) => {
            acc[Number(key)] = Array.isArray(value) ? value.map(Number) : [];
            return acc;
          }, {} as Record<number, number[]>)
        : undefined,
    },
  };
}

/**
 * Hidratador para convertir DTOs a props para el componente SearchResults
 */
export function hydrateSearchResultsProps(
  searchResult: ProductSearchResultDTO,
  filters: ProductSearchFiltersDTO
): SearchResultsProps {
  return {
    products: searchResult.products.map((product) => ({
      product: {
        id: Number(product.id),
        name: product.name,
        description: product.description,
        brandId: Number(product.brandId),
        brandName: product.brandName,
        basePrice: Number(product.basePrice),
        categories: product.categories.map((category) => ({
          id: Number(category.id),
          name: category.name,
        })),
        variants: product.variants.map((variant) => ({
          id: Number(variant.id),
          productId: Number(variant.productId),
          sku: variant.sku,
          price: Number(variant.price),
          stock: Number(variant.stock),
          attributes: variant.attributes.map((attr) => ({
            id: Number(attr.id),
            name: attr.name,
            value: attr.value,
            optionId: Number(attr.optionId),
            display_type: attr.display_type,
            additional_cost: attr.additional_cost,
          })),
          images: variant.images.map((img) => ({
            id: Number(img.id),
            imageUrl:
              img.imageUrlNormal || img.imageUrlThumb || "/no-image.webp",
            isPrimary:
              typeof img.isPrimary === "string"
                ? img.isPrimary === "1" || img.isPrimary === "true"
                : Boolean(img.isPrimary),
          })),
          // Incluir información de promoción si existe
          promotion: variant.promotion
            ? {
                id: Number(variant.promotion.id),
                name: variant.promotion.name,
                discountType: variant.promotion.discountType,
                discountValue: Number(variant.promotion.discountValue),
                promotionPrice:
                  variant.promotion.promotionPrice !== null
                    ? Number(variant.promotion.promotionPrice)
                    : null,
                startDate: new Date(variant.promotion.startDate),
                endDate: new Date(variant.promotion.endDate),
                stockLimit:
                  variant.promotion.stockLimit !== null
                    ? Number(variant.promotion.stockLimit)
                    : null,
              }
            : undefined,
          // Incluir información de valoraciones si existe
          ratings: variant.ratings
            ? {
                totalRatings: Number(variant.ratings.totalRatings),
                averageRating: Number(variant.ratings.averageRating),
                fiveStar: Number(variant.ratings.fiveStar),
                fourStar: Number(variant.ratings.fourStar),
                threeStar: Number(variant.ratings.threeStar),
                twoStar: Number(variant.ratings.twoStar),
                oneStar: Number(variant.ratings.oneStar),
                verifiedPurchases: Number(variant.ratings.verifiedPurchases),
              }
            : undefined,
        })),
        mainImage: product.mainImage,
      },
    })),
    totalPages: Number(searchResult.totalPages),
    currentPage: Number(searchResult.page),
    currentFilters: {
      ...filters,
      categoryId:
        filters.categoryId !== undefined
          ? Number(filters.categoryId)
          : undefined,
      brandId:
        filters.brandId !== undefined ? Number(filters.brandId) : undefined,
      minPrice:
        filters.minPrice !== undefined ? Number(filters.minPrice) : undefined,
      maxPrice:
        filters.maxPrice !== undefined ? Number(filters.maxPrice) : undefined,
      page: filters.page !== undefined ? Number(filters.page) : undefined,
      limit: filters.limit !== undefined ? Number(filters.limit) : undefined,
      attributes: filters.attributes
        ? Object.entries(filters.attributes).reduce((acc, [key, value]) => {
            acc[Number(key)] = Array.isArray(value) ? value.map(Number) : [];
            return acc;
          }, {} as Record<number, number[]>)
        : undefined,
    },
  };
}

/**
 * Hidratador para convertir DTOs a props para el componente SearchSorting
 */
export function hydrateSearchSortingProps(
  filters: ProductSearchFiltersDTO
): SearchSortingProps {
  return {
    currentSort: filters.sort,
  };
}
