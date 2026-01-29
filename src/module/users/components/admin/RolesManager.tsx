'use client'

import { CardContent } from '@/module/shared/components/CardContent/CardContent'
import { CardsSkeleton } from '@/module/shared/components/Table/TableSkeleton'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Edit2, Shield, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type JSX, useEffect, useState } from 'react'

interface Section {
  id: number
  name: string
  url: string
}

interface Role {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  sections: Section[]
}

export function RolesManager(): JSX.Element {
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchRoles = async (): Promise<void> => {
    try {
      const response = await fetch('/api/admin/roles')
      const data = await response.json()
      if (data.success) {
        setRoles(data.data)
      }
    } catch (error) {
      ToastFail('Error al cargar los roles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchRoles()
  }, [])

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm('¿Estás seguro de eliminar este rol?')) return

    setDeleting(id)
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: '/api/admin/roles'
      })
      ToastSuccess(message)
      void fetchRoles()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al eliminar el rol'
      ToastFail(errorMessage)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <CardsSkeleton />
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <CardContent key={role.id} className="!p-0">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">
                    {role.sections.length} secciones asignadas
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Link
                  href={`/admin/roles/${role.id}`}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  title={role.id <= 2 ? 'Editar secciones' : 'Editar rol'}
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                {role.id > 2 && (
                  <button
                    onClick={() => void handleDelete(role.id)}
                    disabled={deleting === role.id}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Eliminar rol"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {role.sections.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                  Secciones
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.sections.map((section) => (
                    <span
                      key={section.id}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {section.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {role.id <= 2 && (
              <div className="mt-4">
                <span className="text-xs text-amber-600">
                  Rol del sistema (solo se pueden editar secciones)
                </span>
              </div>
            )}
          </div>
        </CardContent>
      ))}

      {roles.length === 0 && (
        <div className="col-span-full py-12 text-center text-gray-500">
          No hay roles creados
        </div>
      )}
    </div>
  )
}
