import { ProductVariants } from '@/types/domain'
import { ProductSearchItem, VariantSearchResult } from '@/types/search'

export const mapVariantSearchResult = (
  data: VariantSearchResult
): VariantSearchResult => {
  return {
    variantId: data.variantId,
    productId: data.productId,
    sku: data.sku,
    price: data.price,
    stock: data.stock,
    productName: data.productName,
    productDescription: data.productDescription,
    brandId: data.brandId,
    basePrice: data.basePrice
  }
}

export const mapVariantSearchResults = (
  data: VariantSearchResult[]
): VariantSearchResult[] => {
  return data.map(mapVariantSearchResult)
}

export const mapToProductSearchItem = (
  variantResult: VariantSearchResult,
  variant: ProductVariants,
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
