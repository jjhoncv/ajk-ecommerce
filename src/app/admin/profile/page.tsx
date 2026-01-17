import { adminAuthOptions } from '@/lib/auth/authAdmin'
import { ProfileView } from '@/module/profile/components/admin/ProfileView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { type JSX } from 'react'

export default async function ProfilePage(): Promise<JSX.Element> {
  const session = await getServerSession(adminAuthOptions)

  if (!session?.user) {
    redirect('/admin')
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Mi Perfil" />}
        subtitle="Gestiona tu información personal"
        breadcrumb={[{ label: 'Perfil' }]}
      >
        <ProfileView userId={Number(session.user.id)} />
      </PageUI>
    </LayoutPageAdmin>
  )
}
