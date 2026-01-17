import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'
import { RoleForm } from '../RoleForm'

export default async function NewRolePage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo Rol" />}
        subtitle="Crear un nuevo rol con permisos"
        breadcrumb={[
          { label: 'Roles', url: '/admin/roles' },
          { label: 'Nuevo' }
        ]}
      >
        <RoleForm />
      </PageUI>
    </LayoutPageAdmin>
  )
}
