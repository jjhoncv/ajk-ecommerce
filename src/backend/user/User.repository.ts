import { executeQuery } from '@/lib/db'
import { type Users as UserRaw } from '@/types/database'

export class UserRepository {
  public async getUserByEmail(email: string): Promise<UserRaw | null> {
    const users = await executeQuery<UserRaw[]>({
      query: 'SELECT * FROM users WHERE email = ?',
      values: [email]
    })

    if (users.length === 0) return null
    return users[0]
  }

  public async getUserWithRole(email: string): Promise<any | null> {
    const users = await executeQuery<any[]>({
      query: `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.password,
          u.lastname,
          u.photo,
          u.is_active as isActive,
          u.created_at,
          u.role_id as roleId,
          r.id as role_id,
          r.name as role_name,
          r.created_at as role_created_at,
          r.updated_at as role_updated_at
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = ?
      `,
      values: [email]
    })

    if (users.length === 0) return null
    return users[0]
  }

  public async getUsers(): Promise<UserRaw[] | null> {
    const users = await executeQuery<UserRaw[]>({
      query: 'SELECT * FROM users'
    })

    if (users.length === 0) return null
    return users
  }

  public async getUser(id: number): Promise<UserRaw | null> {
    const users = await executeQuery<UserRaw[]>({
      query: 'SELECT * FROM users WHERE id = ?',
      values: [id]
    })

    if (users.length === 0) return null
    return users[0]
  }

  public async createUser(
    userData: Omit<
      UserRaw,
      'id' | 'created_at' | 'updated_at' | 'photo' | 'role' | 'photo'
    >
  ): Promise<UserRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO users SET ?',
      values: [userData]
    })

    return await this.getUser(result.insertId)
  }

  public async updateUser(
    userData: Partial<UserRaw>,
    id: number
  ): Promise<UserRaw | null> {
    await executeQuery({
      query: 'UPDATE users SET ? WHERE id=?',
      values: [userData, id]
    })

    return await this.getUser(id)
  }

  public async deleteUser(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM users WHERE id=?',
      values: [id]
    })
  }
}

const userRepository = new UserRepository()
export default userRepository
