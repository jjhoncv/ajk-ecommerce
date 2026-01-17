import userModel from '@/backend/user'
import {
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import bcrypt from 'bcryptjs'
import { type NextRequest } from 'next/server'

// GET: Validar si el token es válido
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (token == null || token === '') {
      return createResponse(
        { error: 'Token es requerido', success: false, valid: false },
        400
      )
    }

    const tokenData = await userModel.getPasswordSetupToken(token)

    if (tokenData == null) {
      return createResponse(
        {
          error: 'Token inválido o expirado',
          success: false,
          valid: false
        },
        400
      )
    }

    return createResponse(
      {
        data: {
          email: tokenData.email,
          name: tokenData.name
        },
        message: 'Token válido',
        success: true,
        valid: true
      },
      200
    )
  } catch (error: unknown) {
    return handleError(error, 400)
  }
}

// POST: Configurar la contraseña
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const {
      token,
      password
    }: { token: string; password: string } = await req.json()

    if (token == null || token === '' || password == null || password === '') {
      return createResponse(
        { error: 'Token y contraseña son requeridos', success: false },
        400
      )
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return createResponse(
        { error: 'La contraseña debe tener al menos 6 caracteres', success: false },
        400
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Configurar la contraseña
    const success = await userModel.setUserPassword(token, hashedPassword)

    if (!success) {
      return createResponse(
        { error: 'Token inválido o expirado', success: false },
        400
      )
    }

    return createResponse(
      {
        message: 'Contraseña configurada exitosamente. Ya puedes iniciar sesión.',
        success: true
      },
      200
    )
  } catch (error: unknown) {
    return handleError(error, 400)
  }
}
