import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import { SearchFilters, SearchResults, StickyFilters } from '@/module/search/components'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import { getFilters } from '@/module/search/helpers/search.helpers'
import SearchService from '@/module/search/services'
import { type SearchParams } from '@/module/shared/types/shared'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Búsqueda de Productos | AJK E-commerce',
  description: 'Busca y filtra productos en nuestra tienda online'
}

interface SearchPageProps {
  searchParams: Promise<SearchParams>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const filters = getFilters(params)

  const {
    page,
    products,
    totalPages,
    filters: availableFilters
  } = await SearchService.getSearchParams(filters)

  // Si no hay productos y no hay filtros disponibles, no mostrar nada
  const hasNoData =
    products.length === 0 &&
    (!availableFilters.categories || availableFilters.categories.length === 0) &&
    (!availableFilters.attributes || availableFilters.attributes.length === 0)

  if (hasNoData) {
    return (
      <Layout>
        <Header navigationType="mini">
          <Navigation type="mini" />
        </Header>
        <LayoutContent className="px-0 py-0" />
      </Layout>
    )
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="px-0 py-0">
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
