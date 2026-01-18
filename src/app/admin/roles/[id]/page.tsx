import { roleModel, sectionModel } from '@/module/users/core'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { notFound } from 'next/navigation'
import { type JSX } from 'react'
import { RoleForm } from '../RoleForm'

interface EditRolePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRolePage({
  params
}: EditRolePageProps): Promise<JSX.Element> {
  const { id } = await params
  const roleId = parseInt(id)

  // No permitir editar roles del sistema
  if (roleId <= 2) {
    notFound()
  }

  const role = await roleModel.getRole(roleId)
  if (role == null) {
    notFound()
  }

  const sections = await sectionModel.getSectionsByRole(roleId)
  const sectionIds = sections?.map((s) => s.id) ?? []

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Rol" />}
        subtitle={`Editando: ${role.name}`}
        breadcrumb={[
          { label: 'Roles', url: '/admin/roles' },
          { label: role.name }
        ]}
      >
        <RoleForm
          roleId={roleId}
          initialData={{
            name: role.name,
            sectionIds
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
