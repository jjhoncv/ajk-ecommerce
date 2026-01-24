import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import { ProductVariantView } from '@/module/products/components'
import { ProductVariantNotFound } from '@/module/products/components/ProductVariantNotFound'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import {
  generateErrorMetadata,
  generateProductVariantMetadata
} from '@/module/products/helpers/productVariant.helpers'
import ProductService from '@/module/products/services'
import { type Metadata } from 'next'

interface ProductVariantPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params
}: ProductVariantPageProps): Promise<Metadata> {
  try {
    const { slug } = await params

    if (!slug) {
      return generateErrorMetadata('Slug de producto inválido')
    }

    const data = await ProductService.getProductVariantBySlug(slug)
    return generateProductVariantMetadata(data, data?.variantId ?? 0)
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateErrorMetadata('Error al cargar el producto')
  }
}

export default async function ProductVariantPage({
  params
}: ProductVariantPageProps) {
  const { slug } = await params

  // Validar slug
  if (!slug) {
    return <ProductVariantNotFound />
  }

  const data = await ProductService.getProductVariantBySlug(slug)

  if (!data) {
    return <ProductVariantNotFound />
  }

  const allVariants = (data.product.productVariants || []).filter(
    (v) => v !== null
  )
  const variant = allVariants.find((variant) => variant.id === data.variantId)

  if (!variant) {
    return <ProductVariantNotFound />
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="px-0 py-0">
        <ProductVariantView
          data={data}
          allVariants={allVariants}
          variant={variant}
        />
      </LayoutContent>
    </Layout>
  )
}
