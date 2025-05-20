"use client";
import React from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-xl mx-8">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden relative">
        <select className="bg-gray-50 border-r border-gray-300 px-4 py-3 text-sm focus:outline-none">
          <option>Todas las categorías</option>
          <option>Zapatillas</option>
          <option>Smartphones</option>
          <option>Computadoras</option>
        </select>
        <input
          type="text"
          placeholder="Buscar productos..."
          className="flex-1 px-4 py-3 pr-14 focus:outline-none"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors flex items-center justify-center w-10 h-10">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
