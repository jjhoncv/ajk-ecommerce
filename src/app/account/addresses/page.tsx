// app/account/addresses/page.tsx
import { categoryModel } from '@/module/categories/core'
import { customerAddressModel } from '@/module/customers/core'
import AccountLayout from '@/components/account/AccountLayout'
import Addresses from '@/components/account/Addresses/Addresses'
import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import Navigation from '@/components/ui/Navigation/Navigation'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AddressesPage() {
  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions)

  // Si no hay sesión, redirigir al inicio
  if (!session) {
    redirect('/')
  }

  // Obtener datos para el header y footer
  const categories = await categoryModel.getCategories()
  let customerAddresses = await customerAddressModel.getAddressByCustomer(
    Number(session.user.id)
  )
  if (!customerAddresses) {
    customerAddresses = []
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" categories={categories || []} />
      </Header>
      <LayoutContent className="p-0">
        <AccountLayout userName={session.user?.name || ''}>
          <Addresses initialAddresses={customerAddresses} />
        </AccountLayout>
      </LayoutContent>
    </Layout>
  )
}
