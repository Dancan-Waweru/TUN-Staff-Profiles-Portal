'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { DEPARTMENTS, FACULTIES } from '@/lib/constants'
import TharakaLogo from '@/components/TharakaLogo'

interface DepartmentStats {
  department: string
  staffCount: number
  publicationsCount: number
}

// Map departments to their parent faculties
const DEPARTMENT_FACULTY_MAP: Record<string, string> = {
  'DRY_LAND_AGRICULTURE_NATURAL_RESOURCES': 'LIFE_SCIENCES_NATURAL_RESOURCES',
  'BUSINESS_ADMINISTRATION': 'BUSINESS_STUDIES',
  'EDUCATION': 'EDUCATION',
  'HUMANITIES': 'HUMANITIES_SOCIAL_SCIENCES',
  'SOCIAL_SCIENCE': 'HUMANITIES_SOCIAL_SCIENCES',
  'BASIC_SCIENCES': 'PHYSICAL_SCIENCES_ENGINEERING_TECHNOLOGY',
  'COMPUTER_SCIENCE_ICT': 'PHYSICAL_SCIENCES_ENGINEERING_TECHNOLOGY',
  'HEALTH_SCIENCES': 'HEALTH_SCIENCES'
}

export default function DepartmentsPage() {
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepartmentStats()
  }, [])

  const fetchDepartmentStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        const stats = data.departmentStats?.map((stat: any) => ({
          department: stat.department,
          staffCount: stat._count.department,
          publicationsCount: data.publicationsByDepartment[stat.department] || 0
        })) || []
        setDepartmentStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch department stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group departments by faculty
  const departmentsByFaculty = Object.entries(DEPARTMENTS).reduce((acc, [deptKey, deptName]) => {
    const facultyKey = DEPARTMENT_FACULTY_MAP[deptKey] || 'OTHER'
    if (!acc[facultyKey]) acc[facultyKey] = []
    acc[facultyKey].push({ key: deptKey, name: deptName })
    return acc
  }, {} as Record<string, Array<{ key: string; name: string }>>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/">
              <TharakaLogo size="md" />
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/faculties" className="text-gray-600 hover:text-primary transition-colors">
                Faculties
              </Link>
              <Link href="/auth/signin" className="btn-primary">
                Staff Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Departments</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Discover the specialized departments within each faculty, driving innovation and academic excellence.
          </p>
        </div>
      </section>

      {/* Departments by Faculty */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading departments...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(departmentsByFaculty).map(([facultyKey, departments]) => (
              <section key={facultyKey} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-primary">
                    {FACULTIES[facultyKey as keyof typeof FACULTIES] || 'Other Departments'}
                  </h2>
                  <Link
                    href={`/faculty/${facultyKey}`}
                    className="text-accent hover:text-primary font-medium"
                  >
                    View Faculty →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departments.map(({ key, name }) => {
                    const stats = departmentStats.find(s => s.department === key)
                    return (
                      <div
                        key={key}
                        className="card p-6 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {name}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>Staff Members: {stats?.staffCount || 0}</p>
                              <p>Publications: {stats?.publicationsCount || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <TharakaLogo size="sm" showText={false} />
              <div className="flex flex-col">
                <span className="font-bold text-white">Tharaka University</span>
                <span className="text-accent text-xs">Education for Freedom</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-300">
                P.O. Box 193-60215, Marimanti
              </p>
              <p className="text-sm text-gray-300">
                &copy; {new Date().getFullYear()} Tharaka University. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}