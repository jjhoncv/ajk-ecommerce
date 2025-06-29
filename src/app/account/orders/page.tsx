// app/account/orders/page.tsx
import categoryModel from '@/backend/category'
import AccountLayout from '@/components/account/AccountLayout'
import OrdersList from '@/components/account/OrderList'
import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import Navigation from '@/components/ui/Navigation/Navigation'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  // Obtener la sesión del usuario
  const session = await getServerSession()

  // Si no hay sesión, redirigir al inicio
  if (!session) {
    redirect('/')
  }

  // Obtener datos para el header y footer
  const categories = await categoryModel.getCategories()

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" categories={categories || []} />
      </Header>
      <LayoutContent className="p-0">
        <AccountLayout userName={session.user?.name || ''}>
          <OrdersList />
        </AccountLayout>
      </LayoutContent>
    </Layout>
  )
}
