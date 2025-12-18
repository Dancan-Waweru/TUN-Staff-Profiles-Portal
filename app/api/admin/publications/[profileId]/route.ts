import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const publications = await prisma.publication.findMany({
      where: { profileId: params.profileId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(publications)
  } catch (error) {
    console.error('Admin publications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, authors, url, year } = await request.json()

    if (!title || !authors) {
      return NextResponse.json({ error: 'Title and authors are required' }, { status: 400 })
    }

    const publication = await prisma.publication.create({
      data: {
        title,
        authors,
        url: url || null,
        year: year ? parseInt(year) : null,
        profileId: params.profileId,
      },
    })

    return NextResponse.json(publication)
  } catch (error) {
    console.error('Admin publication creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create publication' },
      { status: 500 }
    )
  }
}