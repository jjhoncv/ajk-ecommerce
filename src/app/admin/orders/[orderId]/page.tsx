import { customerModel, customerAddressModel } from '@/module/customers/core'
import { orderModel, orderItemsModel, orderTrackingModel } from '@/module/orders/core'
import { paymentTransactionModel } from '@/module/payments/core'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { notFound } from 'next/navigation'
import { type JSX } from 'react'
import OrderDetailAdmin from './OrderDetailAdmin'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function AdminOrderDetailPage({
  params
}: PageProps): Promise<JSX.Element> {
  const { orderId } = await params
  const orderIdNum = parseInt(orderId)

  if (isNaN(orderIdNum)) {
    notFound()
  }

  // Obtener la orden
  const order = await orderModel.getOrderById(orderIdNum)
  if (!order) {
    notFound()
  }

  // Obtener datos relacionados
  const [customer, shippingAddress, orderItems, trackingHistory, transactions] =
    await Promise.all([
      customerModel.getCustomer(order.customerId),
      order.shippingAddressId
        ? customerAddressModel.getAddress(order.shippingAddressId)
        : null,
      orderItemsModel.getOrderItemsByOrderId(orderIdNum),
      orderTrackingModel.getTrackingHistory(orderIdNum),
      paymentTransactionModel.getTransactionsByOrderId(orderIdNum)
    ])

  const processingFee = transactions?.[0]?.processingFee
    ? Number(transactions[0].processingFee)
    : 0

  const orderData = {
    ...order,
    processingFee,
    totalWithFee: order.totalAmount + processingFee,
    customer: customer
      ? {
          id: customer.id,
          name: `${customer.name} ${customer.lastname || ''}`.trim(),
          email: customer.email,
          phone: customer.phone
        }
      : null,
    shippingAddress: shippingAddress
      ? {
          alias: shippingAddress.alias,
          streetName: shippingAddress.streetName,
          streetNumber: shippingAddress.streetNumber,
          apartment: shippingAddress.apartment,
          district: shippingAddress.district,
          province: shippingAddress.province,
          department: shippingAddress.department
        }
      : null,
    items: orderItems || [],
    trackingHistory: trackingHistory || [],
    transaction: transactions?.[0] || null
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title={`Orden ${order.orderNumber}`} />}
        subtitle="Detalle de la orden"
        breadcrumb={[
          { label: 'Órdenes', href: '/admin/orders' },
          { label: order.orderNumber }
        ]}
      >
        <OrderDetailAdmin order={orderData} />
      </PageUI>
    </LayoutPageAdmin>
  )
}
