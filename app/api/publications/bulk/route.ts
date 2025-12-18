import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Bulk publications POST request received')
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
      console.log('User profile not found for email:', session.user.email)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { publications } = await request.json()
    console.log('Bulk publications data:', publications)

    if (!Array.isArray(publications) || publications.length === 0) {
      return NextResponse.json({ error: 'Publications array is required' }, { status: 400 })
    }

    if (publications.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 publications allowed at once' }, { status: 400 })
    }

    // Validate each publication
    for (const pub of publications) {
      if (!pub.title || !pub.authors || !pub.url || !pub.year) {
        return NextResponse.json({ error: 'All fields are required for each publication' }, { status: 400 })
      }
    }

    console.log('Creating publications for profile:', user.profile.id)
    
    // Create all publications
    const createdPublications = await Promise.all(
      publications.map((pub: any) => 
        (prisma as any).publication.create({
          data: {
            title: pub.title,
            authors: pub.authors,
            url: pub.url,
            year: parseInt(pub.year),
            profileId: user.profile.id,
          },
        })
      )
    )

    console.log('Publications created:', createdPublications.length)
    return NextResponse.json({ 
      success: true, 
      count: createdPublications.length,
      publications: createdPublications 
    })
  } catch (error) {
    console.error('Bulk publication creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create publications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}