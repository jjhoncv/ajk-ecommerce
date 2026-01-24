import { customerModel } from '@/module/customers/core'
import { CustomersManager } from '@/module/customers/components/admin'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}): Promise<JSX.Element> {
  const { q, status } = await searchParams

  let customers = await customerModel.getCustomersWithStats()

  if (!customers) {
    customers = []
  }

  // Filtrar por búsqueda
  if (q) {
    const searchLower = q.toLowerCase()
    customers = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.lastname.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        (customer.dni && customer.dni.includes(q)) ||
        (customer.phone && customer.phone.includes(q))
    )
  }

  // Filtrar por estado
  if (status && status !== 'all') {
    const isActive = status === 'active' ? 1 : 0
    customers = customers.filter((customer) => customer.isActive === isActive)
  }

  if (customers.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Clientes" />}
          subtitle="Gestión de clientes de tu tienda"
          breadcrumb={[{ label: 'Clientes' }]}
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay clientes registrados</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Clientes" />}
        subtitle={`${customers.length} cliente${customers.length !== 1 ? 's' : ''} registrado${customers.length !== 1 ? 's' : ''}`}
        breadcrumb={[{ label: 'Clientes' }]}
      >
        <CustomersManager customers={customers} />
      </PageUI>
    </LayoutPageAdmin>
  )
}
