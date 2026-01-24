import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import { PromotionBanner, PromotionPageNotFound } from '@/module/promotions/components'
import { SearchFilters, SearchResults, StickyFilters } from '@/module/search/components'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import { getFilters } from '@/module/search/helpers/search.helpers'
import PromotionService from '@/module/promotions/services'
import SearchService from '@/module/search/services'
import { type SearchParams } from '@/module/shared/types/shared'

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
    slug: string
  }>
  searchParams: Promise<SearchParams>
}

export default async function PromotionPage({
  params,
  searchParams
}: PromotionPageProps): Promise<JSX.Element> {
  const { slug } = await params
  const searchParamsResolved = await searchParams

  // Buscar promoción por slug
  const promotion = await PromotionService.getPromotionBySlug(slug)

  if (promotion === null) {
    return <PromotionPageNotFound />
  }

  // Usar el ID de la promoción para los filtros de búsqueda
  const filters = getFilters({
    ...searchParamsResolved,
    promotions: promotion.id.toString()
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
      <LayoutContent className="px-0 py-0">
        {promotion != null && <PromotionBanner promotion={promotion} />}

        <div className="mx-auto flex max-w-screen-4xl flex-col gap-8 px-12 lg:flex-row">
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
