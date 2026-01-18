import { AttributeListView } from '@/module/attributes/components/admin/AttributeListView'
import AttributeService from '@/module/attributes/service/attribute'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function AttributeListPage(): Promise<JSX.Element> {
  const attributes = await AttributeService.getAttributes()

  if (!attributes || attributes.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Atributos" />}
          subtitle="Todos los atributos"
          breadcrumb={[{ label: 'Atributos' }]}
          options={
            <PageButton href="/admin/attributes/new">Nuevo atributo</PageButton>
          }
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No se encontraron atributos</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Atributos" />}
        subtitle="Todos los atributos"
        breadcrumb={[{ label: 'Atributos' }]}
        options={
          <PageButton href="/admin/attributes/new">Nuevo atributo</PageButton>
        }
      >
        <AttributeListView attributes={attributes} />
      </PageUI>
    </LayoutPageAdmin>
  )
}
