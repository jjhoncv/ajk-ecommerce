// app/account/edit-profile/page.tsx
import { categoryModel } from '@/module/categories/core'
import { customerModel } from '@/module/customers/core'
import AccountLayout from '@/components/account/AccountLayout'
import EditProfile from '@/components/account/EditProfile/EditProfile'
import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import Navigation from '@/components/ui/Navigation/Navigation'
import { authOptions } from '@/lib/auth/auth' // IMPORTANTE: Importar authOptions
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function EditProfilePage() {
  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions)

  // Si no hay sesión, redirigir al inicio
  if (!session) {
    redirect('/')
  }

  // Obtener datos para el header y footer
  const categories = await categoryModel.getCategories()
  const customer = await customerModel.getCustomer(Number(session.user.id))

  if (!customer) {
    return
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" categories={categories || []} />
      </Header>
      <LayoutContent className="p-0">
        <AccountLayout userName={session.user?.name || ''}>
          <EditProfile customer={customer} />
        </AccountLayout>
      </LayoutContent>
    </Layout>
  )
}
