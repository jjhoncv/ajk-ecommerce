// app/account/change-password/page.tsx
import { AccountLayout, ChangePassword } from '@/module/profile/components'
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function ChangePasswordPage() {
  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions)

  // Si no hay sesión, redirigir al inicio
  if (!session) {
    redirect('/')
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="p-0">
        <AccountLayout userName={session.user?.name || ''}>
          <ChangePassword />
        </AccountLayout>
      </LayoutContent>
    </Layout>
  )
}
