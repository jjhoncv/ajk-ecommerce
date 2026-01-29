import { CategoryListView } from '@/module/categories/components/admin/CategoryListView'
import categoryService from '@/module/categories/service/category'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function CategoryListPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string, parent?: string }>
}): Promise<JSX.Element> {
  const { q, parent } = await searchParams
  const parentId = parent ? Number(parent) : null

  // Obtener categorías según el contexto
  let categories
  if (q != null) {
    categories = await categoryService.searchCategories(q)
  } else if (parentId != null) {
    categories = await categoryService.getCategoriesByParent(parentId)
  } else {
    categories = await categoryService.getCategoriesByParent(null) // Solo categorías raíz
  }

  // Obtener información de la categoría padre y ancestros para el breadcrumb
  let parentCategory = null
  let ancestors: Array<{ id: number; name: string; parentId: number | null }> = []
  if (parentId != null) {
    parentCategory = await categoryService.getCategoryById(parentId)
    ancestors = await categoryService.getCategoryAncestors(parentId)
  }

  if (categories.length === 0) {
    const emptyMessage =
      parentId != null
        ? `No se encontraron subcategorías para "${parentCategory?.name || 'esta categoría'}"`
        : 'No hay categorías creadas'

    const emptySubtitle =
      parentId != null
        ? 'Puedes crear una subcategoría usando el botón de arriba'
        : 'Comienza creando tu primera categoría para organizar tus productos'

    // Construir breadcrumb para estado vacío
    const emptyBreadcrumb: Array<{ label: string; url: string }> = [
      { label: 'Categorías', url: '/admin/categories' }
    ]
    ancestors.forEach((ancestor, index) => {
      const isLast = index === ancestors.length - 1
      emptyBreadcrumb.push({
        label: ancestor.name,
        url: isLast ? '' : `/admin/categories?parent=${ancestor.id}`
      })
    })

    const emptyTitle = parentCategory ? parentCategory.name : 'Categorías'

    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title={emptyTitle} />}
          subtitle={emptySubtitle}
          breadcrumb={emptyBreadcrumb}
          options={
            <div className="flex gap-2">
              {parentCategory != null && (
                <PageButton
                  href={
                    parentCategory.parentId != null
                      ? `/admin/categories?parent=${parentCategory.parentId}`
                      : '/admin/categories'
                  }
                >
                  ↑ Ir a nivel superior
                </PageButton>
              )}
              <PageButton
                href={
                  parentId != null
                    ? `/admin/categories/new?parent=${parentId}`
                    : '/admin/categories/new'
                }
              >
                Nueva categoría
              </PageButton>
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {emptyMessage}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">
              {emptySubtitle}
            </p>
            <PageButton
              href={
                parentId != null
                  ? `/admin/categories/new?parent=${parentId}`
                  : '/admin/categories/new'
              }
            >
              + Crear {parentId != null ? 'subcategoría' : 'categoría'}
            </PageButton>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  // Obtener información de qué categorías tienen subcategorías
  const categoriesWithSubcategories = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      hasSubcategories: await categoryService.hasSubcategories(category.id)
    }))
  )

  // Construir breadcrumb dinámico con toda la jerarquía
  const breadcrumb: Array<{ label: string; url: string }> = [
    { label: 'Categorías', url: '/admin/categories' }
  ]

  // Agregar cada ancestro al breadcrumb
  ancestors.forEach((ancestor, index) => {
    const isLast = index === ancestors.length - 1
    breadcrumb.push({
      label: ancestor.name,
      url: isLast ? '' : `/admin/categories?parent=${ancestor.id}`
    })
  })

  const title = parentCategory ? parentCategory.name : 'Categorías'

  const subtitle = parentCategory
    ? `Subcategorías de ${parentCategory.name}`
    : 'Todas las categorías principales'

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title={title} />}
        subtitle={subtitle}
        breadcrumb={breadcrumb}
        options={
          <div className="flex gap-2">
            {parentCategory != null && (
              <PageButton
                href={
                  parentCategory.parentId != null
                    ? `/admin/categories?parent=${parentCategory.parentId}`
                    : '/admin/categories'
                }
              >
                ↑ Ir a nivel superior
              </PageButton>
            )}
            <PageButton
              href={
                parentId != null
                  ? `/admin/categories/new?parent=${parentId}`
                  : '/admin/categories/new'
              }
            >
              Nueva categoría
            </PageButton>
          </div>
        }
      >
        <CategoryListView
          categories={categoriesWithSubcategories}
          parentId={parentId}
          parentCategory={parentCategory}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
