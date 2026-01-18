'use client'

import { type UserWithRole } from '@/module/users/core'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { EditAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Mail, Shield, Trash2, UserCheck, UserX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, type JSX } from 'react'

interface UsersManagerProps {
  users: UserWithRole[]
}

export const UsersManager: FC<UsersManagerProps> = ({ users }): JSX.Element => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Usuario',
      priority: 'high',
      sortable: true,
      searchable: true,
      render: (_: string, item: Record<string, unknown>) => {
        const user = item as unknown as UserWithRole
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {user.name.charAt(0).toUpperCase()}
              {user.lastname.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user.name} {user.lastname}
              </p>
            </div>
          </div>
        )
      },
      width: '200px'
    },
    {
      key: 'email',
      label: 'Email',
      priority: 'high',
      sortable: true,
      searchable: true,
      render: (email: string) => (
        <span className="text-sm text-gray-600">{email}</span>
      ),
      width: '200px'
    },
    {
      key: 'roleName',
      label: 'Rol',
      priority: 'medium',
      sortable: true,
      render: (roleName: string) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">{roleName ?? 'Sin rol'}</span>
        </div>
      ),
      width: '150px'
    },
    {
      key: 'isActive',
      label: 'Estado',
      priority: 'high',
      sortable: true,
      render: (isActive: boolean) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {isActive ? (
            <>
              <UserCheck className="h-3 w-3" />
              Activo
            </>
          ) : (
            <>
              <UserX className="h-3 w-3" />
              Inactivo
            </>
          )}
        </span>
      ),
      width: '120px'
    }
  ]

  const handleRemoveUser = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id: parseInt(id) },
        method: 'DELETE',
        url: '/api/admin/users'
      })

      ToastSuccess(message)
      router.push('/admin/users')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al eliminar'
      ToastFail(errorMessage)
    }
  }

  const handleToggleActive = async (
    id: number,
    currentActive: boolean
  ): Promise<void> => {
    try {
      const message = await FetchCustomBody({
        data: { id, isActive: !currentActive },
        method: 'PATCH',
        url: '/api/admin/users'
      })
      ToastSuccess(message)
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar'
      ToastFail(errorMessage)
    }
  }

  const handleResendEmail = async (userId: number): Promise<void> => {
    try {
      const message = await FetchCustomBody({
        data: { userId },
        method: 'POST',
        url: '/api/admin/users/resend-setup-email'
      })
      ToastSuccess(message)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al enviar email'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar este usuario?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemoveUser(id)
        }}
        onCancel={() => {
          router.replace('/admin/users')
        }}
      />
      <DynamicTable
        columns={columns}
        data={users}
        renderActions={(id: string) => {
          const user = users.find((u) => u.id === parseInt(id))
          if (!user) return null

          return (
            <>
              <EditAction id={id} baseURL="/admin/users" />
              <button
                onClick={() => void handleResendEmail(user.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                <Mail size={18} strokeWidth={1} />
                Reenviar email
              </button>
              <button
                onClick={() => void handleToggleActive(user.id, user.isActive)}
                className="flex w-full cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                {user.isActive ? (
                  <>
                    <UserX size={18} strokeWidth={1} />
                    Desactivar
                  </>
                ) : (
                  <>
                    <UserCheck size={18} strokeWidth={1} />
                    Activar
                  </>
                )}
              </button>
              {user.roleId !== 1 && (
                <div
                  onClick={(e) => {
                    e.preventDefault()
                    router.replace(`/admin/users?action=alert&id=${id}`)
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 size={18} strokeWidth={1} />
                  Eliminar
                </div>
              )}
            </>
          )
        }}
        enableSearch
        enablePagination
        enableSort
        enableReorder={false}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </>
  )
}
