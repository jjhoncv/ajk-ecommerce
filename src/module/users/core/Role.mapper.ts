import { type Roles as RoleRaw } from '@/types/database'
import { type Roles as Role } from '@/types/domain'

export const RoleMapper = (data: RoleRaw): Role => {
  return {
    id: data.id,
    name: data.name,
    rolesSections: undefined,
    user: undefined
  }
}

export const RolesMapper = (data: RoleRaw[] | null): Role[] | undefined => {
  if (data === null) return undefined
  return data.map(RoleMapper)
}
