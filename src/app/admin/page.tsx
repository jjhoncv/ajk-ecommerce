// app/admin/page.tsx
import AdminClientWrapper from '@/components/admin/AdminClientWrapper'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { adminAuthOptions } from '@/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'

export default async function AdminPage() {
  // ✅ Primer render: Server-side, sin shimmer
  const session = await getServerSession(adminAuthOptions)

  // crear array de tipos de usuarios
  const adminTypes = ['admin', 'superadmin']

  console.log('session?.user', session?.user)

  // validar si el tipo de usuario esta dentro del array de tipos de usuarios
  if (session?.user && adminTypes.includes(session.user.type)) {
    return <AdminDashboard user={session.user} />
  }

  // Si no está logueado, mostrar el wrapper client que maneja el login
  return <AdminClientWrapper initialSession={session} />
}
