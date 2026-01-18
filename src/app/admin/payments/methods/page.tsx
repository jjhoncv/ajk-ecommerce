import { PaymentMethodsListView } from '@/module/payments/components/admin/PaymentMethodsListView'
import PaymentService from '@/module/payments/service/payment'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0

export default async function PaymentMethodsPage(): Promise<JSX.Element> {
  const methods = await PaymentService.getPaymentMethods()

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Métodos de Pago" />}
        subtitle="Gestiona los métodos de pago disponibles"
        breadcrumb={[
          { label: 'Pagos', url: '/admin/payments' },
          { label: 'Métodos' }
        ]}
        options={
          <PageButton href="/admin/payments/methods/create">Nuevo Método</PageButton>
        }
      >
        {methods && methods.length > 0 ? (
          <PaymentMethodsListView methods={methods} />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay métodos de pago configurados</p>
          </div>
        )}
      </PageUI>
    </LayoutPageAdmin>
  )
}
