import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'
import { RolesManager } from '@/module/users/components/admin'

export default async function RolesPage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Roles" />}
        subtitle="Gestión de roles y permisos"
        breadcrumb={[{ label: 'Roles' }]}
        options={<PageButton href="/admin/roles/new">Nuevo rol</PageButton>}
      >
        <RolesManager />
      </PageUI>
    </LayoutPageAdmin>
  )
}
