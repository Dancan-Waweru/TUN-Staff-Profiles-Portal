import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'ADMIN' | 'STAFF'
      hasProfile: boolean
    }
  }

  interface User {
    role: 'ADMIN' | 'STAFF'
    hasProfile: boolean
  }
}