import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role: "ADMIN" | "USER";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        console.log("EMAIL:", email);
        console.log("PASSWORD:", password);
        console.log("DB USER:", user);
        if (!user) return null;

        if (user.password !== password) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    authorized({ request, auth }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isAdminPage = nextUrl.pathname.startsWith("/admin");
      const isUserPage =
        nextUrl.pathname.startsWith("/quotation") ||
        nextUrl.pathname.startsWith("/order");

      if (isAdminPage) {
        if (!isLoggedIn) {
          return false; // Redirect to login
        }
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (isUserPage) {
        if (!isLoggedIn) {
          return false; // Redirect to login
        }
        return true;
      }

      if ((nextUrl.pathname === "/login" || nextUrl.pathname === "/signup") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});