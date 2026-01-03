import attributeModel from '@/backend/attribute'
import { AttributeOptionFields } from '@/module/attributes/components/admin/attributeOptionFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

interface NewOptionPageProps {
  params: Promise<{ attributeId: string }>
}

export default async function NewOptionPage({
  params
}: NewOptionPageProps): Promise<JSX.Element> {
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

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nueva Opción" />}
        subtitle={`Crear opción para: ${attribute.name}`}
        breadcrumb={[
          { label: 'Atributos', url: '/admin/attributes' },
          { label: attribute.name, url: `/admin/attributes/${attributeId}` },
          {
            label: 'Opciones',
            url: `/admin/attributes/${attributeId}/options`
          },
          { label: 'Nueva Opción' }
        ]}
      >
        <FormCreate
          api={{
            url: `/api/admin/attributes/${attributeId}/options`,
            method: 'POST',
            withFiles: true
          }}
          form={{
            redirect: `/admin/attributes/${attributeId}/options`,
            fields: AttributeOptionFields
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
