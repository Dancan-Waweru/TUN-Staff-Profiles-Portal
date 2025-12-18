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

    // Get total counts
    const totalStaff = await prisma.profile.count()
    const publicProfiles = await prisma.profile.count({ where: { isPublic: true } })
    const privateProfiles = await prisma.profile.count({ where: { isPublic: false } })

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

    return NextResponse.json({
      totalStaff,
      publicProfiles,
      privateProfiles,
      recentRegistrations,
      facultyStats,
      departmentStats,
      positionStats
    })
  } catch (error) {
    console.error('Admin stats fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}