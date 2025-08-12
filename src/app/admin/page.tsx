import AdminClientWrapper from '@/components/admin/AdminClientWrapper'
import { AdminDashboard } from '@/module/shared/components/AdminDashboard'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'

export default async function AdminPage(): Promise<React.JSX.Element> {
  // ✅ Primer render: Server-side, sin shimmer
  const session = await getServerSession(adminAuthOptions)

  // crear array de tipos de usuarios
  const adminTypes = ['admin', 'superadmin']

  // validar si el tipo de usuario esta dentro del array de tipos de usuarios
  if (session?.user != null && adminTypes.includes(session.user.type)) {
    return (
      <LayoutPageAdmin>
        <AdminDashboard user={session.user} />
      </LayoutPageAdmin>
    )
  }

  return <AdminClientWrapper />
}
