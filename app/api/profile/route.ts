import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const data = await request.json()
    
    // Generate slug from name
    const slug = `${data.firstName}-${data.lastName}`.toLowerCase().replace(/\s+/g, '-')
    
    const profile = await prisma.profile.create({
      data: {
        ...data,
        userId: user.id,
        email: session.user.email,
        slug: slug,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Profile update session:', session?.user)
    
    if (!session?.user?.email) {
      console.log('No session or email for profile update')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log('User not found for email:', session.user.email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const data = await request.json()
    console.log('Profile update data:', Object.keys(data))
    
    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: data,
    })

    console.log('Profile updated successfully')
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}