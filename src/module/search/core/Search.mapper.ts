import { type ProductVariantComplete } from '@/module/products/core'
import { type VariantSearchResultRaw } from './Search.repository'
import {
  type ProductSearchItem,
  type VariantSearchResult
} from './Search.interfaces'

export const VariantSearchResultMapper = (
  data: VariantSearchResultRaw
): VariantSearchResult => {
  return {
    variantId: data.variant_id,
    productId: data.product_id,
    sku: data.sku,
    price: Number(data.price),
    stock: Number(data.stock),
    productName: data.product_name,
    productDescription: data.product_description,
    brandId: data.brand_id,
    basePrice: Number(data.base_price)
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
  categories: Array<{ id: number, name: string }>,
  mainImage?: string
): ProductSearchItem => {
  return {
    id: variantResult.productId,
    name: variantResult.productName,
    description: variantResult.productDescription,
    brandId: variantResult.brandId,
    brandName,
    basePrice: Number(variantResult.basePrice),
    minVariantPrice: variantResult.price,
    categories,
    variants: [variant],
    mainImage,
    variantId: variantResult.variantId,
    variantSku: variantResult.sku,
    variantPrice: Number(variantResult.price),
    variantStock: Number(variantResult.stock)
  }
}
