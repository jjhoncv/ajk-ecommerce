"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Construir URL de búsqueda
    const searchUrl = "/search";
    const params = new URLSearchParams();

    // Añadir query si existe
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    // Navegar a la página de búsqueda
    router.push(`${searchUrl}?${params.toString()}`);
  };

  return (
    <div className="flex-1 mx-8">
      <form
        onSubmit={handleSearch}
        className="flex items-center border border-gray-300 rounded-3xl overflow-hidden relative"
      >
        <input
          type="text"
          placeholder="Buscar productos..."
          className="flex-1 px-4 py-3 pr-14 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors flex items-center justify-center w-10 h-10"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
