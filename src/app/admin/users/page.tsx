import { userModel } from '@/module/users/core'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'
import { UsersManager } from './UsersManager'

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<JSX.Element> {
  const { q } = await searchParams

  let users
  if (q != null) {
    const allUsers = await userModel.getUsersWithRoles()
    users = allUsers?.filter(
      (u) =>
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.lastname.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase())
    )
  } else {
    users = await userModel.getUsersWithRoles()
  }

  if (!users || users.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Usuarios" />}
          subtitle="Gestión de usuarios del sistema"
          breadcrumb={[{ label: 'Usuarios' }]}
          options={<PageButton href="/admin/users/new">Nuevo usuario</PageButton>}
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay usuarios registrados</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Usuarios" />}
        subtitle="Gestión de usuarios del sistema"
        breadcrumb={[{ label: 'Usuarios' }]}
        options={<PageButton href="/admin/users/new">Nuevo usuario</PageButton>}
      >
        <UsersManager users={users} />
      </PageUI>
    </LayoutPageAdmin>
  )
}
