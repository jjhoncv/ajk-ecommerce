import productModel from '@/backend/product'
import productVariantModel, {
  type ProductVariantWithAttributeOptions
} from '@/backend/product-variant'
import { type Products as Product } from '@/types/domain'

export interface ProductVariantData {
  product: Product
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
      // variant,
      product
    }
  } catch (error) {
    throw new Error(
      `Error al obtener getProductVariant ${error instanceof Error ? error.message : 'Unknown error'}`
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
