'use client'

import { Button } from '@/module/shared/components/Form/Input/Button'
import { Input } from '@/module/shared/components/Form/Input/Input'
import { Select } from '@/module/shared/components/Form/Input/Select'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Info, Loader2, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type JSX, useEffect, useState } from 'react'

interface Role {
  id: number
  name: string
}

interface UserFormProps {
  userId?: number
  initialData?: {
    name: string
    lastname: string
    email: string
    roleId: number
    isActive: boolean
  }
}

export function UserForm({ userId, initialData }: UserFormProps): JSX.Element {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [lastname, setLastname] = useState(initialData?.lastname ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [roleId, setRoleId] = useState<number>(initialData?.roleId ?? 2)
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(true)

  useEffect(() => {
    const fetchRoles = async (): Promise<void> => {
      try {
        const response = await fetch('/api/admin/roles')
        const data = await response.json()
        if (data.success) {
          // Excluir superadmin de la lista de roles asignables
          setRoles(data.data.filter((r: Role) => r.id !== 1))
        }
      } catch (error) {
        ToastFail('Error al cargar los roles')
      } finally {
        setLoadingRoles(false)
      }
    }

    void fetchRoles()
  }, [])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (name.trim() === '' || lastname.trim() === '' || email.trim() === '') {
      ToastFail('Todos los campos son requeridos')
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      ToastFail('El email no es válido')
      return
    }

    setLoading(true)
    try {
      const message = await FetchCustomBody({
        data: {
          id: userId,
          name: name.trim(),
          lastname: lastname.trim(),
          email: email.trim().toLowerCase(),
          roleId,
          isActive
        },
        method: userId != null ? 'PATCH' : 'POST',
        url: '/api/admin/users'
      })
      ToastSuccess(message)
      router.push('/admin/users')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al guardar'
      ToastFail(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-6">
      {userId == null && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">
              Configuración de contraseña por email
            </p>
            <p className="mt-1 text-sm text-blue-700">
              Al crear el usuario, se enviará automáticamente un email con un
              enlace para que configure su contraseña. El enlace será válido por
              48 horas.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">
          Información Personal
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <Input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Apellido"
              className="bg-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="bg-white pl-10"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Rol y Permisos</h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Rol
          </label>
          {loadingRoles ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando roles...
            </div>
          ) : (
            <Select
              value={roleId.toString()}
              onChange={(e) => setRoleId(parseInt(e.target.value))}
              className="max-w-xs bg-white"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id.toString()}>
                  {role.name}
                </option>
              ))}
            </Select>
          )}
          <p className="mt-2 text-sm text-gray-500">
            El rol determina qué secciones puede ver el usuario
          </p>
        </div>

        {userId != null && (
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Usuario activo
              </span>
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Los usuarios inactivos no pueden iniciar sesión
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          outline
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || loadingRoles}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : userId != null ? (
            'Actualizar usuario'
          ) : (
            'Crear usuario'
          )}
        </Button>
      </div>
    </form>
  )
}
