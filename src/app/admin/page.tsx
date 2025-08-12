import AdminClientWrapper from '@/components/admin/AdminClientWrapper'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
// import { adminAuthOptions } from '@/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'

export default async function AdminPage() {
  // ✅ Primer render: Server-side, sin shimmer
  const session = await getServerSession(adminAuthOptions)

  // crear array de tipos de usuarios
  const adminTypes = ['admin', 'superadmin']

  // validar si el tipo de usuario esta dentro del array de tipos de usuarios
  if (session?.user && adminTypes.includes(session.user.type)) {
    return (
      <>
        <LayoutPageAdmin user={session.user}></LayoutPageAdmin>
      </>
    )
    // return <AdminDashboard user={session.user} />
  }

  return <AdminClientWrapper />
}
