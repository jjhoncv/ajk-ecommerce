// app/account/addresses/page.tsx
import { customerAddressModel } from '@/module/customers/core'
import { AccountLayout, Addresses } from '@/module/profile/components'
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
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

  let customerAddresses = await customerAddressModel.getAddressByCustomer(
    Number(session.user.id)
  )
  if (!customerAddresses) {
    customerAddresses = []
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="p-0">
        <AccountLayout userName={session.user?.name || ''}>
          <Addresses initialAddresses={customerAddresses} />
        </AccountLayout>
      </LayoutContent>
    </Layout>
  )
}
