import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { profileId: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if publication exists and belongs to the profile
    const existingPublication = await prisma.publication.findUnique({
      where: { id: params.id }
    })

    if (!existingPublication || existingPublication.profileId !== params.profileId) {
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
    console.error('Admin publication update error:', error)
    return NextResponse.json(
      { error: 'Failed to update publication' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { profileId: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if publication exists and belongs to the profile
    const existingPublication = await prisma.publication.findUnique({
      where: { id: params.id }
    })

    if (!existingPublication || existingPublication.profileId !== params.profileId) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    await prisma.publication.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin publication deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    )
  }
}