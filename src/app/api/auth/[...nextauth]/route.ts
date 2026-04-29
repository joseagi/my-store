import dns from 'dns'
// Force IPv4 — prevents OAuth timeout on Windows
dns.setDefaultResultOrder('ipv4first')

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000, // 10 seconds timeout for Google auth requests
      },
    }),
  ],
  callbacks: {
    // Attach id and role to every session so components can read them
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as { role?: string }).role ?? 'CUSTOMER'
      }
      return session
    },
  },
  pages: {
    signIn: '/login',      // Custom login page (you'll build this below)
    error: '/login',       // Auth errors redirect here too
  },
   // Add this — exposes full error details
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('[NextAuth Error]', code, metadata)
    },
    warn(code) {
      console.warn('[NextAuth Warn]', code)
    },
    debug(code, metadata) {
      console.log('[NextAuth Debug]', code, metadata)
    },
  },
}


const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }