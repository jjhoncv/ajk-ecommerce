import { customerModel, customerAddressModel } from '@/module/customers/core'
import { orderModel } from '@/module/orders/core'
import { CustomerDetail } from '@/module/customers/components/admin'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { notFound } from 'next/navigation'
import { type JSX } from 'react'

interface CustomerDetailPageProps {
  params: Promise<{ customerId: string }>
}

export default async function CustomerDetailPage({
  params
}: CustomerDetailPageProps): Promise<JSX.Element> {
  const { customerId } = await params
  const id = parseInt(customerId)

  if (isNaN(id)) {
    notFound()
  }

  // Obtener cliente con estadísticas
  const customer = await customerModel.getCustomerWithStats(id)
  if (!customer) {
    notFound()
  }

  // Obtener direcciones del cliente
  const addresses = await customerAddressModel.getAddressByCustomer(id)

  // Obtener órdenes del cliente
  const allOrders = await orderModel.getAllOrders()
  const customerOrders =
    allOrders
      ?.filter((order) => order.customerId === id)
      .slice(0, 10)
      .map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString()
      })) || []

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Detalle del cliente" />}
        subtitle={`${customer.name} ${customer.lastname}`}
        breadcrumb={[
          { label: 'Clientes', url: '/admin/customers' },
          { label: `${customer.name} ${customer.lastname}` }
        ]}
      >
        <CustomerDetail
          customer={customer}
          addresses={addresses || []}
          recentOrders={customerOrders}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
