import { executeQuery } from '@/lib/db'
import { type Roles as RoleRaw } from '@/types/database'

export class RoleRepository {
  public async getRoles(): Promise<RoleRaw[] | null> {
    const data = await executeQuery<RoleRaw[]>({
      query: 'SELECT * FROM roles'
    })

    if (data.length === 0) return null
    return data
  }

  public async getRole(id: number): Promise<RoleRaw | null> {
    const data = await executeQuery<RoleRaw[]>({
      query: 'SELECT * FROM roles WHERE id = ?',
      values: [id]
    })

    if (data.length === 0) return null
    return data[0]
  }

  public async createRole(
    data: Omit<RoleRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<RoleRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO Roles SET ?',
      values: [data]
    })

    return await this.getRole(result.insertId)
  }

  public async updateRole(
    data: Partial<RoleRaw>,
    id: number
  ): Promise<RoleRaw | null> {
    await executeQuery({
      query: 'UPDATE Roles SET ? WHERE id=?',
      values: [data, id]
    })

    return await this.getRole(id)
  }

  public async deleteRole(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM roles WHERE id=?',
      values: [id]
    })
  }
}

const roleRepository = new RoleRepository()
export default roleRepository
