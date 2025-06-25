import roleModel from '@/backend/role'
import sectionModel from '@/backend/section'
import userModel from '@/backend/user'
import { type Users as User } from '@/types/domain'
import bcrypt from 'bcryptjs'

/**
 * Autenticar un cliente con email y contraseña
 */

interface loginProps {
  email: string
  password: string
}

export const login = async ({
  email,
  password: plainPassword
}: loginProps): Promise<User | null> => {
  try {
    // Obtener el user por email
    const user = await userModel.getUserByEmail(email)

    // Si no existe el user, retornar null
    if (user === undefined) return null

    // Verificar la contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password)
    if (!isPasswordValid) return null

    // Obtener el user completo con sus roles
    const validUser = await userModel.getUser(user.id)
    if (validUser === undefined) return null

    // No devolver la contraseña
    const { password, ...UserWithoutPassword } = validUser

    const sections = await sectionModel.getSectionsByRole(validUser.id)
    validUser.role = {
      id: Number(validUser.roleId),
      name: (await roleModel.getRole(Number(validUser.roleId)))?.name ?? '',
      rolesSections: sections
    }

    return UserWithoutPassword as User
  } catch (error) {
    console.error('Error en login:', error)
    return null
  }
}
