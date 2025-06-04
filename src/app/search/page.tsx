import React from "react";
import { Metadata } from "next";
import ProductService from "@/services/productService";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import SearchSorting from "@/components/search/SearchSorting";
import { ProductSearchFiltersDTO } from "@/dto";
import Layout from "@/components/layout/Layout";
import {
  hydrateSearchFiltersProps,
  hydrateSearchResultsProps,
  hydrateSearchSortingProps,
} from "@/utils/hydrators/search.hydrator";

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
  const filters: ProductSearchFiltersDTO = {
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

  // Obtener resultados de búsqueda
  const searchResults = await ProductService.searchProducts(filters);

  // Obtener categorías y marcas para los filtros
  const categories = await ProductService.getCategories();
  const brands = await ProductService.getBrands();
  const attributes = await ProductService.getAttributes();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {params.q ? `Resultados para "${params.q}"` : "Todos los productos"}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros laterales */}
          <div className="w-full lg:w-1/4">
            <SearchFilters
              {...hydrateSearchFiltersProps(
                categories,
                brands,
                attributes,
                searchResults,
                filters
              )}
            />
          </div>

          {/* Resultados */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-gray-600">
                {searchResults.totalCount} productos encontrados
              </p>

              <div className="flex items-center gap-4">
                <SearchSorting {...hydrateSearchSortingProps(filters)} />
              </div>
            </div>

            <SearchResults
              {...hydrateSearchResultsProps(searchResults, filters)}
              defaultView="list"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
