import shippingZoneModel from '@/backend/shipping-zone'
import { ShippingZonesListView } from '@/module/shippings/components/admin/ShippingZonesListView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0

export default async function ShippingZonesPage(): Promise<JSX.Element> {
  const zones = await shippingZoneModel.getAllShippingZonesWithMethods()

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Zonas de Envío" />}
        subtitle="Gestiona las zonas geográficas de envío"
        breadcrumb={[
          { label: 'Envíos', url: '/admin/shippings' },
          { label: 'Zonas' }
        ]}
        options={
          <PageButton href="/admin/shippings/zones/new">Nueva Zona</PageButton>
        }
      >
        {zones && zones.length > 0 ? (
          <ShippingZonesListView zones={zones} />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay zonas de envío configuradas</p>
          </div>
        )}
      </PageUI>
    </LayoutPageAdmin>
  )
}
