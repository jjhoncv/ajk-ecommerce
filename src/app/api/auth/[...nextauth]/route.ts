import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CustomerService } from "@/services/customerService";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Usar el servicio de cliente para autenticar
          const customerService = new CustomerService();
          const customer = await customerService.login(
            credentials.email,
            credentials.password
          );

          if (customer) {
            return {
              id: customer.id,
              email: customer.email,
              name: customer.name,
            };
          }
        } catch (error) {
          console.error("Error en authorize:", error);
        }

        // Credenciales inválidas
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/", // No redirigimos a una página específica, usamos un modal
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
