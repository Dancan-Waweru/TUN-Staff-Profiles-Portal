'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FACULTIES, DEPARTMENTS } from '@/lib/constants'

interface StaffProfile {
  id: string
  firstName: string
  lastName: string
  title: string
  position: string
  department: string
  faculty: string
  slug: string
  profileImage?: string
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<StaffProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<StaffProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    filterProfiles()
  }, [profiles, searchTerm, selectedFaculty, selectedDepartment])

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/staff')
      if (response.ok) {
        const data = await response.json()
        setProfiles(data)
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProfiles = () => {
    let filtered = profiles

    if (searchTerm) {
      filtered = filtered.filter(profile =>
        `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedFaculty) {
      filtered = filtered.filter(profile => profile.faculty === selectedFaculty)
    }

    if (selectedDepartment) {
      filtered = filtered.filter(profile => profile.department === selectedDepartment)
    }

    setFilteredProfiles(filtered)
  }

  const groupedByFaculty = filteredProfiles.reduce((acc, profile) => {
    const faculty = profile.faculty
    if (!acc[faculty]) acc[faculty] = []
    acc[faculty].push(profile)
    return acc
  }, {} as Record<string, StaffProfile[]>)

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tharaka University
                </h1>
                <p className="text-gray-600">Staff Directory</p>
              </div>
              <div className="flex space-x-4">
                <Link href="/auth/signin" className="btn-primary">
                  Staff Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-primary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Meet Our Distinguished Faculty
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Discover the expertise and achievements of our academic and administrative staff
              across all faculties and departments.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Staff Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search by name or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Faculties</option>
                  {Object.entries(FACULTIES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Departments</option>
                  {Object.entries(DEPARTMENTS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedFaculty('')
                    setSelectedDepartment('')
                  }}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProfiles.length} of {profiles.length} staff members
            </div>
          </div>
        </section>

        {/* Staff Directory */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading staff profiles...</p>
            </div>
          ) : (
          {Object.entries(groupedByFaculty).map(([faculty, facultyProfiles]) => (
            <section key={faculty} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {FACULTIES[faculty as keyof typeof FACULTIES]}
                </h3>
                <Link
                  href={`/faculty/${faculty}`}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  View All →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facultyProfiles.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/staff/${profile.slug}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        {profile.profileImage ? (
                          <img
                            src={profile.profileImage}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-semibold text-gray-600">
                            {profile.firstName[0]}{profile.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {profile.title} {profile.firstName} {profile.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{profile.position}</p>
                        <p className="text-xs text-gray-500">
                          {DEPARTMENTS[profile.department as keyof typeof DEPARTMENTS]}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 Tharaka University. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}