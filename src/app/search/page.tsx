import Layout from "@/components/layout/Layout";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import StickyFilters from "@/components/search/StickyFilters";
import searchModel from "@/models/Search.model";
import { ProductSearchFilters } from "@/types/search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Búsqueda de Productos | AJK E-commerce",
  description: "Busca y filtra productos en nuestra tienda online",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    [key: string]: string | string[] | undefined;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Esperar a searchParams antes de usar sus propiedades
  const params = await searchParams;

  // Convertir parámetros de búsqueda a filtros
  const filters: ProductSearchFilters = {
    query: params.q,
    categoryId: params.category ? parseInt(params.category) : undefined,
    brandId: params.brand ? parseInt(params.brand) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    page: params.page ? parseInt(params.page) : 1,
    limit: 12,
    sort:
      (params.sort as
        | "price_asc"
        | "price_desc"
        | "name_asc"
        | "name_desc"
        | "newest") || "newest",
  };

  // Procesar atributos desde searchParams
  // Formato esperado: attr_1=2,3&attr_2=5
  const attributeFilters: { [attributeId: number]: number[] } = {};

  Object.keys(params).forEach((key) => {
    if (key.startsWith("attr_")) {
      const attributeId = parseInt(key.replace("attr_", ""));
      const optionIds = (params[key] as string)
        .split(",")
        .map((id) => parseInt(id));
      attributeFilters[attributeId] = optionIds;
    }
  });

  if (Object.keys(attributeFilters).length > 0) {
    filters.attributes = attributeFilters;
  }

  // Obtener resultados de búsqueda directamente del modelo
  const searchResults = await searchModel.searchProducts(filters);

  return (
    <Layout>
      <div className="max-w-[1920px] mx-auto px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros laterales */}
          <div className="lg:min-w-56 lg:max-w-56">
            <StickyFilters>
              <SearchFilters
                availableFilters={searchResults.filters}
                currentFilters={filters}
              />
            </StickyFilters>
          </div>

          {/* Resultados */}
          <div className="w-full lg:100%">
            <SearchResults
              products={searchResults.products}
              totalPages={searchResults.totalPages}
              currentPage={searchResults.page}
              currentFilters={filters}
              defaultView="grid"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
