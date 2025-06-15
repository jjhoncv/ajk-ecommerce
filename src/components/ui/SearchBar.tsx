"use client";
import { useRouter } from "next/navigation";
import SearchSuggestions from "../search/SearchSuggestions";

export default function SearchBar() {
  const router = useRouter();

  const handleSearch = (query?: string) => {
    // Construir URL de búsqueda
    const searchUrl = "/search";
    const params = new URLSearchParams();

    if (query === undefined) {
      router.push(`${searchUrl}`);
      return
    }

    // Añadir query si existe
    if (query.trim()) {
      params.set("q", query.trim());
    }

    // Navegar a la página de búsqueda
    router.push(`${searchUrl}?${params.toString()}`);
  };

  return (
    <div className="flex-1 mx-8">
      <SearchSuggestions
        onSearch={handleSearch}
        placeholder="Buscar productos..."
        className="w-full"
      />
    </div>
  );
}
