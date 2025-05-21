"use client";
import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface SearchSortingProps {
  currentSort?: string;
}

type SortOption = {
  value: string;
  label: string;
};

const sortOptions: SortOption[] = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name_asc", label: "Nombre: A-Z" },
  { value: "name_desc", label: "Nombre: Z-A" },
];

const SearchSorting: React.FC<SearchSortingProps> = ({
  currentSort = "newest",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Encontrar la opción de ordenamiento actual
  const currentSortOption =
    sortOptions.find((option) => option.value === currentSort) ||
    sortOptions[0];

  // Función para aplicar ordenamiento
  const applySort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Actualizar parámetro de ordenamiento
    params.set("sort", sortValue);

    // Resetear página a 1 cuando se cambia el ordenamiento
    params.set("page", "1");

    // Navegar a la URL con el nuevo ordenamiento
    router.push(`${pathname}?${params.toString()}`);

    // Cerrar el menú desplegable
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Ordenar por: {currentSortOption.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar el menú al hacer clic fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menú desplegable */}
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    option.value === currentSort
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => applySort(option.value)}
                  role="menuitem"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchSorting;
