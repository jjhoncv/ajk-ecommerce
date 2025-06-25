// app/admin/page.tsx
import AdminClientWrapper from '@/components/admin/AdminClientWrapper'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { adminAuthOptions } from '@/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'

export default async function AdminPage() {
  // ✅ Primer render: Server-side, sin shimmer
  const session = await getServerSession(adminAuthOptions)

  // Si ya está logueado como admin, mostrar dashboard directamente
  if (session?.user?.type === 'admin') {
    return <AdminDashboard user={session.user} />
  }

  // Si no está logueado, mostrar el wrapper client que maneja el login
  return <AdminClientWrapper initialSession={session} />
}
