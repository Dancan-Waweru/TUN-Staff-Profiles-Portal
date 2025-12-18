import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user's profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get publications separately
    const publications = await (prisma as any).publication.findMany({
      where: { profileId: user.profile.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(publications)
  } catch (error) {
    console.error('Publications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Publication POST request received')
    const session = await getServerSession(authOptions)
    console.log('Session:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('No session or email')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user's profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user?.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { title, authors, url, year } = await request.json()
    console.log('Publication data:', { title, authors, url, year })

    if (!title || !authors) {
      console.log('Missing title or authors')
      return NextResponse.json({ error: 'Title and authors are required' }, { status: 400 })
    }

    console.log('Creating publication for profile:', user.profile.id)
    const publication = await (prisma as any).publication.create({
      data: {
        title,
        authors,
        url: url || null,
        year: year ? parseInt(year) : null,
        profileId: user.profile.id,
      },
    })

    console.log('Publication created:', publication.id)
    return NextResponse.json(publication)
  } catch (error) {
    console.error('Publication creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create publication' },
      { status: 500 }
    )
  }
}