"use client";
import { Categories } from "@/types/domain";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface CategoriesMenuProps {
  categories: Categories[];
  onClose?: () => void;
}

interface CategoryLevel {
  category: Categories | null;
  children: Categories[];
  title: string;
}

const CategoriesMenu: React.FC<CategoriesMenuProps> = ({
  categories,
  onClose,
}) => {
  const [categoryStack, setCategoryStack] = useState<CategoryLevel[]>([
    {
      category: null,
      children: categories
        ? categories.filter((cat) => cat.parentId === null)
        : [],
      title: "Todas las categorías",
    },
  ]);

  const currentLevel = categoryStack[categoryStack.length - 1];

  const handleCategoryClick = (category: Categories) => {
    const children = categories
      ? categories.filter((cat) => cat.parentId === category.id)
      : [];

    if (children.length > 0) {
      // Si tiene subcategorías, navegar a ellas
      setCategoryStack((prev) => [
        ...prev,
        {
          category,
          children,
          title: category.name,
        },
      ]);
    } else {
      // Si no tiene subcategorías, ir a la página de la categoría
      if (onClose) {
        onClose();
      }
      window.location.href = `/categoria/${category.id}`;
    }
  };

  const handleBackClick = () => {
    if (categoryStack.length > 1) {
      setCategoryStack((prev) => prev.slice(0, -1));
    }
  };

  const handleHomeClick = () => {
    setCategoryStack([
      {
        category: null,
        children: categories
          ? categories.filter((cat) => cat.parentId === null)
          : [],
        title: "Todas las categorías",
      },
    ]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header con navegación */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-800">
            {currentLevel.title}
          </h3>
          {categoryStack.length > 1 && (
            <button
              onClick={handleHomeClick}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Ir al inicio"
            >
              <Home className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600">
          {categoryStack.map((level, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
              )}
              <button
                onClick={() =>
                  setCategoryStack((prev) => prev.slice(0, index + 1))
                }
                className="hover:text-primary transition-colors"
              >
                {level.title}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Botón de retroceso */}
      {categoryStack.length > 1 && (
        <div className="p-3 border-b border-gray-100">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors w-full text-left"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Volver</span>
          </button>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="flex-1 overflow-y-auto">
        {currentLevel.children.length > 0 ? (
          <div className="p-2">
            {currentLevel.children.map((category) => {
              const hasChildren = categories
                ? categories.some((cat) => cat.parentId === category.id)
                : false;

              return (
                <div
                  key={category.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {category.imageUrl && (
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {hasChildren && (
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No hay subcategorías disponibles</p>
            <Link
              href={`/categoria/${currentLevel.category?.id}`}
              className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver productos
            </Link>
          </div>
        )}
      </div>

      {/* Footer con enlaces útiles */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <Link
            href="/ofertas"
            className="block text-sm text-gray-600 hover:text-primary transition-colors"
          >
            🔥 Ver todas las ofertas
          </Link>
          <Link
            href="/nuevos"
            className="block text-sm text-gray-600 hover:text-primary transition-colors"
          >
            ✨ Productos nuevos
          </Link>
          <Link
            href="/marcas"
            className="block text-sm text-gray-600 hover:text-primary transition-colors"
          >
            🏷️ Explorar marcas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesMenu;
