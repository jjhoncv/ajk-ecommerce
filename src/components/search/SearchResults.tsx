"use client";
import Pagination from "@/components/search/Pagination";
import { SearchNotFound } from "@/components/search/SearchNotFound";
import SearchSorting from "@/components/search/SearchSorting";
import ProductCard from "@/components/ui/ProductCard";
import { SearchResultsProps } from "@/interfaces/components/search.interface";
import React from "react";

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
        <div className="flex items-center gap-4">
          <SearchSorting currentSort={filters.sort} />
        </div>
      </div>

      {/* Productos en modo grid o list */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
            : "flex flex-col space-y-4"
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product.variantId || product.id}
            product={product}
            layout={viewMode === "list" ? "list" : "grid"}
          />
        ))}
      </div>

      {/* Paginación */}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

export default SearchResults;
