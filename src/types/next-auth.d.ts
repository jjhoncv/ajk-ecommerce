import { type DefaultSession, type DefaultUser } from 'next-auth'
import 'next-auth/jwt'

// Tipos específicos
interface AdminSection {
  id: number
  name: string
  url: string
  image?: string
}

interface AdminUser {
  id: string
  type: 'admin'
  role: string
  roleId: number
  sections: AdminSection[]
}

interface CustomerUser {
  id: string
  type: 'customer'
}

type AppUser = AdminUser | CustomerUser

declare module 'next-auth' {
  interface Session {
    user: AppUser & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    type: 'admin' | 'customer'
    role?: string
    roleId?: number
    sections?: AdminSection[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    type: 'admin' | 'customer'
    role?: string
    roleId?: number
    sections?: AdminSection[]
  }
}
