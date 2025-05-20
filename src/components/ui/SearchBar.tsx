"use client";
import React from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-xl mx-8">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <select className="bg-gray-50 border-r border-gray-300 px-4 py-3 text-sm focus:outline-none">
          <option>Todas las categorías</option>
          <option>Zapatillas</option>
          <option>Smartphones</option>
          <option>Computadoras</option>
        </select>
        <input
          type="text"
          placeholder="Buscar productos..."
          className="flex-1 px-4 py-3 focus:outline-none"
        />
        <button className="bg-[#5B4AE8] text-white px-6 py-3 hover:bg-[#4A3AD7] transition-colors">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
