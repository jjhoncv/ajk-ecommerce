import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import { ProductVariantNotFound } from '@/components/product/ProductVariantNotFound'
import ProductVariantView from '@/components/product/ProductVariantView'
import Navigation from '@/components/ui/Navigation'
import { generateErrorMetadata, generateProductVariantMetadata } from '@/helpers/productVariant.helpers'
import { getHeader } from '@/services/header'
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

  const categories = await getHeader();

  return (
    <Layout>
      <Header navigationType="mini" >
        <Navigation type="mini" categories={categories || []} />
      </Header>
      <LayoutContent>
        <ProductVariantView data={data} allVariants={allVariants} variant={variant} />
      </LayoutContent>
    </Layout>
  )
}
