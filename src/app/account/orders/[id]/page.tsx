// app/account/orders/[orderId]/page.tsx
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({
  params
}: OrderDetailPageProps) {
  const resolvedParams = await params

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions)

  // Si no hay sesión, redirigir al inicio
  if (!session) {
    redirect('/')
  }

  // Validar que el orderId sea un número
  const id = parseInt(resolvedParams.id)
  if (isNaN(id)) {
    redirect('/account/orders')
  }

  // Redirigir a la página de órdenes ya que OrderDetail es un modal
  // TODO: Si se necesita una página de detalle standalone, crear un componente separado
  redirect('/account/orders')
}
