import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        position: true,
        department: true,
        faculty: true,
        slug: true,
        profileImage: true,
      },
      orderBy: { lastName: 'asc' }
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Staff fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff profiles' },
      { status: 500 }
    )
  }
}