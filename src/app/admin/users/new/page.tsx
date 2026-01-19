import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'
import { UserForm } from '@/module/users/components/admin'

export default async function NewUserPage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo Usuario" />}
        subtitle="Crear un nuevo usuario del sistema"
        breadcrumb={[
          { label: 'Usuarios', url: '/admin/users' },
          { label: 'Nuevo' }
        ]}
      >
        <UserForm />
      </PageUI>
    </LayoutPageAdmin>
  )
}
