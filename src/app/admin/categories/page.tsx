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

  // Obtener información de la categoría padre para el breadcrumb
  let parentCategory = null
  if (parentId != null) {
    parentCategory = await categoryService.getCategoryById(parentId)
  }

  if (categories.length === 0) {
    const message =
      parentId != null
        ? `No se encontraron subcategorías para "${parentCategory?.name || 'esta categoría'}"`
        : 'No se encontraron categorías'
    return <div>{message}</div>
  }

  // Obtener información de qué categorías tienen subcategorías
  const categoriesWithSubcategories = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      hasSubcategories: await categoryService.hasSubcategories(category.id)
    }))
  )

  // Construir breadcrumb dinámico
  const breadcrumb = [{ label: 'Categorías', url: '/admin/categories' }]
  if (parentCategory != null) {
    breadcrumb.push({
      label: `Subcategorías de "${parentCategory.name}"`,
      url: ''
    })
  }

  const title = parentCategory
    ? `Subcategorías de "${parentCategory.name}"`
    : 'Categorías'

  const subtitle = parentCategory
    ? `Gestionar subcategorías de ${parentCategory.name}`
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
