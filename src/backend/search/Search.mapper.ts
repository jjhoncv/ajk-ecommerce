import { VariantSearchResultRaw } from '@/types/database'
import { ProductSearchItem, VariantSearchResult } from '@/types/search'

// others
import { ProductVariantComplete } from '@/backend/product-variant'

export const VariantSearchResultMapper = (
  data: VariantSearchResultRaw
): VariantSearchResult => {
  return {
    variantId: data.variant_id,
    productId: data.product_id,
    sku: data.sku,
    price: data.price,
    stock: data.stock,
    productName: data.product_name,
    productDescription: data.product_description,
    brandId: data.brand_id,
    basePrice: data.base_price
  }
}

export const VariantSearchResultsMapper = (
  data: VariantSearchResultRaw[]
): VariantSearchResult[] => {
  return data.map(VariantSearchResultMapper)
}

export const ProductSearchItemMapper = (
  variantResult: VariantSearchResult,
  variant: ProductVariantComplete,
  brandName: string,
  categories: Array<{ id: number; name: string }>,
  mainImage?: string
): ProductSearchItem => {
  return {
    id: variantResult.productId,
    name: variantResult.productName,
    description: variantResult.productDescription,
    brandId: variantResult.brandId,
    brandName,
    basePrice: variantResult.basePrice,
    minVariantPrice: variantResult.price,
    categories,
    variants: [variant],
    mainImage,
    variantId: variantResult.variantId,
    variantSku: variantResult.sku,
    variantPrice: variantResult.price,
    variantStock: variantResult.stock
  }
}
