import shippingMethodModel from '@/backend/shipping-method'
import { ShippingMethodForm } from '@/module/shippings/components/admin/ShippingMethodForm'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0

interface EditShippingMethodPageProps {
  params: Promise<{ methodId: string }>
}

export default async function EditShippingMethodPage({
  params
}: EditShippingMethodPageProps): Promise<JSX.Element> {
  const { methodId } = await params
  const method = await shippingMethodModel.getShippingMethodById(Number(methodId))

  if (!method) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Error" />}
          breadcrumb={[
            { label: 'Envíos', url: '/admin/shippings' },
            { label: 'Métodos', url: '/admin/shippings/methods' }
          ]}
        >
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">No se encontró el método de envío</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Método de Envío" />}
        subtitle={`Editando: ${method.name}`}
        breadcrumb={[
          { label: 'Envíos', url: '/admin/shippings' },
          { label: 'Métodos', url: '/admin/shippings/methods' },
          { label: 'Editar' }
        ]}
      >
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <ShippingMethodForm
            type="edit"
            initialData={{
              id: method.id,
              name: method.name,
              description: method.description,
              baseCost: method.baseCost,
              estimatedDaysMin: method.estimatedDaysMin,
              estimatedDaysMax: method.estimatedDaysMax,
              isActive: method.isActive ?? 1
            }}
          />
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}
