import {
  productModel,
  productVariantModel,
  type ProductVariantWithAttributeOptions
} from '@/module/products/core'
import { type Products as Product } from '@/types/domain'

export interface ProductVariantData {
  product: Product
  variantId: number
}

export const getProductVariant = async (
  variantId: number
): Promise<ProductVariantData | null> => {
  try {
    // Obtener la variante específica
    const variant = await productVariantModel.getProductVariantById(variantId)

    if (!variant) {
      return null
    }

    // Obtener el producto completo
    const product = await productModel.getProductById(variant.productId)

    if (!product) {
      return null
    }

    return {
      product,
      variantId
    }
  } catch (error) {
    throw new Error(
      `Error al obtener getProductVariant ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export const getProductVariantBySlug = async (
  slug: string
): Promise<ProductVariantData | null> => {
  try {
    // Obtener la variante por slug
    const variant = await productVariantModel.getProductVariantBySlug(slug)

    if (!variant) {
      return null
    }

    // Obtener el producto completo
    const product = await productModel.getProductById(variant.productId)

    if (!product) {
      return null
    }

    return {
      product,
      variantId: variant.id
    }
  } catch (error) {
    throw new Error(
      `Error al obtener getProductVariantBySlug ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export const getProductVariantsByProductId = async (
  productId: number
): Promise<ProductVariantWithAttributeOptions[] | null> => {
  try {
    // Obtener todas las variantes del producto con atributos
    const variants =
      await productVariantModel.getProductVariantsByProductIdWithAttributeOptions(
        productId
      )

    if (!variants) {
      return null
    }

    return variants
  } catch (error) {
    throw new Error(
      `Error al obtener getProductVariantsByProductId ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
