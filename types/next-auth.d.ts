import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'ADMIN' | 'STAFF'
      hasProfile: boolean
      isApproved: boolean
    }
  }

 interface User {
  role: 'ADMIN' | 'STAFF'
  hasProfile: boolean
  isApproved: boolean 
}

}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'ADMIN' | 'STAFF'
    isApproved: boolean
    hasProfile: boolean
  }
}