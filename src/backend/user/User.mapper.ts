import { type Users as UserRaw } from '@/types/database'
import { type Users as User } from '@/types/domain'

export const UserMapper = (data: UserRaw): User => {
  return {
    id: data.id,
    lastname: data.lastname,
    name: data.name,
    email: data.email,
    password: data.password,
    photo: data.photo,
    isActive: data.is_active,
    roleId: data.role_id,
    role: undefined
  }
}

export const UsersMapper = (data: UserRaw[] | null): User[] | undefined => {
  if (data === null) return undefined
  return data.map(UserMapper)
}
