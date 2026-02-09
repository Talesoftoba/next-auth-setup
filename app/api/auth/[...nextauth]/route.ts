import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/app/lib/db";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        console.log("User authorize result:",user)

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return user object for NextAuth
        return { id: user.id, email: user.email };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // This is the JWT callback (already in your code)
    async jwt({ token, user }) {
      console.log("JWT token:",token, "user:", user)
      if (user) token.id = user.id; // attach user.id to the JWT token
      return token;
    },

    // <-- Insert session callback here
    async session({ session, token }) {
      // Attach the user ID from JWT to the session object
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },

    // Optional: signIn callback for Google users
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await db.user.findUnique({ where: { email: user.email! } });
        if (!existing) {
          await db.user.create({
            data: {
              email: user.email!,
              name: user.name,
            },
          });
        }
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };

