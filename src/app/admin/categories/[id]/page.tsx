import { CategoryFields } from '@/module/categories/components/admin/categoryFields'
import categoryService from '@/module/categories/service/category'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ parent?: string }>
}

export default async function EditCategoryPage({
  params,
  searchParams
}: EditCategoryPageProps): Promise<JSX.Element> {
  const { id } = await params
  const { parent } = await searchParams
  const parentId = parent ? Number(parent) : null

  const category = await categoryService.getCategoryById(Number(id))

  if (category == null) {
    return <div>No se encontró la categoría</div>
  }

  const fieldsWithValues = mergeFieldsWithData(CategoryFields, {
    ...category,
    parent_id: category.parentId?.toString() || '',
    image_url: category.imageUrl,
    display_order: category.displayOrder?.toString() || '1',
    show_nav: category.showNav ? 'true' : 'false'
  })

  // Construir URL de redirección manteniendo el contexto
  // Si tenemos parent en la URL, usarlo; si no, usar el parentId de la categoría
  const contextParentId = parentId ?? category.parentId
  const redirectUrl =
    contextParentId != null
      ? `/admin/categories?parent=${contextParentId}`
      : '/admin/categories'

  console.log({ category, fieldsWithValues })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Categoría" />}
        subtitle={`Editando: ${category.name}`}
        breadcrumb={[
          { label: 'Categorías', url: '/admin/categories' },
          { label: 'Editar Categoría' }
        ]}
      >
        <FormCreate
          type="edit"
          api={{
            url: '/api/admin/categories',
            method: 'PATCH',
            withFiles: true
          }}
          form={{
            redirect: redirectUrl,
            fields: fieldsWithValues,
            customFields: { id }
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
