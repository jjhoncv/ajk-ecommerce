"use client";
import { SearchSortingProps } from "@/interfaces/components/search.interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const SearchSorting: React.FC<SearchSortingProps> = ({ currentSort }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortOptions = [
    { value: "newest", label: "Más recientes" },
    { value: "price_asc", label: "Precio: menor a mayor" },
    { value: "price_desc", label: "Precio: mayor a menor" },
    { value: "name_asc", label: "Nombre: A-Z" },
    { value: "name_desc", label: "Nombre: Z-A" },
  ];

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    params.set("page", "1"); // Reset to first page when sorting
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={currentSort || "newest"}
        onChange={(e) => handleSortChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchSorting;
