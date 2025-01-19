// import NextAuth, { NextAuthConfig } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "@/prisma";
// import GoogleProvider from "next-auth/providers/google";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   pages: {
//     signIn: "/register",
//     error: "/auth-error",
//   },
//   adapter: PrismaAdapter(db),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//       authorization: {
//         params: {
//           scope:
//             "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],
//   secret: process.env.AUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async signIn({ account }) {
//       if (account && account?.scope) {
//         // Verify required scopes are present
//         const requiredScopes = [
//           "https://www.googleapis.com/auth/calendar",
//           "https://www.googleapis.com/auth/calendar.events",
//         ];

//         const hasRequiredScopes = requiredScopes.every((scope) =>
//           account?.scope.split(" ").includes(scope)
//         );

//         if (!hasRequiredScopes) {
//           return "/reauth";
//         }
//       }
//       return true;
//     },
//     async session({ token, session }) {
//       if (token.sub && session.user) {
//         session.user.id = token.sub;
//       }
//       return session;
//     },
//   },
// } satisfies NextAuthConfig);

import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/prisma";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/register",
    error: "/auth-error",
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      if (!account) return true;

      const scope = account.scope;
      if (!scope) return true;

      const requiredScopes = [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ];

      const hasRequiredScopes = requiredScopes.every((requiredScope) =>
        scope.split(" ").includes(requiredScope)
      );

      if (!hasRequiredScopes) {
        return "/reauth";
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
} satisfies NextAuthConfig);
