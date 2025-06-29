import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import SearchFilters from '@/components/search/SearchFilters'
import SearchResults from '@/components/search/SearchResults'
import StickyFilters from '@/components/search/StickyFilters'
import Navigation from '@/components/ui/Navigation/Navigation'
import { getFilters } from '@/helpers/search.helpers'
import SearchService from '@/services/search'
import { type SearchParams } from '@/shared'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Búsqueda de Productos | AJK E-commerce',
  description: 'Busca y filtra productos en nuestra tienda online'
}

interface SearchPageProps {
  searchParams: SearchParams
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
