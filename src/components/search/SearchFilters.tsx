"use client";
import { SearchFiltersProps } from "@/interfaces/components/search.interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  brands,
  attributes,
  availableFilters,
  currentFilters,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // SearchFilters usando availableFilters con contadores generados dinámicamente

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

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    // Mantener solo la query de búsqueda si existe
    if (currentFilters.query) {
      params.set("q", currentFilters.query);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary hover:text-primary/80"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Filtros activos */}
      {(currentFilters.categoryId ||
        currentFilters.brandId ||
        currentFilters.minPrice ||
        currentFilters.maxPrice ||
        (currentFilters.attributes && Object.keys(currentFilters.attributes).length > 0)) && (
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
        )}

      {/* Categorías */}
      {availableFilters?.categories && availableFilters.categories.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Categorías</h4>
          <div className="space-y-2">
            {availableFilters.categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={currentFilters.categoryId === category.id}
                  onChange={(e) =>
                    updateFilter("category", e.target.checked ? e.target.value : null)
                  }
                  className="mr-2"
                />
                <span className="text-sm">
                  {category.name} ({category.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Marcas */}
      {availableFilters?.brands && availableFilters.brands.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Marcas</h4>
          <div className="space-y-2">
            {availableFilters.brands.map((brand) => (
              <label key={brand.id} className="flex items-center">
                <input
                  type="radio"
                  name="brand"
                  value={brand.id}
                  checked={currentFilters.brandId === brand.id}
                  onChange={(e) =>
                    updateFilter("brand", e.target.checked ? e.target.value : null)
                  }
                  className="mr-2"
                />
                <span className="text-sm">
                  {brand.name} ({brand.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rango de precios */}
      {availableFilters?.priceRange && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Precio</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Precio mínimo</label>
              <input
                type="number"
                min={availableFilters.priceRange.min}
                max={availableFilters.priceRange.max}
                value={currentFilters.minPrice || ""}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                placeholder={`Desde S/ ${availableFilters.priceRange.min}`}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Precio máximo</label>
              <input
                type="number"
                min={availableFilters.priceRange.min}
                max={availableFilters.priceRange.max}
                value={currentFilters.maxPrice || ""}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                placeholder={`Hasta S/ ${availableFilters.priceRange.max}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Atributos */}
      {availableFilters?.attributes && availableFilters.attributes.length > 0 && (
        <div className="mb-6">
          {availableFilters.attributes.map((attribute) => (
            <div key={attribute.id} className="mb-4">
              <h4 className="font-medium mb-3">{attribute.name}</h4>
              <div className="space-y-1">
                {attribute.options.map((option) => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={
                        currentFilters.attributes?.[attribute.id]?.includes(option.id) || false
                      }
                      onChange={(e) => {
                        const currentValues = currentFilters.attributes?.[attribute.id] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option.id]
                          : currentValues.filter((id) => id !== option.id);

                        const params = new URLSearchParams(searchParams.toString());
                        if (newValues.length > 0) {
                          params.set(`attr_${attribute.id}`, newValues.join(","));
                        } else {
                          params.delete(`attr_${attribute.id}`);
                        }
                        params.set("page", "1");
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {option.value} ({option.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
