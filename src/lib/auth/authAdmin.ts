// lib/auth/admin-auth.ts
import UserService from '@/services/user'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const adminAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.email == null || credentials?.password == null) {
          return null
        }

        try {
          const user = await UserService.login(credentials)

          if (user != null) {
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name, // ← Cambié a 'name' para consistencia con NextAuth
              type: 'admin',
              // Agregar campos que comentaste si los tienes en user
              role: user.role?.name ?? undefined, // Asumiendo que Roles tiene una propiedad 'name'
              roleId: user.roleId ?? undefined,
              sections:
                user.role?.rolesSections?.filter(
                  (section) => section != null
                ) ?? undefined
            }
          }
        } catch (error) {
          console.error('Error en admin authorize:', error)
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/admin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id // ← Agregué esto que faltaba
        token.name = user.name // ← Agregué esto que faltaba
        token.type = user.type
        token.role = user.role
        token.roleId = user.roleId
        token.sections = user.sections
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name!
        session.user.type = token.type
        session.user.role = token.role
        session.user.roleId = token.roleId
        session.user.sections = token.sections as any[] | undefined
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  }
}
