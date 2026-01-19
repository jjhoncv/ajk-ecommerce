import { type Users as UserRaw } from '@/types/database'
import { type Users as User } from '@/types/domain'
import { v4 as uuidv4 } from 'uuid'

import { UserMapper, UsersMapper } from './User.mapper'
import oUserRep from './User.repository'

export interface UserWithRole {
  id: number
  name: string
  lastname: string
  email: string
  isActive: boolean
  roleId: number
  roleName: string
  photo: string | null
  createdAt: Date
  updatedAt: Date
}

export class UserModel {
  public async getUserByEmail(email: string): Promise<User | undefined> {
    const userRaw = await oUserRep.getUserByEmail(email)
    if (userRaw == null) return undefined
    return UserMapper(userRaw)
  }

  public async getUsers(): Promise<User[] | undefined> {
    const usersRaw = await oUserRep.getUsers()
    return UsersMapper(usersRaw)
  }

  public async getUsersWithRoles(): Promise<UserWithRole[] | undefined> {
    const usersRaw = await oUserRep.getUsersWithRoles()
    if (usersRaw == null) return undefined
    return usersRaw.map((u) => ({
      id: u.id,
      name: u.name,
      lastname: u.lastname,
      email: u.email,
      isActive: Boolean(u.is_active),
      roleId: u.role_id,
      roleName: u.role_name,
      photo: u.photo,
      createdAt: u.created_at,
      updatedAt: u.updated_at
    }))
  }

  public async getUser(id: number): Promise<User | undefined> {
    const userRaw = await oUserRep.getUser(id)
    if (userRaw == null) return undefined
    return UserMapper(userRaw)
  }

  // Obtener nombre completo del usuario por ID (para auditoría)
  public async getUserFullName(id: number): Promise<string | null> {
    const userRaw = await oUserRep.getUser(id)
    if (userRaw == null) return null
    return `${userRaw.name} ${userRaw.lastname}`
  }

  public async getUserWithRole(id: number): Promise<UserWithRole | undefined> {
    const userRaw = await oUserRep.getUserWithRoleById(id)
    if (userRaw == null) return undefined
    return {
      id: userRaw.id,
      name: userRaw.name,
      lastname: userRaw.lastname,
      email: userRaw.email,
      isActive: Boolean(userRaw.is_active),
      roleId: userRaw.role_id,
      roleName: userRaw.role_name,
      photo: userRaw.photo,
      createdAt: userRaw.created_at,
      updatedAt: userRaw.updated_at
    }
  }

  public async createUser(
    UserData: Omit<User, 'id' | 'photo' | 'role' | 'photo'>
  ): Promise<User | undefined> {
    const created = await oUserRep.createUser(UserData)
    if (created == null) return undefined
    return UserMapper(created)
  }

  public async updateUser(
    UserData: Partial<UserRaw>,
    id: number
  ): Promise<User | undefined> {
    const updated = await oUserRep.updateUser(UserData, id)
    if (updated == null) return undefined
    return UserMapper(updated)
  }

  public async deleteUser(id: number): Promise<void> {
    await oUserRep.deleteUser(id)
  }

  // Password setup token methods
  public async createPasswordSetupToken(userId: number): Promise<string> {
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48) // Token válido por 48 horas

    await oUserRep.createPasswordSetupToken(userId, token, expiresAt)
    return token
  }

  public async getPasswordSetupToken(token: string): Promise<any | undefined> {
    const tokenData = await oUserRep.getPasswordSetupToken(token)
    if (tokenData == null) return undefined
    return tokenData
  }

  public async setUserPassword(
    token: string,
    hashedPassword: string
  ): Promise<boolean> {
    const tokenData = await oUserRep.getPasswordSetupToken(token)
    if (tokenData == null) return false

    await oUserRep.updateUserPassword(tokenData.user_id, hashedPassword)
    await oUserRep.markTokenAsUsed(token)
    return true
  }
}

const userModel = new UserModel()
export default userModel
