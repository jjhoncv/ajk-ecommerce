import { ProductVariantData } from '@/services/product/productVariant'
import { Metadata } from 'next'

export const generateProductVariantMetadata = (
  data: ProductVariantData | null
): Metadata => {
  if (!data || !data.variant || !data.product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe o ha sido eliminado.'
    }
  }

  const { variant, product } = data

  // Construir el título con los atributos de la variante
  const attributeValues = variant.variantAttributeOptions
    ?.map((vao: any) => vao.attributeOptions?.[0]?.value)
    .filter(Boolean)
    .join(' - ')

  const title = attributeValues
    ? `${product.name} - ${attributeValues}`
    : product.name

  // Obtener la primera imagen disponible
  const firstImage =
    variant.attributeImages?.[0]?.imageUrlNormal ||
    variant.variantImages?.[0]?.imageUrlNormal

  return {
    title,
    description: product.description || `${title} - Compra online en TechStore`,
    openGraph: {
      title,
      description:
        product.description || `${title} - Compra online en TechStore`,
      images: firstImage ? [firstImage] : []
    }
  }
}

export const generateErrorMetadata = (error: string): Metadata => {
  return {
    title: 'Error',
    description: error
  }
}
