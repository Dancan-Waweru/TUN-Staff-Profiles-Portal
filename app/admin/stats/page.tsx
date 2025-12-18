'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FACULTIES, DEPARTMENTS } from '@/lib/constants'
import Link from 'next/link'

interface AdminStats {
  totalStaff: number
  publicProfiles: number
  privateProfiles: number
  recentRegistrations: number
  facultyStats: Array<{ faculty: string; _count: { faculty: number } }>
  departmentStats: Array<{ department: string; _count: { department: number } }>
  positionStats: Array<{ position: string; _count: { position: number } }>
}

export default function AdminStatsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load statistics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Statistics Dashboard
              </h1>
              <p className="text-gray-600">Staff profile analytics and insights</p>
            </div>
            <Link href="/admin" className="btn-secondary">
              ← Back to Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Staff</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalStaff}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Public Profiles</h3>
            <p className="text-3xl font-bold text-green-600">{stats.publicProfiles}</p>
            <p className="text-sm text-gray-500">
              {((stats.publicProfiles / stats.totalStaff) * 100).toFixed(1)}% of total
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Private Profiles</h3>
            <p className="text-3xl font-bold text-red-600">{stats.privateProfiles}</p>
            <p className="text-sm text-gray-500">
              {((stats.privateProfiles / stats.totalStaff) * 100).toFixed(1)}% of total
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Recent Registrations</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.recentRegistrations}</p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Faculty Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Distribution</h3>
            <div className="space-y-3">
              {stats.facultyStats.map((faculty) => (
                <div key={faculty.faculty} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex-1">
                    {FACULTIES[faculty.faculty as keyof typeof FACULTIES]}
                  </span>
                  <span className="font-medium text-gray-900 ml-2">
                    {faculty._count.faculty}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(faculty._count.faculty / stats.totalStaff) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
            <div className="space-y-3">
              {stats.departmentStats.map((department) => (
                <div key={department.department} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex-1">
                    {DEPARTMENTS[department.department as keyof typeof DEPARTMENTS]}
                  </span>
                  <span className="font-medium text-gray-900 ml-2">
                    {department._count.department}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(department._count.department / stats.totalStaff) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Position Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Distribution</h3>
            <div className="space-y-3">
              {stats.positionStats.map((position) => (
                <div key={position.position} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex-1">
                    {position.position}
                  </span>
                  <span className="font-medium text-gray-900 ml-2">
                    {position._count.position}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(position._count.position / stats.totalStaff) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}