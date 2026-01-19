// app/account/edit-profile/page.tsx
import { customerModel } from '@/module/customers/core'
import { AccountLayout, EditProfile } from '@/module/profile/components'
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function EditProfilePage() {
  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions)

  // Si no hay sesión, redirigir al inicio
  if (!session) {
    redirect('/')
  }

  const customer = await customerModel.getCustomer(Number(session.user.id))

  if (!customer) {
    return
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="p-0">
        <AccountLayout userName={session.user?.name || ''}>
          <EditProfile customer={customer} />
        </AccountLayout>
      </LayoutContent>
    </Layout>
  )
}
