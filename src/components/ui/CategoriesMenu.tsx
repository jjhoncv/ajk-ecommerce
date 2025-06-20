'use client'
import { Categories } from '@/types/domain'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

interface CategoriesMenuProps {
  categories: Categories[]
  onClose?: () => void
}

interface CategoryLevel {
  category: Categories | null
  children: Categories[]
  title: string
}

const CategoriesMenu: React.FC<CategoriesMenuProps> = ({
  categories,
  onClose
}) => {
  const [categoryStack, setCategoryStack] = useState<CategoryLevel[]>([
    {
      category: null,
      children: categories
        ? categories.filter((cat) => cat.parentId === null)
        : [],
      title: 'Todas las categorías'
    }
  ])

  const currentLevel = categoryStack[categoryStack.length - 1]

  const handleCategoryClick = (category: Categories) => {
    const children = categories
      ? categories.filter((cat) => cat.parentId === category.id)
      : []

    if (children.length > 0) {
      // Si tiene subcategorías, navegar a ellas
      setCategoryStack((prev) => [
        ...prev,
        {
          category,
          children,
          title: category.name
        }
      ])
    } else {
      // Si no tiene subcategorías, ir a la página de la categoría
      if (onClose) {
        onClose()
      }
      window.location.href = `/categoria/${category.id}`
    }
  }

  const handleBackClick = () => {
    if (categoryStack.length > 1) {
      setCategoryStack((prev) => prev.slice(0, -1))
    }
  }

  const handleHomeClick = () => {
    setCategoryStack([
      {
        category: null,
        children: categories
          ? categories.filter((cat) => cat.parentId === null)
          : [],
        title: 'Todas las categorías'
      }
    ])
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header con navegación */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentLevel.title}
          </h3>
          {categoryStack.length > 1 && (
            <button
              onClick={handleHomeClick}
              className="rounded-full p-2 transition-colors hover:bg-gray-200"
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
                <ChevronRight className="mx-1 h-3 w-3 text-gray-400" />
              )}
              <button
                onClick={() =>
                  setCategoryStack((prev) => prev.slice(0, index + 1))
                }
                className="transition-colors hover:text-primary"
              >
                {level.title}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Botón de retroceso */}
      {categoryStack.length > 1 && (
        <div className="border-b border-gray-100 p-3">
          <button
            onClick={handleBackClick}
            className="flex w-full items-center gap-2 text-left text-gray-600 transition-colors hover:text-primary"
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
                : false

              return (
                <div
                  key={category.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="group flex w-full items-center justify-between p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {category.imageUrl && (
                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-medium text-gray-800 transition-colors group-hover:text-primary">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className="mt-1 text-xs text-gray-500">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {hasChildren && (
                      <ChevronRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-primary" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No hay subcategorías disponibles</p>
            <Link
              href={`/categoria/${currentLevel.category?.id}`}
              className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              Ver productos
            </Link>
          </div>
        )}
      </div>

      {/* Footer con enlaces útiles */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="space-y-2">
          <Link
            href="/ofertas"
            className="block text-sm text-gray-600 transition-colors hover:text-primary"
          >
            🔥 Ver todas las ofertas
          </Link>
          <Link
            href="/nuevos"
            className="block text-sm text-gray-600 transition-colors hover:text-primary"
          >
            ✨ Productos nuevos
          </Link>
          <Link
            href="/marcas"
            className="block text-sm text-gray-600 transition-colors hover:text-primary"
          >
            🏷️ Explorar marcas
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CategoriesMenu
