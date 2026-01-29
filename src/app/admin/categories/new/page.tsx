import { CategoryFields } from '@/module/categories/components/admin/categoryFields'
import categoryService from '@/module/categories/service/category'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function NewCategoryPage({
  searchParams
}: {
  searchParams: Promise<{ parent?: string }>
}): Promise<JSX.Element> {
  const { parent } = await searchParams
  const parentId = parent ? Number(parent) : null

  // Obtener información de la categoría padre si existe
  let parentCategory = null
  if (parentId != null) {
    parentCategory = await categoryService.getCategoryById(parentId)
  }

  // Construir URL de redirección manteniendo el contexto
  const redirectUrl =
    parentId != null
      ? `/admin/categories?parent=${parentId}`
      : '/admin/categories'

  // Construir breadcrumb dinámico
  const breadcrumb: Array<{ label: string; url?: string }> = [
    { label: 'Categorías', url: '/admin/categories' }
  ]

  if (parentCategory) {
    breadcrumb.push({
      label: parentCategory.name,
      url: `/admin/categories?parent=${parentId}`
    })
  }

  breadcrumb.push({ label: parentCategory ? 'Nueva Subcategoría' : 'Nueva Categoría' })

  const title = parentCategory
    ? `Nueva Subcategoría de "${parentCategory.name}"`
    : 'Nueva Categoría'

  const subtitle = parentCategory
    ? `Crear una subcategoría dentro de ${parentCategory.name}`
    : 'Crear una nueva categoría principal'

  // Filtrar el campo parent_id del formulario (se pasa via customFields)
  const filteredFields = CategoryFields.filter(field => field.key !== 'parent_id')

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title={title} />}
        subtitle={subtitle}
        breadcrumb={breadcrumb}
      >
        {parentCategory && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Categoría padre:</span> {parentCategory.name}
            </p>
          </div>
        )}
        <FormCreate
          api={{
            url: '/api/admin/categories',
            method: 'POST',
            withFiles: true
          }}
          form={{
            redirect: redirectUrl,
            fields: filteredFields,
            customFields: parentId != null ? { parent_id: parentId } : undefined
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
