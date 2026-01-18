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

  public async getUsersWithRoles(): Promise<any[] | null> {
    const users = await executeQuery<any[]>({
      query: `
        SELECT
          u.id,
          u.name,
          u.lastname,
          u.email,
          u.is_active,
          u.role_id,
          u.photo,
          u.created_at,
          u.updated_at,
          r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY u.created_at DESC
      `
    })

    if (users.length === 0) return null
    return users
  }

  public async getUserWithRoleById(id: number): Promise<any | null> {
    const users = await executeQuery<any[]>({
      query: `
        SELECT
          u.id,
          u.name,
          u.lastname,
          u.email,
          u.is_active,
          u.role_id,
          u.photo,
          u.created_at,
          u.updated_at,
          r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `,
      values: [id]
    })

    if (users.length === 0) return null
    return users[0]
  }

  // Password setup tokens
  public async createPasswordSetupToken(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<number> {
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO password_setup_tokens (user_id, token, expires_at)
        VALUES (?, ?, ?)
      `,
      values: [userId, token, expiresAt]
    })
    return result.insertId
  }

  public async getPasswordSetupToken(token: string): Promise<any | null> {
    const tokens = await executeQuery<any[]>({
      query: `
        SELECT pst.*, u.email, u.name
        FROM password_setup_tokens pst
        JOIN users u ON pst.user_id = u.id
        WHERE pst.token = ? AND pst.used_at IS NULL AND pst.expires_at > NOW()
      `,
      values: [token]
    })

    if (tokens.length === 0) return null
    return tokens[0]
  }

  public async markTokenAsUsed(token: string): Promise<void> {
    await executeQuery({
      query: 'UPDATE password_setup_tokens SET used_at = NOW() WHERE token = ?',
      values: [token]
    })
  }

  public async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await executeQuery({
      query: 'UPDATE users SET password = ? WHERE id = ?',
      values: [hashedPassword, userId]
    })
  }
}

const userRepository = new UserRepository()
export default userRepository
