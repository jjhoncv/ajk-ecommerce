"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Construir URL de búsqueda
    const searchUrl = "/search";
    const params = new URLSearchParams();

    // Añadir query si existe
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    // Añadir categoría si se seleccionó una específica
    if (category && category !== "all") {
      params.set("category", category);
    }

    // Navegar a la página de búsqueda
    router.push(`${searchUrl}?${params.toString()}`);
  };

  return (
    <div className="flex-1 max-w-xl mx-8">
      <form
        onSubmit={handleSearch}
        className="flex items-center border border-gray-300 rounded-lg overflow-hidden relative"
      >
        <select
          className="bg-gray-50 border-r border-gray-300 px-4 py-3 text-sm focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          <option value="1">Electrónicos</option>
          <option value="2">Computadoras</option>
          <option value="3">Laptops</option>
          <option value="4">Smartphones</option>
          <option value="5">Audio</option>
          <option value="6">Auriculares</option>
          <option value="7">Wearables</option>
          <option value="8">Smartwatches</option>
        </select>
        <input
          type="text"
          placeholder="Buscar productos..."
          className="flex-1 px-4 py-3 pr-14 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors flex items-center justify-center w-10 h-10"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
