import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if publication belongs to user
    const existingPublication = await prisma.publication.findUnique({
      where: { id: params.id }
    })

    if (!existingPublication || existingPublication.profileId !== user.profile.id) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    const { title, authors, url, year } = await request.json()

    if (!title || !authors) {
      return NextResponse.json({ error: 'Title and authors are required' }, { status: 400 })
    }

    const publication = await prisma.publication.update({
      where: { id: params.id },
      data: {
        title,
        authors,
        url: url || null,
        year: year ? parseInt(year) : null,
      },
    })

    return NextResponse.json(publication)
  } catch (error) {
    console.error('Publication update error:', error)
    return NextResponse.json(
      { error: 'Failed to update publication' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if publication belongs to user
    const existingPublication = await prisma.publication.findUnique({
      where: { id: params.id }
    })

    if (!existingPublication || existingPublication.profileId !== user.profile.id) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    await prisma.publication.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Publication deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    )
  }
}