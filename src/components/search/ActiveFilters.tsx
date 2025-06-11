"use client";
import { SearchFiltersProps } from "@/interfaces/components/search.interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface ActiveFiltersProps {
  availableFilters: SearchFiltersProps['availableFilters'];
  currentFilters: SearchFiltersProps['currentFilters'];
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  availableFilters,
  currentFilters,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1"); // Reset to first page when filtering
    router.push(`${pathname}?${params.toString()}`);
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = currentFilters.categoryId ||
    currentFilters.brandId ||
    currentFilters.minPrice ||
    currentFilters.maxPrice ||
    (currentFilters.attributes && Object.keys(currentFilters.attributes).length > 0);

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium mb-2 text-gray-700">Filtros aplicados:</h4>
      <div className="flex flex-wrap gap-2">

        {/* Categoría seleccionada */}
        {currentFilters.categoryId && availableFilters?.categories && (
          (() => {
            const selectedCategory = availableFilters.categories.find(cat => cat.id === currentFilters.categoryId);
            return selectedCategory ? (
              <span className="inline-flex items-center px-2 py-1 bg-primary text-white text-xs rounded-full">
                {selectedCategory.name}
                <button
                  onClick={() => updateFilter("category", null)}
                  className="ml-1 hover:bg-primary/80 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ) : null;
          })()
        )}

        {/* Marca seleccionada */}
        {currentFilters.brandId && availableFilters?.brands && (
          (() => {
            const selectedBrand = availableFilters.brands.find(brand => brand.id === currentFilters.brandId);
            return selectedBrand ? (
              <span className="inline-flex items-center px-2 py-1 bg-primary text-white text-xs rounded-full">
                {selectedBrand.name}
                <button
                  onClick={() => updateFilter("brand", null)}
                  className="ml-1 hover:bg-primary/80 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ) : null;
          })()
        )}

        {/* Precio mínimo */}
        {currentFilters.minPrice && (
          <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded-full">
            Min: S/ {currentFilters.minPrice}
            <button
              onClick={() => updateFilter("minPrice", null)}
              className="ml-1 hover:bg-green-600 rounded-full p-0.5"
            >
              ×
            </button>
          </span>
        )}

        {/* Precio máximo */}
        {currentFilters.maxPrice && (
          <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded-full">
            Max: S/ {currentFilters.maxPrice}
            <button
              onClick={() => updateFilter("maxPrice", null)}
              className="ml-1 hover:bg-green-600 rounded-full p-0.5"
            >
              ×
            </button>
          </span>
        )}

        {/* Atributos seleccionados */}
        {currentFilters.attributes && availableFilters?.attributes &&
          Object.entries(currentFilters.attributes).map(([attributeId, optionIds]) => {
            const attribute = availableFilters.attributes.find(attr => attr.id === parseInt(attributeId));
            if (!attribute) return null;

            return optionIds.map(optionId => {
              const option = attribute.options.find(opt => opt.id === optionId);
              if (!option) return null;

              return (
                <span key={`${attributeId}-${optionId}`} className="inline-flex items-center px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  {option.value}
                  <button
                    onClick={() => {
                      const currentValues = currentFilters.attributes?.[parseInt(attributeId)] || [];
                      const newValues = currentValues.filter(id => id !== optionId);

                      const params = new URLSearchParams(searchParams.toString());
                      if (newValues.length > 0) {
                        params.set(`attr_${attributeId}`, newValues.join(","));
                      } else {
                        params.delete(`attr_${attributeId}`);
                      }
                      params.set("page", "1");
                      router.push(`${pathname}?${params.toString()}`);
                    }}
                    className="ml-1 hover:bg-blue-600 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              );
            });
          })
        }
      </div>
    </div>
  );
};

export default ActiveFilters;
