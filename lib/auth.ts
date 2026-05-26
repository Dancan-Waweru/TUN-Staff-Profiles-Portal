import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);


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
            session.user.isApproved = dbUser.isApproved
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

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

       if (!dbUser) {

          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: isAdmin ? 'ADMIN' : 'STAFF',
              isApproved: isAdmin 
            }
          })

          if (!isAdmin) {

            try {
              const data = await resend.emails.send({
                from: 'Staff Portal <onboarding@resend.dev>',
                to: process.env.ADMIN_EMAIL!,
                subject: 'New Staff Registration',
                html: `
                  <div style="font-family: sans-serif; padding: 20px;">
                    <h2>New Registration</h2>
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <a href="${process.env.NEXTAUTH_URL}/admin" style="background: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                      Go to Admin Dashboard to Approve
                    </a>
                  </div>`
              })

            } catch (e) {

            }
            return '/auth/pending'
          }
        }

        if (dbUser && !dbUser.isApproved && !isAdmin) {

          return '/auth/pending'
        }


        return true 
      } catch (error) {

        return false
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