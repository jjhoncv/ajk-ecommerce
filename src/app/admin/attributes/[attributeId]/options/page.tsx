import attributeModel from '@/backend/attribute'
import attributeOptionModel from '@/backend/attribute-option'
import { OptionListView } from '@/module/attributes/components/admin/OptionListView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX, Suspense } from 'react'

function LoadingTable(): JSX.Element {
  return <div>Cargando opciones...</div>
}

interface OptionListPageProps {
  params: Promise<{ attributeId: string }>
}

export default async function OptionListPage({
  params
}: OptionListPageProps): Promise<JSX.Element> {
  const { attributeId } = await params
  const attribute = await attributeModel.getAttributeById(Number(attributeId))
  const options = await attributeOptionModel.getAttributeOptionsWithImages(
    Number(attributeId)
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

  if (!options || options.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Opciones" />}
          subtitle={`Opciones de: ${attribute.name}`}
          breadcrumb={[
            { label: 'Atributos', url: '/admin/attributes' },
            { label: attribute.name, url: `/admin/attributes/${attributeId}` },
            { label: 'Opciones' }
          ]}
          options={
            <PageButton href={`/admin/attributes/${attributeId}/options/new`}>
              Nueva opción
            </PageButton>
          }
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No se encontraron opciones para este atributo
            </p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Opciones" />}
        subtitle={`Opciones de: ${attribute.name}`}
        breadcrumb={[
          { label: 'Atributos', url: '/admin/attributes' },
          { label: attribute.name, url: `/admin/attributes/${attributeId}` },
          { label: 'Opciones' }
        ]}
        options={
          <PageButton href={`/admin/attributes/${attributeId}/options/new`}>
            Nueva opción
          </PageButton>
        }
      >
        <Suspense fallback={<LoadingTable />}>
          <OptionListView options={options} attributeId={Number(attributeId)} />
        </Suspense>
      </PageUI>
    </LayoutPageAdmin>
  )
}
