import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import PromotionBanner from '@/components/promotion/PromotionBanner'
import { PromotionPageNotFound } from '@/components/promotion/PromotionPageNotFound'
import Navigation from '@/components/ui/Navigation/Navigation'
import ProductCard from '@/components/ui/ProductCard'
import { getFilters } from '@/helpers/search.helpers'
import PromotionService from '@/services/promotion'
import SearchService from '@/services/search'

// services
import { type Metadata } from 'next'
import { type JSX } from 'react'

export const metadata: Metadata = {
  title: 'TechStore - Tu tienda de tecnología y zapatillas',
  description:
    'Encuentra los mejores productos de tecnología y zapatillas en TechStore'
}

interface PromotionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PromotionPage({
  params
}: PromotionPageProps): Promise<JSX.Element> {
  const { id, ...nextParams } = await params
  const promotionId = parseInt(id)

  // Validar ID
  if (isNaN(promotionId)) {
    return <PromotionPageNotFound />
  }

  const promotion = await PromotionService.getPromotion(promotionId)

  if (promotion === null) {
    return <PromotionPageNotFound />
  }

  const filters = getFilters({
    promotions: promotionId.toString(),
    ...nextParams
  })

  // Obtener resultados de búsqueda directamente del modelo
  const { products } = await SearchService.getSearchParams(filters)

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="px-0 py-0">
        {promotion != null && <PromotionBanner promotion={promotion} />}

        <div className="mx-auto flex max-w-screen-4xl px-12">
          <div
            className={
              'grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'
            }
          >
            {products.map((product) => (
              <ProductCard
                key={product.variantId || product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </LayoutContent>
    </Layout>
  )
}
