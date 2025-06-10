"use client";
import { Categories } from "@/types/domain";
import { Menu, Percent } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import CategoriesMenu from "./CategoriesMenu";
import SlidePage from "./SlidePage";

interface NavigationProps {
  categories: Categories[];
}

const Navigation: React.FC<NavigationProps> = ({ categories }) => {
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);

  return (
    <div className="bg-gray-100 border-t border-gray-200 border-none">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center">
          {/* Botón de categorías que abre el SlidePage */}
          <div className="relative">
            <button
              className="bg-primary text-white px-6 py-3 flex items-center gap-2 hover:bg-primary/90 transition-colors"
              onClick={() => setIsCategoriesMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span>Categorías</span>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center gap-8 px-6">
            {/* <Link
              href="/search"
              className="text-gray-700 hover:text-primary transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Buscar
            </Link> */}
            <Link
              href="/ofertas"
              className="text-gray-700 hover:text-primary transition-colors duration-300 flex items-center gap-2"
            >
              <Percent className="h-4 w-4" />
              Ofertas
            </Link>
            {categories
              .filter((categorie) => categorie.parentId === null)
              .map((categorie, index) => (
                <Link
                  key={index}
                  href={`/categoria/${categorie.id}`}
                  className="text-gray-700 hover:text-primary transition-colors duration-300"
                >
                  {categorie.name}
                </Link>
              ))}

            {/* <Link
              href="/nuevos"
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Nuevos Productos
            </Link>
            <Link
              href="/marcas"
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Marcas
            </Link>
            <Link
              href="/vendedores"
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Vendedores
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Blog
            </Link>
            <Link
              href="/contacto"
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Contacto
            </Link> */}
          </nav>
        </div>
      </div>

      {/* SlidePage para el menú de categorías */}
      <SlidePage
        isOpen={isCategoriesMenuOpen}
        onClose={() => setIsCategoriesMenuOpen(false)}
        title="Categorías"
        direction="left"
        width={400}
      >
        <CategoriesMenu
          categories={categories}
          onClose={() => setIsCategoriesMenuOpen(false)}
        />
      </SlidePage>
    </div>
  );
};

export default Navigation;
