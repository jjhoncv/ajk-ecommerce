import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import categoryService from '@/module/categories/service/category'
import Link from 'next/link'
import { Home, FolderOpen } from 'lucide-react'

export default async function CategoryNotFound() {
  // Obtener las primeras 4 categorías principales
  const categories = await categoryService.getCategoriesByParent(null)
  const topCategories = categories.slice(0, 4)

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="py-8">
        <div className="mx-auto max-w-2xl px-4">
          {/* Icono y mensaje */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <FolderOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              Categoría no encontrada
            </h1>
            <p className="text-gray-600">
              La categoría que buscas no existe o ha sido eliminada.
            </p>
          </div>

          {/* Botón de acción */}
          <div className="mb-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 font-medium text-white transition-colors hover:bg-secondary/90"
            >
              <Home className="h-4 w-4" />
              Ir al inicio
            </Link>
          </div>

          {/* Sugerencias de categorías dinámicas */}
          {topCategories.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <p className="mb-4 text-center text-sm font-medium text-gray-700">
                Explora nuestras categorías
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {topCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categoria/${category.slug}`}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </LayoutContent>
    </Layout>
  )
}
