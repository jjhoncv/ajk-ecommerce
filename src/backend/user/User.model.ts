import { type Users as UserRaw } from '@/types/database'
import { type Users as User } from '@/types/domain'

// me
import { UserMapper, UsersMapper } from './User.mapper'
import oUserRep from './User.repository'

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

  public async getUser(id: number): Promise<User | undefined> {
    const userRaw = await oUserRep.getUser(id)
    if (userRaw == null) return undefined
    return UserMapper(userRaw)
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
}

const userModel = new UserModel()
export default userModel
