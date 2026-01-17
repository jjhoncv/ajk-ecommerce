import paymentMethodModel from '@/backend/payment-method'
import { PaymentMethodForm } from '@/module/payments/components/admin/PaymentMethodForm'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0

interface EditPaymentMethodPageProps {
  params: Promise<{ methodId: string }>
}

export default async function EditPaymentMethodPage({
  params
}: EditPaymentMethodPageProps): Promise<JSX.Element> {
  const { methodId } = await params
  const method = await paymentMethodModel.getPaymentMethodById(Number(methodId))

  if (!method) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Error" />}
          breadcrumb={[
            { label: 'Pagos', url: '/admin/payments' },
            { label: 'Métodos', url: '/admin/payments/methods' }
          ]}
        >
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">No se encontró el método de pago</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Método de Pago" />}
        subtitle={`Editando: ${method.name}`}
        breadcrumb={[
          { label: 'Pagos', url: '/admin/payments' },
          { label: 'Métodos', url: '/admin/payments/methods' },
          { label: 'Editar' }
        ]}
      >
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <PaymentMethodForm
            type="edit"
            initialData={{
              id: method.id,
              name: method.name,
              code: method.code,
              description: method.description ?? null,
              iconUrl: method.iconUrl ?? null,
              processingFeeType: method.processingFeeType as 'fixed' | 'percentage' | null,
              processingFeeValue: method.processingFeeValue ?? null,
              minAmount: method.minAmount ?? null,
              maxAmount: method.maxAmount ?? null,
              isActive: method.isActive ?? 1,
              requiresVerification: method.requiresVerification ?? 0,
              displayOrder: method.displayOrder ?? 0
            }}
          />
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}
