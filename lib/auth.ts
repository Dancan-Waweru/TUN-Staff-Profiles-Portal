import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true }
        })
        session.user.role = dbUser?.role || 'STAFF'
        session.user.hasProfile = !!dbUser?.profile
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        console.log('SignIn callback:', { user: user.email, provider: account?.provider })
        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return true
      }
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      try {
        console.log('SignIn event:', { user: user.email, isNewUser })
        if (account?.provider === 'google' && user.email === process.env.ADMIN_EMAIL) {
          await prisma.user.update({
            where: { email: user.email! },
            data: { role: 'ADMIN' }
          })
          console.log('Admin role assigned to:', user.email)
        }
      } catch (error) {
        console.error('SignIn event error:', error)
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'database'
  },
  debug: process.env.NODE_ENV === 'development'
}