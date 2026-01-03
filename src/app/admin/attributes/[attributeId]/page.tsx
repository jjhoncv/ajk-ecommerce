import attributeModel from '@/backend/attribute'
import { AttributeFields } from '@/module/attributes/components/admin/attributeFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

interface EditAttributePageProps {
  params: Promise<{ attributeId: string }>
}

export default async function EditAttributePage({
  params
}: EditAttributePageProps): Promise<JSX.Element> {
  const { attributeId } = await params
  const attribute = await attributeModel.getAttributeById(Number(attributeId))

  if (attribute == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Error" />}
          breadcrumb={[{ label: 'Atributos', url: '/admin/attributes' }]}
        >
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">No se encontró el atributo</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const fieldsWithValues = mergeFieldsWithData(AttributeFields, {
    name: attribute.name,
    display_type: attribute.displayType
  })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Atributo" />}
        subtitle={`Editando: ${attribute.name}`}
        breadcrumb={[
          { label: 'Atributos', url: '/admin/attributes' },
          { label: 'Editar Atributo' }
        ]}
      >
        <FormCreate
          type="edit"
          api={{
            url: '/api/admin/attributes',
            method: 'PATCH',
            withFiles: true
          }}
          form={{
            redirect: '/admin/attributes',
            fields: fieldsWithValues,
            customFields: { id: attributeId }
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
