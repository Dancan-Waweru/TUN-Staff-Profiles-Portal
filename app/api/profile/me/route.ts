import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log('Profile/me session:', session?.user)
    
    if (!session?.user?.email) {
      console.log('No session or email in profile/me')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(user.profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}