import { type Roles as RoleRaw } from '@/types/database'
import { type Roles as Role } from '@/types/domain'

import { RoleMapper, RolesMapper } from './Role.mapper'
import oRoleRep from './Role.repository'

export class RoleModel {
  public async getRoles(): Promise<Role[] | undefined> {
    const data = await oRoleRep.getRoles()
    return RolesMapper(data)
  }

  public async getRole(id: number): Promise<Role | undefined> {
    const data = await oRoleRep.getRole(id)
    if (data == null) return undefined
    return RoleMapper(data)
  }

  public async createRole(data: Omit<Role, 'id'>): Promise<Role | undefined> {
    const created = await oRoleRep.createRole(data)
    if (created == null) return undefined
    return RoleMapper(created)
  }

  public async updateRole(
    data: Partial<RoleRaw>,
    id: number
  ): Promise<Role | undefined> {
    const updated = await oRoleRep.updateRole(data, id)
    if (updated == null) return undefined
    return RoleMapper(updated)
  }

  public async deleteRole(id: number): Promise<void> {
    await oRoleRep.deleteRole(id)
  }
}

const roleModel = new RoleModel()
export default roleModel
