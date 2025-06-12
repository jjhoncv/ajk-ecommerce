import productModel from '@/backend/product'
import productVariantModel, {
  ProductVariantComplete
} from '@/backend/product-variant'
import { Products as Product } from '@/types/domain'

export interface ProductVariantData {
  variant: ProductVariantComplete
  product: Product
}

export const getProductVariant = async (
  variantId: number
): Promise<ProductVariantData | null> => {
  try {
    // Obtener la variante específica
    const variant =
      await productVariantModel.getProductVariantComplete(variantId)

    if (!variant) {
      return null
    }

    // Obtener el producto completo
    const product = await productModel.getProductById(variant.productId)

    if (!product) {
      return null
    }

    return {
      variant,
      product
    }
  } catch (error) {
    throw new Error(
      `Error al obtener getProductVariant ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
