import 'next-auth'
import 'next-auth/jwt'

export interface AdminSection {
  id: number
  name: string
  url: string
  image?: string
  displayOrder?: number
  sectionGroup?: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      image?: string
      email: string
      type: string
      roleName?: string
      roleId?: number
      sections?: AdminSection[]
    }
  }

  interface User {
    id: string
    name: string
    image?: string
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
