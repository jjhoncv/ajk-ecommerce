import { ShippingMethodForm } from '@/module/shippings/components/admin/ShippingMethodForm'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default function NewShippingMethodPage(): JSX.Element {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo Método de Envío" />}
        subtitle="Crea un nuevo tipo de envío"
        breadcrumb={[
          { label: 'Envíos', url: '/admin/shippings' },
          { label: 'Métodos', url: '/admin/shippings/methods' },
          { label: 'Nuevo' }
        ]}
      >
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <ShippingMethodForm type="create" />
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}
