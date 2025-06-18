import categoryModel from "@/backend/category";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import { LayoutContent } from "@/components/layout/LayoutContent";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import StickyFilters from "@/components/search/StickyFilters";
import Navigation from "@/components/ui/Navigation";
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


  const categories = await categoryModel.getCategories()

  return (
    <Layout>
      <Header navigationType="mini" >
        <Navigation type="mini" categories={categories || []} />
      </Header>
      <LayoutContent>
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
      </LayoutContent>

    </Layout>
  );
}
