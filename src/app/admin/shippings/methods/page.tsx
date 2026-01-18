import { ShippingMethodsListView } from '@/module/shippings/components/admin/ShippingMethodsListView'
import ShippingService from '@/module/shippings/service/shipping'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0

export default async function ShippingMethodsPage(): Promise<JSX.Element> {
  const methods = await ShippingService.getShippingMethods()

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Métodos de Envío" />}
        subtitle="Gestiona los tipos de envío disponibles"
        breadcrumb={[
          { label: 'Envíos', url: '/admin/shippings' },
          { label: 'Métodos' }
        ]}
        options={
          <PageButton href="/admin/shippings/methods/new">Nuevo Método</PageButton>
        }
      >
        {methods && methods.length > 0 ? (
          <ShippingMethodsListView methods={methods} />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay métodos de envío configurados</p>
          </div>
        )}
      </PageUI>
    </LayoutPageAdmin>
  )
}
