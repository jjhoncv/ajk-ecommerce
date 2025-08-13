import { CategoryFields } from '@/module/categories/components/admin/categoryFields'
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

  // Construir URL de redirección manteniendo el contexto
  const redirectUrl =
    parentId != null
      ? `/admin/categories?parent=${parentId}`
      : '/admin/categories'

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nueva Categoría" />}
        subtitle="Crear una nueva categoría"
        breadcrumb={[
          { label: 'Categorías', url: '/admin/categories' },
          { label: 'Nueva Categoría' }
        ]}
      >
        <FormCreate
          api={{
            url: '/api/admin/categories',
            method: 'POST',
            withFiles: true
          }}
          form={{ redirect: redirectUrl, fields: CategoryFields }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
