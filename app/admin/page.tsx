'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FACULTIES, DEPARTMENTS } from '@/lib/constants'
import Link from 'next/link'

interface StaffProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  position: string
  department: string
  faculty: string
  isPublic: boolean
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profiles, setProfiles] = useState<StaffProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    faculty: '',
    department: '',
    search: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchProfiles()
  }, [session, status, router])

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/admin/profiles')
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

  const toggleProfileVisibility = async (profileId: string, isPublic: boolean) => {
    try {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic }),
      })

      if (response.ok) {
        setProfiles(profiles.map(p => 
          p.id === profileId ? { ...p, isPublic: !isPublic } : p
        ))
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !filter.search || 
      `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(filter.search.toLowerCase()) ||
      profile.email.toLowerCase().includes(filter.search.toLowerCase())
    
    const matchesFaculty = !filter.faculty || profile.faculty === filter.faculty
    const matchesDepartment = !filter.department || profile.department === filter.department

    return matchesSearch && matchesFaculty && matchesDepartment
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage staff profiles</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/stats" className="btn-secondary">
                Statistics
              </Link>
              <a
                href="/api/admin/export"
                className="btn-secondary"
                download
              >
                Export CSV
              </a>
              <Link href="/admin/bulk-upload" className="btn-primary">
                Bulk Upload
              </Link>
              <Link href="/dashboard" className="btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Search</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Faculty</label>
              <select
                value={filter.faculty}
                onChange={(e) => setFilter({ ...filter, faculty: e.target.value })}
                className="form-input"
              >
                <option value="">All Faculties</option>
                {Object.entries(FACULTIES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Department</label>
              <select
                value={filter.department}
                onChange={(e) => setFilter({ ...filter, department: e.target.value })}
                className="form-input"
              >
                <option value="">All Departments</option>
                {Object.entries(DEPARTMENTS).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ faculty: '', department: '', search: '' })}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Staff</h3>
            <p className="text-3xl font-bold text-primary-600">{profiles.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Public Profiles</h3>
            <p className="text-3xl font-bold text-green-600">
              {profiles.filter(p => p.isPublic).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Private Profiles</h3>
            <p className="text-3xl font-bold text-red-600">
              {profiles.filter(p => !p.isPublic).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Filtered Results</h3>
            <p className="text-3xl font-bold text-gray-600">{filteredProfiles.length}</p>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{profile.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profile.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {DEPARTMENTS[profile.department as keyof typeof DEPARTMENTS]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        profile.isPublic
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profile.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleProfileVisibility(profile.id, profile.isPublic)}
                        className={`${
                          profile.isPublic
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {profile.isPublic ? 'Hide' : 'Show'}
                      </button>
                      <Link
                        href={`/admin/edit/${profile.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}