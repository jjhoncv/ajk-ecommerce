import 'next-auth'
import { type DefaultSession } from 'next-auth'
import 'next-auth/jwt'

export interface AdminSection {
  id: number
  name: string
  url: string
  image?: string
  displayOrder?: number
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      type: string
      roleName?: string
      roleId?: number
      sections?: AdminSection[]
    } & Pick<DefaultSession['user'], 'image'>
  }

  interface User {
    id: string
    name: string
    email: string
    type: string
    roleName?: string
    roleId?: number
    sections?: AdminSection[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
    type: string
    roleName?: string
    roleId?: number
    sections?: AdminSection[]
  }
}
