"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductDTO, ProductSearchFiltersDTO } from "@/interfaces/dtos";

interface SearchResultsProps {
  products: {
    product: ProductDTO;
    type: "variant";
  }[];
  totalPages: number;
  currentPage: number;
  currentFilters: ProductSearchFiltersDTO; // Mantenemos este parámetro para futuras extensiones
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  totalPages,
  currentPage,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Función para generar URL con parámetros de búsqueda
  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generar array de páginas para mostrar en la paginación
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    // Siempre mostrar la primera página
    pageNumbers.push(1);

    // Mostrar puntos suspensivos si la página actual está lejos de la primera
    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    // Mostrar páginas alrededor de la página actual
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      }
    }

    // Mostrar puntos suspensivos si la página actual está lejos de la última
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }

    // Siempre mostrar la última página si hay más de una
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div>
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                {/* Botón anterior */}
                <Link
                  href={createPageURL(Math.max(1, currentPage - 1))}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : undefined}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>

                {/* Números de página */}
                {getPageNumbers().map((page, index) => {
                  if (typeof page === "string") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-1 text-gray-500"
                      >
                        {page}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={page}
                      href={createPageURL(page)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === page
                          ? "bg-primary text-white border-primary"
                          : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </Link>
                  );
                })}

                {/* Botón siguiente */}
                <Link
                  href={createPageURL(Math.min(totalPages, currentPage + 1))}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  aria-disabled={currentPage === totalPages}
                  tabIndex={currentPage === totalPages ? -1 : undefined}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500 mb-4">
            Intenta con otros términos de búsqueda o filtros diferentes.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Ver todos los productos
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
