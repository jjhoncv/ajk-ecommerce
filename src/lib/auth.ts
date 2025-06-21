import CustomerService from '@/services/customer'
import NextAuth, { type NextAuthOptions } from 'next-auth'
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
          // Usar el servicio de cliente para autenticar
          const customer = await CustomerService.login(credentials)

          if (customer != null) {
            return {
              id: customer.id.toString(), // Asegurar que sea string
              email: customer.email,
              name: customer.name
            }
          }
        } catch (error) {
          console.error('Error en authorize:', error)
        }

        // Credenciales inválidas
        return null
      }
    })
  ],
  pages: {
    signIn: '/' // No redirigimos a una página específica, usamos un modal
  },
  callbacks: {
    async jwt({ token, user }) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (session.user) {
        session.user.id = token.id as string
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        session.user.name = token.name!
      }
      return session
    }
  },
  session: {
    strategy: 'jwt' as const
  }
}

export default NextAuth(authOptions)
