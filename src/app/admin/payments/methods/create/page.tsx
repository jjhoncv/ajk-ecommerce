import { PaymentMethodForm } from '@/module/payments/components/admin/PaymentMethodForm'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default function CreatePaymentMethodPage(): JSX.Element {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo Método de Pago" />}
        subtitle="Configura un nuevo método de pago"
        breadcrumb={[
          { label: 'Pagos', url: '/admin/payments' },
          { label: 'Métodos', url: '/admin/payments/methods' },
          { label: 'Nuevo' }
        ]}
      >
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <PaymentMethodForm type="create" />
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}
