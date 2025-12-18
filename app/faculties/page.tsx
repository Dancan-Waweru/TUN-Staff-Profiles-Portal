'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FACULTIES } from '@/lib/constants'
import TharakaLogo from '@/components/TharakaLogo'

interface FacultyStats {
  faculty: string
  staffCount: number
  publicationsCount: number
}

export default function FacultiesPage() {
  const [facultyStats, setFacultyStats] = useState<FacultyStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFacultyStats()
  }, [])

  const fetchFacultyStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        const stats = data.facultyStats?.map((stat: any) => ({
          faculty: stat.faculty,
          staffCount: stat._count.faculty,
          publicationsCount: data.publicationsByFaculty[stat.faculty] || 0
        })) || []
        setFacultyStats(stats)
      }
    } catch (error) {
      console.error('Failed to fetch faculty stats:', error)
    } finally {
      setLoading(false)
    }
  }

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
              <Link href="/departments" className="text-gray-600 hover:text-primary transition-colors">
                Departments
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
          <h1 className="text-4xl font-bold mb-4">Our Faculties</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Explore the diverse academic faculties at Tharaka University, each dedicated to excellence in education and research.
          </p>
        </div>
      </section>

      {/* Faculties Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading faculties...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(FACULTIES).map(([key, name]) => {
              const stats = facultyStats.find(s => s.faculty === key)
              return (
                <Link
                  key={key}
                  href={`/faculty/${key}`}
                  className="card p-6 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>Staff Members: {stats?.staffCount || 0}</p>
                        <p>Publications: {stats?.publicationsCount || 0}</p>
                      </div>
                      <div className="mt-4">
                        <span className="text-primary font-medium text-sm group-hover:text-accent transition-colors">
                          View Faculty →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
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