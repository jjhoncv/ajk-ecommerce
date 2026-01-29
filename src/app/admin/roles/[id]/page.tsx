import { roleModel, sectionModel } from '@/module/users/core'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { notFound } from 'next/navigation'
import { type JSX } from 'react'
import { RoleForm } from '@/module/users/components/admin'

interface EditRolePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRolePage({
  params
}: EditRolePageProps): Promise<JSX.Element> {
  const { id } = await params
  const roleId = parseInt(id)

  const role = await roleModel.getRole(roleId)
  if (role == null) {
    notFound()
  }

  const sections = await sectionModel.getSectionsByRole(roleId)
  const sectionIds = sections?.map((s) => s.id) ?? []

  // Roles del sistema (id <= 2) solo pueden editar secciones
  const isSystemRole = roleId <= 2

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title={isSystemRole ? 'Editar Secciones' : 'Editar Rol'} />}
        subtitle={`${isSystemRole ? 'Configurando secciones de' : 'Editando'}: ${role.name}`}
        breadcrumb={[
          { label: 'Roles', url: '/admin/roles' },
          { label: role.name }
        ]}
      >
        <RoleForm
          roleId={roleId}
          isSystemRole={isSystemRole}
          initialData={{
            name: role.name,
            sectionIds
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
