import { OrdersListView } from '@/module/orders/components/admin'
import OrderService from '@/module/orders/service/order'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function AdminOrdersPage(): Promise<JSX.Element> {
  const orders = await OrderService.getOrders()

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Órdenes" />}
        subtitle="Gestión de pedidos"
        breadcrumb={[{ label: 'Órdenes' }]}
      >
        {orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay órdenes registradas</p>
          </div>
        ) : (
          <OrdersListView orders={orders} />
        )}
      </PageUI>
    </LayoutPageAdmin>
  )
}
