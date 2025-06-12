"use client";
import { ProductSearchFilters, ProductSearchItem } from "@/backend/search";
import Pagination from "@/components/search/Pagination";
import { SearchNotFound } from "@/components/search/SearchNotFound";
import SearchSorting from "@/components/search/SearchSorting";
import ProductCard from "@/components/ui/ProductCard";
import React from "react";

interface SearchResultsProps {
  products: ProductSearchItem[]
  totalPages: number
  currentPage: number
  currentFilters: ProductSearchFilters
  defaultView?: 'grid' | 'list'
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  totalPages,
  currentPage,
  defaultView: viewMode = "grid",
  currentFilters: filters
}) => {

  if (products.length === 0) {
    return <SearchNotFound />
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center w-full justify-end">
          <SearchSorting currentSort={filters.sort} variant="toggle" />
        </div>
      </div>

      {/* Productos en modo grid o list */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5"
            : "flex flex-col space-y-4"
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product.variantId || product.id}
            product={product}
          />
        ))}
      </div>

      {/* Paginación */}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

export default SearchResults;
