"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronRight, Percent } from "lucide-react";
import type { MegaMenuCategories } from "@/types/navigation";

interface NavigationProps {
  categories: MegaMenuCategories;
}

const Navigation: React.FC<NavigationProps> = ({ categories }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="bg-gray-100 border-t border-gray-200 border-none">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center">
          <div className="relative">
            <button
              className="bg-primary text-white px-6 py-3 flex items-center gap-2"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <Menu className="h-5 w-5" />
              <span>Categorías</span>
            </button>

            {isMenuOpen && (
              <div
                className="absolute left-0 w-[800px] bg-white shadow-xl border rounded-b-lg border-gray-300"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="flex">
                  <div className="w-64 bg-gray-50 p-4">
                    {Object.keys(categories).map((category) => (
                      <button
                        key={category}
                        className={`w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center justify-between ${
                          activeCategory === category
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onMouseEnter={() => setActiveCategory(category)}
                      >
                        <span>{category}</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ))}
                  </div>

                  {activeCategory && (
                    <div className="flex-1 p-6">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Subcategories */}
                        <div>
                          <h3 className="font-bold mb-4">Subcategorías</h3>
                          <ul className="space-y-2">
                            {categories[activeCategory].subcategories.map(
                              (sub) => (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.link}
                                    className="text-gray-600 hover:text-primary transition-colors duration-300"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* Featured Products */}
                        <div>
                          <h3 className="font-bold mb-4">
                            Productos Destacados
                          </h3>
                          <div className="space-y-3">
                            {categories[activeCategory].featuredProducts.map(
                              (product) => (
                                <div
                                  key={product.name}
                                  className="flex items-center gap-3"
                                >
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="object-cover rounded"
                                  />
                                  <div>
                                    <div className="font-medium">
                                      {product.name}
                                    </div>
                                    <div className="font-bold text-primary">
                                      S/ {product.price}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Banner */}
                        <div>
                          <div className="relative rounded-lg overflow-hidden h-full">
                            <Image
                              src={categories[activeCategory].banner.image}
                              alt={categories[activeCategory].banner.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                              <h4 className="text-white font-bold text-lg">
                                {categories[activeCategory].banner.title}
                              </h4>
                              <p className="text-yellow-400 font-bold">
                                {categories[activeCategory].banner.discount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center gap-8 px-6">
            <Link
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
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors duration-300 flex items-center gap-2"
            >
              <Percent className="h-4 w-4" />
              Ofertas
            </Link>
            <Link
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
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
