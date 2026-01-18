import { userModel, userRepository } from '@/module/users/core'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import emailService from '@/services/email'
import { type NextRequest } from 'next/server'

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const users = await userModel.getUsersWithRoles()

      return createResponse(
        {
          data: users ?? [],
          message: 'Usuarios obtenidos',
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
      const {
        name,
        lastname,
        email,
        roleId,
        isActive = true
      }: {
        name: string
        lastname: string
        email: string
        roleId: number
        isActive?: boolean
      } = await req.json()

      // Validaciones
      if (
        name === '' ||
        name == null ||
        lastname === '' ||
        lastname == null ||
        email === '' ||
        email == null
      ) {
        return createResponse(
          { error: 'Nombre, apellido y email son requeridos', success: false },
          400
        )
      }

      // Verificar si el email ya existe
      const existingUser = await userModel.getUserByEmail(email)
      if (existingUser != null) {
        return createResponse(
          { error: 'Ya existe un usuario con este email', success: false },
          400
        )
      }

      // Crear usuario con password temporal (será reemplazado)
      const tempPassword = 'TEMP_' + Date.now()
      const user = await userRepository.createUser({
        name,
        lastname,
        email,
        password: tempPassword, // Password temporal, se configurará via email
        role_id: roleId ?? 2,
        is_active: isActive ? 1 : 0
      })

      if (user == null) {
        return createResponse(
          { error: 'Error al crear el usuario', success: false },
          500
        )
      }

      // Crear token de configuración de password
      const token = await userModel.createPasswordSetupToken(user.id)

      // Enviar email con link para configurar password
      const emailSent = await emailService.sendPasswordSetupEmail(
        email,
        name,
        token
      )

      return createResponse(
        {
          data: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          message: emailSent
            ? 'Usuario creado. Se ha enviado un email para configurar la contraseña.'
            : 'Usuario creado. No se pudo enviar el email de configuración.',
          emailSent,
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
        lastname,
        email,
        roleId,
        isActive
      }: {
        id: number
        name?: string
        lastname?: string
        email?: string
        roleId?: number
        isActive?: boolean
      } = await req.json()

      if (id == null) {
        return createResponse(
          { error: 'ID es requerido', success: false },
          400
        )
      }

      // Verificar si el email ya existe en otro usuario
      if (email != null && email !== '') {
        const existingUser = await userModel.getUserByEmail(email)
        if (existingUser != null && existingUser.id !== id) {
          return createResponse(
            { error: 'Ya existe otro usuario con este email', success: false },
            400
          )
        }
      }

      // Construir objeto de actualización
      const updateData: Record<string, any> = {}
      if (name != null && name !== '') updateData.name = name
      if (lastname != null && lastname !== '') updateData.lastname = lastname
      if (email != null && email !== '') updateData.email = email
      if (roleId != null) updateData.role_id = roleId
      if (isActive != null) updateData.is_active = isActive ? 1 : 0

      const user = await userModel.updateUser(updateData, id)

      if (user == null) {
        return createResponse(
          { error: 'Error al actualizar el usuario', success: false },
          500
        )
      }

      return createResponse(
        {
          data: user,
          message: 'Usuario actualizado exitosamente',
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

      // Verificar que el usuario existe
      const user = await userModel.getUser(id)
      if (user == null) {
        return createResponse(
          { error: 'Usuario no encontrado', success: false },
          404
        )
      }

      // No permitir eliminar superadmins (role_id = 1)
      if (user.roleId === 1) {
        return createResponse(
          { error: 'No se pueden eliminar usuarios superadmin', success: false },
          403
        )
      }

      await userModel.deleteUser(id)

      return createResponse(
        {
          message: 'Usuario eliminado exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
