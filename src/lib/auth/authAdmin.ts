import { isProd } from '@/lib/utils'
import UserService from '@/module/users/services'
import { type AdminSection } from '@/types/next-auth'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const adminAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'admin-credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.email == null || credentials?.password == null) {
          return null
        }

        try {
          const admin = await UserService.login({
            email: credentials.email,
            password: credentials.password
          })

          if (admin != null) {
            return {
              id: admin.id.toString(),
              email: admin.email,
              name: admin.name,
              type: admin.role?.name ?? 'admin',
              roleName: admin.role?.name ?? 'admin',
              roleId: admin.roleId ?? 0,
              sections: admin?.role?.rolesSections as AdminSection[]
            }
          }
        } catch (error) {
          console.error('❌ Admin login error:', error)
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt' as const
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.type = user.type
        token.roleName = user.roleName
        token.roleId = user.roleId
        token.sections = user.sections
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.type = token.type
        session.user.roleName = token.roleName
        session.user.roleId = token.roleId
        session.user.sections = token.sections
      }
      return session
    }
  },
  pages: {
    signIn: '/admin'
  },
  cookies: {
    sessionToken: {
      name: isProd
        ? '__Secure-next-auth.session-token.admin'
        : 'next-auth.session-token.admin',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd
      }
    },
    callbackUrl: {
      name: isProd
        ? '__Secure-next-auth.callback-url.admin'
        : 'next-auth.callback-url.admin',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd
      }
    },
    csrfToken: {
      name: isProd
        ? '__Host-next-auth.csrf-token.admin'
        : 'next-auth.csrf-token.admin',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd
      }
    }
  }
}
