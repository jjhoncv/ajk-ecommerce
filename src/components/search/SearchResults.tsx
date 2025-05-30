"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
// Nota: La importación no cambia, pero ahora usa el componente refactorizado
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { ProductDTO, ProductSearchFiltersDTO } from "@/dto";

interface SearchResultsProps {
  products: {
    product: ProductDTO;
    type?: "variant"; // Hacemos el tipo opcional ya que todos los productos son variantes
  }[];
  totalPages: number;
  currentPage: number;
  currentFilters: ProductSearchFiltersDTO; // Mantenemos este parámetro para futuras extensiones
  defaultView?: "grid" | "list"; // Modo de visualización por defecto
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  totalPages,
  currentPage,
  defaultView = "grid",
}) => {
  // Estado para controlar el modo de visualización (grid o list)
  const [viewMode, setViewMode] = React.useState<"grid" | "list">(defaultView);
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
          {/* Selector de vista grid/list */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 flex items-center ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-label="Ver como cuadrícula"
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                <span className="text-sm">Cuadrícula</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 flex items-center ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-label="Ver como lista"
              >
                <List className="h-4 w-4 mr-1" />
                <span className="text-sm">Lista</span>
              </button>
            </div>
          </div>

          {/* Productos en modo grid o list */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col space-y-4"
            }
          >
            {products.map((product, index) => (
              <ProductCard
                key={`${product.product.id}-${index}`}
                product={product}
                layout={viewMode === "list" ? "list" : "grid"}
              />
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
