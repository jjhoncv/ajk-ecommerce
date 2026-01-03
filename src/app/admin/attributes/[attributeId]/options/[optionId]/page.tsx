import attributeModel from '@/backend/attribute'
import attributeOptionModel from '@/backend/attribute-option'
import { AttributeOptionFields } from '@/module/attributes/components/admin/attributeOptionFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

interface EditOptionPageProps {
  params: Promise<{ attributeId: string; optionId: string }>
}

export default async function EditOptionPage({
  params
}: EditOptionPageProps): Promise<JSX.Element> {
  const { attributeId, optionId } = await params
  const attribute = await attributeModel.getAttributeById(Number(attributeId))
  const option = await attributeOptionModel.getAttributeOptionById(
    Number(optionId)
  )

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

  if (option == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Error" />}
          breadcrumb={[
            { label: 'Atributos', url: '/admin/attributes' },
            { label: attribute.name, url: `/admin/attributes/${attributeId}` },
            {
              label: 'Opciones',
              url: `/admin/attributes/${attributeId}/options`
            }
          ]}
        >
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">No se encontró la opción</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const fieldsWithValues = mergeFieldsWithData(AttributeOptionFields, {
    value: option.value,
    additional_cost: option.additionalCost?.toString() || '0'
  })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Opción" />}
        subtitle={`Editando opción: ${option.value}`}
        breadcrumb={[
          { label: 'Atributos', url: '/admin/attributes' },
          { label: attribute.name, url: `/admin/attributes/${attributeId}` },
          {
            label: 'Opciones',
            url: `/admin/attributes/${attributeId}/options`
          },
          { label: 'Editar Opción' }
        ]}
      >
        <FormCreate
          type="edit"
          api={{
            url: `/api/admin/attributes/${attributeId}/options`,
            method: 'PATCH',
            withFiles: true
          }}
          form={{
            redirect: `/admin/attributes/${attributeId}/options`,
            fields: fieldsWithValues,
            customFields: { id: optionId }
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
