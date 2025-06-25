// app/account/orders/[orderId]/page.tsx
import categoryModel from '@/backend/category'
import AccountLayout from '@/components/account/AccountLayout'
import OrderDetail from '@/components/account/OrderDetail'
import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import Navigation from '@/components/ui/Navigation/Navigation'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({
  params
}: OrderDetailPageProps) {
  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions)

  // Si no hay sesión, redirigir al inicio
  if (!session) {
    redirect('/')
  }

  // Validar que el orderId sea un número
  const id = parseInt(params.id)
  if (isNaN(id)) {
    redirect('/account/orders')
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
          <OrderDetail orderId={params.id} />
        </AccountLayout>
      </LayoutContent>
    </Layout>
  )
}
