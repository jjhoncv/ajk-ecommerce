import { adminAuthOptions } from '@/lib/auth/authAdmin'
import { StoreConfigView } from '@/module/shared/components/admin/StoreConfig'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { type JSX } from 'react'

export default async function SettingsPage(): Promise<JSX.Element> {
  const session = await getServerSession(adminAuthOptions)

  if (!session?.user) {
    redirect('/admin')
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Configuración de Tienda" />}
        subtitle="Configura la información general de tu tienda"
        breadcrumb={[{ label: 'Configuración' }]}
      >
        <StoreConfigView />
      </PageUI>
    </LayoutPageAdmin>
  )
}
