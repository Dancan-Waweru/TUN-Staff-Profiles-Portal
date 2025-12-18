import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profiles = await prisma.profile.findMany({
      include: { user: true },
      orderBy: { lastName: 'asc' }
    })

    // Convert to CSV format
    const csvHeaders = [
      'firstName', 'lastName', 'middleName', 'title', 'position', 'department', 
      'faculty', 'email', 'phone', 'officeLocation', 'biography', 'qualifications', 
      'researchInterests', 'publications', 'linkedinUrl', 'googleScholarUrl', 
      'orcidUrl', 'researchgateUrl', 'websiteUrl', 'isPublic', 'createdAt'
    ]

    const csvRows = profiles.map(profile => [
      profile.firstName || '',
      profile.lastName || '',
      profile.middleName || '',
      profile.title || '',
      profile.position || '',
      profile.department || '',
      profile.faculty || '',
      profile.email || '',
      profile.phone || '',
      profile.officeLocation || '',
      profile.biography || '',
      profile.qualifications || '',
      profile.researchInterests || '',
      profile.publications || '',
      profile.linkedinUrl || '',
      profile.googleScholarUrl || '',
      profile.orcidUrl || '',
      profile.researchgateUrl || '',
      profile.websiteUrl || '',
      profile.isPublic ? 'TRUE' : 'FALSE',
      profile.createdAt.toISOString().split('T')[0]
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="staff_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}