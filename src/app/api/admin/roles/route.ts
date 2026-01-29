import { roleModel, sectionModel, sectionRepository } from '@/module/users/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { type NextRequest } from 'next/server'

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const roles = await roleModel.getRoles()

      // Para cada rol, obtener sus secciones
      const rolesWithSections = await Promise.all(
        (roles ?? []).map(async (role) => {
          const sections = await sectionModel.getSectionsByRole(role.id)
          return {
            ...role,
            sections: sections ?? []
          }
        })
      )

      return createResponse(
        {
          data: rolesWithSections,
          message: 'Roles obtenidos',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function POST(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const { name, sectionIds }: { name: string; sectionIds: number[] } =
        await req.json()

      if (name === '' || name == null) {
        return createResponse(
          { error: 'El nombre es requerido', success: false },
          400
        )
      }

      // Crear el rol
      const role = await roleModel.createRole({ name })

      if (role == null) {
        return createResponse(
          { error: 'Error al crear el rol', success: false },
          500
        )
      }

      // Asignar secciones al rol
      if (sectionIds != null && sectionIds.length > 0) {
        await Promise.all(
          sectionIds.map(async (sectionId) => {
            await sectionRepository.addRoleSection(role.id, sectionId)
          })
        )
      }

      return createResponse(
        {
          data: role,
          message: 'Rol creado exitosamente',
          success: true
        },
        201
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function PATCH(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const {
        id,
        name,
        sectionIds
      }: { id: number; name?: string; sectionIds: number[] } = await req.json()

      if (id == null) {
        return createResponse(
          { error: 'ID es requerido', success: false },
          400
        )
      }

      // Para roles del sistema (id <= 2), solo permitir actualizar secciones
      const isSystemRole = id <= 2

      if (!isSystemRole) {
        // Para roles normales, el nombre es requerido
        if (name === '' || name == null) {
          return createResponse(
            { error: 'El nombre es requerido', success: false },
            400
          )
        }

        // Actualizar el nombre del rol
        const role = await roleModel.updateRole({ name }, id)

        if (role == null) {
          return createResponse(
            { error: 'Error al actualizar el rol', success: false },
            500
          )
        }
      }

      // Actualizar secciones: eliminar todas y agregar las nuevas
      await sectionRepository.removeAllSectionsByRole(id)

      if (sectionIds != null && sectionIds.length > 0) {
        await Promise.all(
          sectionIds.map(async (sectionId) => {
            await sectionRepository.addRoleSection(id, sectionId)
          })
        )
      }

      // Obtener el rol actualizado
      const updatedRole = await roleModel.getRole(id)

      return createResponse(
        {
          data: updatedRole,
          message: isSystemRole
            ? 'Secciones del rol actualizadas exitosamente'
            : 'Rol actualizado exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function DELETE(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const { id }: { id: number } = await req.json()

      if (id == null) {
        return createResponse(
          { error: 'ID es requerido', success: false },
          400
        )
      }

      // No permitir eliminar roles del sistema (1 = superadmin, 2 = admin)
      if (id === 1 || id === 2) {
        return createResponse(
          { error: 'No se pueden eliminar los roles del sistema', success: false },
          403
        )
      }

      await roleModel.deleteRole(id)

      return createResponse(
        {
          message: 'Rol eliminado exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
