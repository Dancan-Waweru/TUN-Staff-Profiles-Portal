import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && session.user.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { profile: true }
          })
          
          if (dbUser) {
            session.user.id = dbUser.id
            session.user.role = dbUser.role as 'ADMIN' | 'STAFF'
            session.user.hasProfile = !!dbUser.profile
          } else {
            session.user.id = token?.sub || ''
            session.user.role = 'STAFF'
            session.user.hasProfile = false
          }
        } catch (error) {
          console.error('Session callback error:', error)
          session.user.id = token?.sub || ''
          session.user.role = 'STAFF'
          session.user.hasProfile = false
        }
      }
      return session
    },
    async signIn({ user, account }) {
      if (!user.email) return false
      
      try {
        console.log('SignIn callback:', { user: user.email, provider: account?.provider })
        
        if (account?.provider === 'google') {
          const isAdmin = user.email === process.env.ADMIN_EMAIL
          
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              image: user.image,
              role: isAdmin ? 'ADMIN' : 'STAFF'
            },
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: isAdmin ? 'ADMIN' : 'STAFF'
            }
          })
        }
        
        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return true
      }
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.role = user.email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'STAFF'
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false
}