import { AttributeFields } from '@/module/attributes/components/admin/attributeFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function NewAttributePage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo Atributo" />}
        subtitle="Crear un nuevo atributo"
        breadcrumb={[
          { label: 'Atributos', url: '/admin/attributes' },
          { label: 'Nuevo Atributo' }
        ]}
      >
        <FormCreate
          api={{
            url: '/api/admin/attributes',
            method: 'POST',
            withFiles: true
          }}
          form={{ redirect: '/admin/attributes', fields: AttributeFields }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
