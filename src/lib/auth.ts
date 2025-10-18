import { PrismaAdapter } from "@auth/prisma-adapter"
import type { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

// Import prisma lazily to avoid build-time issues
let prismaInstance: PrismaClient | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { prisma } = require("@/lib/prisma");
  prismaInstance = prisma as PrismaClient;
} catch {
  // Prisma not available during build, use a dummy adapter
  prismaInstance = null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: prismaInstance ? PrismaAdapter(prismaInstance) : undefined,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'fallback-secret-for-build',
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: "/auth/new-user",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!prismaInstance) {
          throw new Error("Database not available")
        }
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prismaInstance.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            profile: true,
          },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        // Update last login
        await prismaInstance.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile: _profile }) {
      if (!prismaInstance) {
        return true; // Allow sign in during build
      }
      
      // Auto-create profile on first sign in
      if (user.id) {
        const existingProfile = await prismaInstance.profile.findUnique({
          where: { userId: user.id },
        })

        if (!existingProfile) {
          await prismaInstance.profile.create({
            data: {
              userId: user.id,
              isVerified: account?.provider === "google", // Auto-verify OAuth users
              verifiedAt: account?.provider === "google" ? new Date() : null,
              verificationType: account?.provider || "email",
            },
          })
        }

        // Update last login
        await prismaInstance.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
})
