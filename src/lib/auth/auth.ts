import { isProd } from '@/lib/utils'
import CustomerService from '@/module/customers/services'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ''
    }),
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
    async signIn({ user, account }) {
      // For OAuth providers, find or create the user in the database
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        if (!user.email) return false

        try {
          // Try to find or create customer with OAuth
          const customer = await CustomerService.findOrCreateByOAuth({
            email: user.email,
            name: user.name || '',
            provider: account.provider,
            providerId: account.providerAccountId
          })

          if (customer) {
            // Store the database ID in the user object for JWT callback
            user.id = customer.id.toString()
            user.type = 'customer'
            return true
          }
        } catch (error) {
          console.error('❌ OAuth sign in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.type = user.type || 'customer'
        if (account?.provider) {
          token.provider = account.provider
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
        session.user.email = token.email as string
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
