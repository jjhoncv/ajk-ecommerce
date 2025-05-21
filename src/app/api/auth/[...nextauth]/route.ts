import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Credenciales demo
const DEMO_EMAIL = "usuario@ejemplo.com";
const DEMO_PASSWORD = "password123";

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

        // Verificar las credenciales demo
        if (
          credentials.email === DEMO_EMAIL &&
          credentials.password === DEMO_PASSWORD
        ) {
          return {
            id: "1",
            email: DEMO_EMAIL,
            name: "Usuario Demo",
          };
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
