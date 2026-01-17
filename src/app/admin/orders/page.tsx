import orderModel from '@/backend/order'
import paymentTransactionModel from '@/backend/payment-transaction'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'
import OrdersListAdmin from './OrdersListAdmin'

export default async function AdminOrdersPage(): Promise<JSX.Element> {
  // Obtener todas las órdenes
  const ordersData = await orderModel.getAllOrders()

  if (!ordersData || ordersData.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Órdenes" />}
          subtitle="Gestión de pedidos"
          breadcrumb={[{ label: 'Órdenes' }]}
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay órdenes registradas</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  // Obtener comisiones de procesamiento para cada orden
  const ordersWithFees = await Promise.all(
    ordersData.map(async (order) => {
      const transactions = await paymentTransactionModel.getTransactionsByOrderId(order.id)
      const processingFee = transactions?.[0]?.processingFee ? Number(transactions[0].processingFee) : 0
      return {
        ...order,
        processingFee,
        totalWithFee: order.totalAmount + processingFee
      }
    })
  )

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Órdenes" />}
        subtitle="Gestión de pedidos"
        breadcrumb={[{ label: 'Órdenes' }]}
      >
        <OrdersListAdmin initialOrders={ordersWithFees} />
      </PageUI>
    </LayoutPageAdmin>
  )
}
