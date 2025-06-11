"use client";
import ActiveFilters from "@/components/search/ActiveFilters";
import AttributeFilter from "@/components/search/AttributeFilter";
import PriceRangeFilter from "@/components/search/PriceRangeFilter";
import { SearchFiltersProps } from "@/interfaces/components/search.interface";
import React from "react";

const SearchFilters: React.FC<SearchFiltersProps> = ({
  availableFilters,
  currentFilters,
}) => {
  return (
    <div className="bg-white py-6 rounded-lg">
      {/* <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <ClearFiltersButton currentFilters={currentFilters} />
      </div> */}

      {/* Filtros activos */}
      <ActiveFilters
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      />


      {/* Categorías */}
      {/* <CategoryFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      /> */}

      {/* Marcas */}
      {/* <BrandFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      /> */}



      {/* Atributos */}
      <AttributeFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      />


      {/* Rango de precios */}
      <PriceRangeFilter
        availableFilters={availableFilters}
        currentFilters={currentFilters}
      />
    </div>
  );
};

export default SearchFilters;
