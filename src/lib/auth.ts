import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Debug: Verificar que el secreto se está leyendo
console.log(
  "🔑 AUTH_SECRET longitud:",
  process.env.AUTH_SECRET?.length || "NO DEFINIDO",
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: unknown) => {
        const creds = credentials as { email?: string; password?: string };

        // 1. Si faltan datos, devolvemos null (NextAuth maneja esto como CredentialsSignin)
        if (!creds?.email || !creds?.password) {
          return null;
        }

        // 2. Buscar usuario
        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });

        // 3. Si no existe o no tiene contraseña, devolvemos null
        if (!user || !user.password) {
          return null;
        }

        // 4. Verificar contraseña
        const isValidPassword = await bcrypt.compare(
          creds.password,
          user.password,
        );

        // 5. Si no coincide, devolvemos null
        if (!isValidPassword) {
          return null;
        }

        // 6. Si todo está bien, devolvemos el usuario
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/ingresar",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
