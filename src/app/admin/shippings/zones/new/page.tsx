import { ShippingZoneForm } from '@/module/shippings/components/admin/ShippingZoneForm'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default function NewShippingZonePage(): JSX.Element {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nueva Zona de Envío" />}
        subtitle="Crea una nueva zona geográfica"
        breadcrumb={[
          { label: 'Envíos', url: '/admin/shippings' },
          { label: 'Zonas', url: '/admin/shippings/zones' },
          { label: 'Nueva' }
        ]}
      >
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <ShippingZoneForm type="create" />
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}
