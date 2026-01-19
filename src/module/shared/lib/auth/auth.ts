import { isProd } from '@/lib/utils'
import CustomerService from '@/module/customers/services'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.email == null || credentials?.password == null) {
          return null
        }

        try {
          const customer = await CustomerService.login(credentials)

          if (customer != null) {
            return {
              id: customer.id.toString(),
              email: customer.email,
              name: customer.name,
              type: 'customer'
            }
          }
        } catch (error) {
          console.error('❌ Customer login error:', error)
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.type = user.type
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.type = token.type
      }
      return session
    }
  },
  session: {
    strategy: 'jwt' as const
  },
  cookies: {
    sessionToken: {
      name: isProd
        ? '__Secure-next-auth.session-token.customer'
        : 'next-auth.session-token.customer',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd
      }
    },
    callbackUrl: {
      name: isProd
        ? '__Secure-next-auth.callback-url.customer'
        : 'next-auth.callback-url.customer',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd
      }
    },
    csrfToken: {
      name: isProd
        ? '__Host-next-auth.csrf-token.customer'
        : 'next-auth.csrf-token.customer',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd
      }
    }
  }
}
