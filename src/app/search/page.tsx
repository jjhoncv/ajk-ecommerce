import Layout from "@/components/layout/Layout";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import StickyFilters from "@/components/search/StickyFilters";
import { getFilters } from "@/helpers/search.helpers";
import SearchService from "@/services/search";
import { SearchParams } from "@/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Búsqueda de Productos | AJK E-commerce",
  description: "Busca y filtra productos en nuestra tienda online",
};

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Esperar a searchParams antes de usar sus propiedades
  const params = await searchParams;

  const filters = getFilters(params)

  // Obtener resultados de búsqueda directamente del modelo
  const { page, products, totalPages, filters: availableFilters } = await SearchService.getSearchParams(filters)

  return (
    <Layout>
      <div className="max-w-screen-4xl mx-auto px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
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
          <div className="w-full lg:100%">
            <SearchResults
              products={products}
              totalPages={totalPages}
              currentPage={page}
              currentFilters={filters}
              defaultView="grid"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
