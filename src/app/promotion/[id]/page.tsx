import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import { PromotionPageNotFound } from '@/components/promotion/PromotionPageNotFound'
import SearchFilters from '@/components/search/SearchFilters'
import SearchResults from '@/components/search/SearchResults'
import StickyFilters from '@/components/search/StickyFilters'
import Navigation from '@/components/ui/Navigation/Navigation'
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
  const {
    page,
    products,
    totalPages,
    filters: availableFilters
  } = await SearchService.getSearchParams(filters)

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="py-0">
        <h1>name: {promotion.name}</h1>
        <p>discountType: {promotion.discountType}</p>
        <p>discountValue: {promotion.discountValue}</p>
        <p>type: {promotion.type}</p>
        <p>description: {promotion.description}</p>
        <p>startDate: {promotion.startDate}</p>
        <p>endDate: {promotion.endDate}</p>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filtros laterales */}
          <div className="lg:min-w-56 lg:max-w-56">
            <StickyFilters>
              <SearchFilters
                availableFilters={availableFilters}
                currentFilters={filters}
              />
            </StickyFilters>
          </div>

          {/* Resultados */}
          <div className="lg:100% w-full">
            <SearchResults
              products={products}
              totalPages={totalPages}
              currentPage={page}
              currentFilters={filters}
              defaultView="grid"
            />
          </div>
        </div>
      </LayoutContent>
    </Layout>
  )
}
