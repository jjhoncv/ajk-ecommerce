import Layout from '@/components/layout/Layout'
import ProductVariantView from '@/components/product/ProductVariantView'
import { generateErrorMetadata, generateProductVariantMetadata } from '@/helpers/productVariant.helpers'
import ProductService from '@/services/product'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
    return generateProductVariantMetadata(data)
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
    notFound()
  }

  let data
  try {
    // Obtener datos del producto y variante
    data = await ProductService.getProductVariant(variantId)

    if (!data) {
      notFound()
    }
  } catch (error) {
    console.error('Error loading product variant:', error)
    throw error // Esto activará la página de error
  }

  return (
    <Layout>
      <ProductVariantView data={data} />
    </Layout>
  )
}
