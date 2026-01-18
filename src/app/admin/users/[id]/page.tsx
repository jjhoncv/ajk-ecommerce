import { userModel } from '@/module/users/core'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { notFound } from 'next/navigation'
import { type JSX } from 'react'
import { UserForm } from '../UserForm'

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({
  params
}: EditUserPageProps): Promise<JSX.Element> {
  const { id } = await params
  const userId = parseInt(id)

  const user = await userModel.getUserWithRole(userId)
  if (user == null) {
    notFound()
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Usuario" />}
        subtitle={`Editando: ${user.name} ${user.lastname}`}
        breadcrumb={[
          { label: 'Usuarios', url: '/admin/users' },
          { label: `${user.name} ${user.lastname}` }
        ]}
      >
        <UserForm
          userId={userId}
          initialData={{
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            roleId: user.roleId,
            isActive: user.isActive
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
