import { ProductVariantData } from '@/services/product/productVariant'
import { ProductVariants } from '@/types/domain'
import { Metadata } from 'next'

export const generateProductVariantMetadata = (
  data: ProductVariantData | null,
  variantId: number
): Metadata => {
  if (!data || !data.product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe o ha sido eliminado.'
    }
  }

  const { product } = data

  const variant = product.productVariants?.find((pv) => pv?.id === variantId)
  let title = product.name
  if (variant) {
    title = getVariantTitle(product.name, variant)
  }

  return {
    title,
    description: product.description || `${title} - Compra online en TechStore`,
    openGraph: {
      title,
      description:
        product.description || `${title} - Compra online en TechStore`
    }
  }
}

export const generateErrorMetadata = (error: string): Metadata => {
  return {
    title: 'Error',
    description: error
  }
}

export const getVariantTitle = (
  name: string,
  variant?: ProductVariants
): string => {
  const baseTitle = name

  if (!variant) return baseTitle

  // Obtener los atributos de la variante
  const variantAttributes = variant.variantAttributeOptions
    ?.map((variantAttr) => {
      // Verificar que variantAttr no sea null
      if (!variantAttr) return null
      // Obtener el valor del atributo desde attributeOptions
      const attributeOption = variantAttr.attributeOption
      return attributeOption?.value
    })
    .filter(Boolean) // Filtrar valores undefined/null
    .join(' - ')

  // Si hay atributos, agregarlos al título
  if (variantAttributes && variantAttributes.length > 0) {
    return `${baseTitle} - ${variantAttributes}`
  }

  return baseTitle
}
