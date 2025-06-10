"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
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

  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-2">
        {/* Botón anterior */}
        <Link
          href={createPageURL(Math.max(1, currentPage - 1))}
          className={`px-3 py-1 rounded border ${currentPage === 1
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
              className={`px-3 py-1 rounded border ${currentPage === page
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
          className={`px-3 py-1 rounded border ${currentPage === totalPages
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
  );
};

export default Pagination;
