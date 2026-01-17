import userModel from '@/backend/user'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import emailService from '@/services/email'
import { type NextRequest } from 'next/server'

export async function POST(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const { userId }: { userId: number } = await req.json()

      if (userId == null) {
        return createResponse(
          { error: 'ID de usuario es requerido', success: false },
          400
        )
      }

      const user = await userModel.getUser(userId)
      if (user == null) {
        return createResponse(
          { error: 'Usuario no encontrado', success: false },
          404
        )
      }

      // Crear nuevo token
      const token = await userModel.createPasswordSetupToken(userId)

      // Enviar email
      const emailSent = await emailService.sendPasswordSetupEmail(
        user.email,
        user.name,
        token
      )

      if (!emailSent) {
        return createResponse(
          { error: 'No se pudo enviar el email', success: false },
          500
        )
      }

      return createResponse(
        {
          message: 'Email de configuración reenviado exitosamente',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
