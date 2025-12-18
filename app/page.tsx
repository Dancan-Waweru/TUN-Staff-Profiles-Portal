'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FACULTIES, DEPARTMENTS } from '@/lib/constants'
import TharakaLogo from '@/components/TharakaLogo'

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
        <header className="bg-white shadow-lg border-b-4 border-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <TharakaLogo size="lg" />
              <div className="flex items-center space-x-6">
                <nav className="hidden md:flex space-x-6">
                  <Link href="/faculties" className="text-gray-600 hover:text-primary transition-colors">
                    Faculties
                  </Link>
                  <Link href="/departments" className="text-gray-600 hover:text-primary transition-colors">
                    Departments
                  </Link>
                  <Link href="/library" className="text-gray-600 hover:text-primary transition-colors">
                    Library
                  </Link>
                  <a 
                    href="https://www.tharaka.ac.ke" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    University Website ↗
                  </a>
                </nav>
                <Link href="/auth/signin" className="btn-primary">
                  Staff Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="header-gradient text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-bold mb-6">
              Meet Our Distinguished Faculty
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Discover the expertise and achievements of our academic and administrative staff
              across all faculties and departments at Tharaka University.
            </p>
            <div className="mt-8">
              <Link href="#directory" className="btn-accent text-lg px-8 py-3">
                Explore Directory
              </Link>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        </section>

        {/* Search and Filters */}
        <section id="directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2">Find Staff Members</h3>
              <p className="text-gray-600">Search our comprehensive directory of faculty and staff</p>
            </div>
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
            <>
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
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <TharakaLogo size="md" showText={false} />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">
                      Tharaka University
                    </span>
                    <span className="text-accent text-xs">
                      Education for Freedom
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Tharaka University is committed to providing quality education and fostering 
                  academic excellence across all disciplines.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/faculties" className="text-gray-300 hover:text-white transition-colors">Faculties</Link></li>
                  <li><Link href="/departments" className="text-gray-300 hover:text-white transition-colors">Departments</Link></li>
                  <li><Link href="/library" className="text-gray-300 hover:text-white transition-colors">Library</Link></li>
                  <li>
                    <a 
                      href="https://www.tharaka.ac.ke" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      University Website ↗
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p className="text-white font-medium">Tharaka University</p>
                  <p>P.O. Box 193-60215, Marimanti</p>
                  <p>Email: info@tharaka.ac.ke</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-600 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Tharaka University. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}