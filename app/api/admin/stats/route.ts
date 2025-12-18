import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log('Admin stats session:', session?.user)
    
    if (!session?.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      console.log('User role:', session.user.role, 'Expected: ADMIN')
      return NextResponse.json({ error: 'Not admin' }, { status: 403 })
    }

    console.log('Fetching basic stats...')
    
    // Get basic counts first
    const totalStaff = await prisma.profile.count()
    console.log('Total staff:', totalStaff)
    
    const publicProfiles = await prisma.profile.count({ where: { isPublic: true } })
    const privateProfiles = await prisma.profile.count({ where: { isPublic: false } })

    // If no profiles exist, return basic stats
    if (totalStaff === 0) {
      return NextResponse.json({
        totalStaff: 0,
        publicProfiles: 0,
        privateProfiles: 0,
        recentRegistrations: 0,
        completeProfiles: 0,
        incompleteProfiles: 0,
        profilesWithSocialLinks: 0,
        totalPublications: 0,
        publicationsByFaculty: {},
        publicationsByDepartment: {},
        facultyStats: [],
        departmentStats: [],
        positionStats: []
      })
    }

    // Get faculty distribution
    const facultyStats = await prisma.profile.groupBy({
      by: ['faculty'],
      _count: {
        faculty: true
      }
    })

    // Get department distribution  
    const departmentStats = await prisma.profile.groupBy({
      by: ['department'],
      _count: {
        department: true
      }
    })

    // Get position distribution
    const positionStats = await prisma.profile.groupBy({
      by: ['position'],
      _count: {
        position: true
      }
    })

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentRegistrations = await prisma.profile.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Get profile completeness stats
    const allProfiles = await prisma.profile.findMany({
      select: {
        firstName: true,
        lastName: true,
        title: true,
        position: true,
        department: true,
        faculty: true,
        email: true,
        phone: true,
        officeLocation: true,
        biography: true,
        qualifications: true,
        researchInterests: true,
        linkedinUrl: true,
        googleScholarUrl: true,
        orcidUrl: true,
        researchgateUrl: true,
        websiteUrl: true,
        profileImage: true,
        publications: true
      }
    })

    // Calculate profile completeness
    const completeProfiles = allProfiles.filter(profile => {
      const requiredFields = [
        profile.firstName,
        profile.lastName,
        profile.title,
        profile.position,
        profile.department,
        profile.faculty,
        profile.email
      ]
      
      const optionalFields = [
        profile.phone,
        profile.officeLocation,
        profile.biography,
        profile.qualifications,
        profile.researchInterests,
        profile.profileImage
      ]
      
      const filledOptionalFields = optionalFields.filter(field => field && field.trim() !== '').length
      
      return requiredFields.every(field => field && field.trim() !== '') && filledOptionalFields >= 4
    }).length

    const incompleteProfiles = totalStaff - completeProfiles

    // Get publication statistics from the Publication model
    const allPublications = await prisma.publication.findMany({
      include: {
        profile: {
          select: {
            faculty: true,
            department: true
          }
        }
      }
    })

    // Count publications by faculty
    const publicationsByFaculty = allPublications.reduce((acc, publication) => {
      const faculty = publication.profile.faculty
      if (!acc[faculty]) acc[faculty] = 0
      acc[faculty] += 1
      return acc
    }, {} as Record<string, number>)

    // Count publications by department
    const publicationsByDepartment = allPublications.reduce((acc, publication) => {
      const department = publication.profile.department
      if (!acc[department]) acc[department] = 0
      acc[department] += 1
      return acc
    }, {} as Record<string, number>)

    // Total publications across university
    const totalPublications = allPublications.length

    // Get profiles with social media links
    const profilesWithSocialLinks = allProfiles.filter(profile => 
      (profile.linkedinUrl && profile.linkedinUrl.trim() !== '') ||
      (profile.googleScholarUrl && profile.googleScholarUrl.trim() !== '') ||
      (profile.orcidUrl && profile.orcidUrl.trim() !== '') ||
      (profile.researchgateUrl && profile.researchgateUrl.trim() !== '') ||
      (profile.websiteUrl && profile.websiteUrl.trim() !== '')
    ).length

    return NextResponse.json({
      totalStaff,
      publicProfiles,
      privateProfiles,
      recentRegistrations,
      completeProfiles,
      incompleteProfiles,
      profilesWithSocialLinks,
      totalPublications,
      publicationsByFaculty,
      publicationsByDepartment,
      facultyStats,
      departmentStats,
      positionStats
    })
  } catch (error) {
    console.error('Admin stats fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}