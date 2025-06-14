import Layout from '@/components/layout/Layout'
import { ProductVariantNotFound } from '@/components/product/ProductVariantNotFound'
import ProductVariantView from '@/components/product/ProductVariantView'
import { generateErrorMetadata, generateProductVariantMetadata } from '@/helpers/productVariant.helpers'
import ProductService from '@/services/product'
import { Metadata } from 'next'

interface ProductVariantPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params
}: ProductVariantPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const variantId = parseInt(id)

    if (isNaN(variantId)) {
      return generateErrorMetadata('ID de variante inválido')
    }

    const data = await ProductService.getProductVariant(variantId)
    return generateProductVariantMetadata(data, variantId)
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateErrorMetadata('Error al cargar el producto')
  }
}

export default async function ProductVariantPage({
  params
}: ProductVariantPageProps) {
  const { id } = await params
  const variantId = parseInt(id)

  // Validar ID
  if (isNaN(variantId)) {
    return <ProductVariantNotFound />
  }

  const data = await ProductService.getProductVariant(variantId)

  if (!data) {
    return <ProductVariantNotFound />
  }

  const allVariants = (data.product.productVariants || []).filter(v => v !== null)
  const variant = allVariants.find(variant => variant.id === variantId)

  if (!variant) {
    return <ProductVariantNotFound />
  }

  return (
    <Layout>
      <ProductVariantView data={data} allVariants={allVariants} variant={variant} />
    </Layout>
  )
}
