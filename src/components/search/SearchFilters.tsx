"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  CategoryDTO,
  BrandDTO,
  AttributeDTO,
  ProductSearchFiltersDTO,
} from "@/interfaces/dtos";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface SearchFiltersProps {
  categories: CategoryDTO[];
  brands: BrandDTO[];
  attributes: AttributeDTO[];
  availableFilters: {
    categories: {
      id: number;
      name: string;
      count: number;
    }[];
    brands: {
      id: number;
      name: string;
      count: number;
    }[];
    priceRange: {
      min: number;
      max: number;
    };
    attributes: {
      id: number;
      name: string;
      options: {
        id: number;
        value: string;
        count: number;
      }[];
    }[];
  };
  currentFilters: ProductSearchFiltersDTO;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  brands,
  attributes,
  availableFilters,
  currentFilters,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Estado para secciones expandidas/colapsadas
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    attributes: {} as Record<number, boolean>,
  });

  // Estado para rango de precios
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || availableFilters.priceRange.min,
    max: currentFilters.maxPrice || availableFilters.priceRange.max,
  });

  // Función para alternar sección expandida/colapsada
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  // Función para alternar sección de atributo
  const toggleAttributeSection = (attributeId: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeId]: !prev.attributes[attributeId],
      },
    }));
  };

  // Función para aplicar filtros
  const applyFilters = (newFilters: Partial<ProductSearchFiltersDTO>) => {
    // Construir parámetros de búsqueda
    const params = new URLSearchParams();

    // Mantener query actual
    if (currentFilters.query) {
      params.set("q", currentFilters.query);
    }

    // Aplicar nuevos filtros
    const updatedFilters = { ...currentFilters, ...newFilters, page: 1 };

    if (updatedFilters.categoryId) {
      params.set("category", updatedFilters.categoryId.toString());
    }

    if (updatedFilters.brandId) {
      params.set("brand", updatedFilters.brandId.toString());
    }

    if (updatedFilters.minPrice !== undefined) {
      params.set("minPrice", updatedFilters.minPrice.toString());
    }

    if (updatedFilters.maxPrice !== undefined) {
      params.set("maxPrice", updatedFilters.maxPrice.toString());
    }

    if (updatedFilters.sort) {
      params.set("sort", updatedFilters.sort);
    }

    // Aplicar filtros de atributos
    if (updatedFilters.attributes) {
      Object.entries(updatedFilters.attributes).forEach(
        ([attributeId, optionIds]) => {
          if (optionIds.length > 0) {
            params.set(`attr_${attributeId}`, optionIds.join(","));
          }
        }
      );
    }

    // Navegar a la URL con los filtros aplicados
    router.push(`${pathname}?${params.toString()}`);
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    const params = new URLSearchParams();

    // Mantener solo la búsqueda por texto
    if (currentFilters.query) {
      params.set("q", currentFilters.query);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Función para limpiar un filtro específico
  const clearFilter = (filterType: string, value?: number) => {
    const newFilters = { ...currentFilters };

    switch (filterType) {
      case "category":
        delete newFilters.categoryId;
        break;
      case "brand":
        delete newFilters.brandId;
        break;
      case "price":
        delete newFilters.minPrice;
        delete newFilters.maxPrice;
        setPriceRange({
          min: availableFilters.priceRange.min,
          max: availableFilters.priceRange.max,
        });
        break;
      case "attribute":
        if (value && newFilters.attributes) {
          // Encontrar a qué atributo pertenece esta opción
          for (const [attrId, optionIds] of Object.entries(
            newFilters.attributes
          )) {
            const attributeId = parseInt(attrId);
            const index = optionIds.indexOf(value);

            if (index !== -1) {
              // Eliminar esta opción del array
              const newOptions = [...optionIds];
              newOptions.splice(index, 1);

              if (newOptions.length === 0) {
                // Si no quedan opciones, eliminar el atributo completo
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [attributeId]: unused, ...restAttributes } =
                  newFilters.attributes;
                newFilters.attributes = restAttributes;
              } else {
                // Actualizar las opciones
                newFilters.attributes[attributeId] = newOptions;
              }

              break;
            }
          }
        }
        break;
    }

    applyFilters(newFilters);
  };

  // Función para aplicar filtro de categoría
  const applyCategoryFilter = (categoryId: number) => {
    applyFilters({ categoryId });
  };

  // Función para aplicar filtro de marca
  const applyBrandFilter = (brandId: number) => {
    applyFilters({ brandId });
  };

  // Función para aplicar filtro de precio
  const applyPriceFilter = () => {
    applyFilters({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  // Función para aplicar filtro de atributo
  const applyAttributeFilter = (attributeId: number, optionId: number) => {
    const currentAttributes = currentFilters.attributes || {};
    const currentOptions = currentAttributes[attributeId] || [];

    // Verificar si la opción ya está seleccionada
    const isSelected = currentOptions.includes(optionId);

    let newOptions: number[];

    if (isSelected) {
      // Quitar la opción
      newOptions = currentOptions.filter((id) => id !== optionId);
    } else {
      // Agregar la opción
      newOptions = [...currentOptions, optionId];
    }

    const newAttributes = {
      ...currentAttributes,
      [attributeId]: newOptions,
    };

    // Si no hay opciones para este atributo, eliminarlo
    if (newOptions.length === 0) {
      delete newAttributes[attributeId];
    }

    applyFilters({ attributes: newAttributes });
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    currentFilters.categoryId !== undefined ||
    currentFilters.brandId !== undefined ||
    currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined ||
    (currentFilters.attributes &&
      Object.keys(currentFilters.attributes).length > 0);

  // Encontrar nombres de filtros activos para mostrar
  const getActiveCategoryName = () => {
    if (!currentFilters.categoryId) return null;

    // Función recursiva para encontrar categoría por ID
    const findCategory = (cats: CategoryDTO[], id: number): string | null => {
      for (const cat of cats) {
        if (cat.id === id) return cat.name;
        if (cat.children) {
          const found = findCategory(cat.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    return findCategory(categories, currentFilters.categoryId);
  };

  const getActiveBrandName = () => {
    if (!currentFilters.brandId) return null;
    return brands.find((b) => b.id === currentFilters.brandId)?.name || null;
  };

  const getActiveAttributeNames = () => {
    if (!currentFilters.attributes) return [];

    const activeAttributes: { name: string; value: string; id: number }[] = [];

    Object.entries(currentFilters.attributes).forEach(
      ([attributeIdStr, optionIds]) => {
        const attributeId = parseInt(attributeIdStr);
        const attribute = attributes.find((a) => a.id === attributeId);

        if (attribute) {
          optionIds.forEach((optionId) => {
            const option = attribute.options.find((o) => o.id === optionId);
            if (option) {
              activeAttributes.push({
                name: attribute.name,
                value: option.value,
                id: optionId,
              });
            }
          });
        }
      }
    );

    return activeAttributes;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Filtros</h2>

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Filtros activos</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primary/80"
            >
              Limpiar todo
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentFilters.categoryId && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                <span>Categoría: {getActiveCategoryName()}</span>
                <button
                  onClick={() => clearFilter("category")}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {currentFilters.brandId && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                <span>Marca: {getActiveBrandName()}</span>
                <button
                  onClick={() => clearFilter("brand")}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {(currentFilters.minPrice !== undefined ||
              currentFilters.maxPrice !== undefined) && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                <span>
                  Precio:
                  {currentFilters.minPrice !== undefined
                    ? ` S/ ${currentFilters.minPrice}`
                    : " Min"}
                  -
                  {currentFilters.maxPrice !== undefined
                    ? ` S/ ${currentFilters.maxPrice}`
                    : " Max"}
                </span>
                <button
                  onClick={() => clearFilter("price")}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {getActiveAttributeNames().map((attr) => (
              <div
                key={`${attr.name}-${attr.value}`}
                className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span>
                  {attr.name}: {attr.value}
                </span>
                <button
                  onClick={() => clearFilter("attribute", attr.id)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtro de categorías */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-2"
          onClick={() => toggleSection("categories")}
        >
          <h3 className="font-medium">Categorías</h3>
          {expandedSections.categories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="mt-2 space-y-2">
            {availableFilters.categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  type="radio"
                  id={`category-${category.id}`}
                  name="category"
                  checked={currentFilters.categoryId === category.id}
                  onChange={() => applyCategoryFilter(category.id)}
                  className="mr-2"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm flex-1 cursor-pointer"
                >
                  {category.name} ({category.count})
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtro de marcas */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-2"
          onClick={() => toggleSection("brands")}
        >
          <h3 className="font-medium">Marcas</h3>
          {expandedSections.brands ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {expandedSections.brands && (
          <div className="mt-2 space-y-2">
            {availableFilters.brands.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <input
                  type="radio"
                  id={`brand-${brand.id}`}
                  name="brand"
                  checked={currentFilters.brandId === brand.id}
                  onChange={() => applyBrandFilter(brand.id)}
                  className="mr-2"
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm flex-1 cursor-pointer"
                >
                  {brand.name} ({brand.count})
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtro de precio */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full mb-2"
          onClick={() => toggleSection("price")}
        >
          <h3 className="font-medium">Precio</h3>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {expandedSections.price && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-4">
              <div>
                <label htmlFor="min-price" className="text-xs text-gray-500">
                  Mínimo
                </label>
                <input
                  type="number"
                  id="min-price"
                  min={availableFilters.priceRange.min}
                  max={availableFilters.priceRange.max}
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      min: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="text-gray-400">-</div>
              <div>
                <label htmlFor="max-price" className="text-xs text-gray-500">
                  Máximo
                </label>
                <input
                  type="number"
                  id="max-price"
                  min={availableFilters.priceRange.min}
                  max={availableFilters.priceRange.max}
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            <button
              onClick={applyPriceFilter}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded text-sm"
            >
              Aplicar
            </button>
          </div>
        )}
      </div>

      {/* Filtros de atributos */}
      {availableFilters.attributes.map((attribute) => (
        <div key={attribute.id} className="mb-6 border-b pb-4 last:border-b-0">
          <button
            className="flex justify-between items-center w-full mb-2"
            onClick={() => toggleAttributeSection(attribute.id)}
          >
            <h3 className="font-medium">{attribute.name}</h3>
            {expandedSections.attributes[attribute.id] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.attributes[attribute.id] && (
            <div className="mt-2 space-y-2">
              {attribute.options.map((option) => {
                const isSelected =
                  currentFilters.attributes?.[attribute.id]?.includes(
                    option.id
                  ) || false;

                return (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`attr-${attribute.id}-${option.id}`}
                      checked={isSelected}
                      onChange={() =>
                        applyAttributeFilter(attribute.id, option.id)
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`attr-${attribute.id}-${option.id}`}
                      className="text-sm flex-1 cursor-pointer"
                    >
                      {option.value} ({option.count})
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchFilters;
