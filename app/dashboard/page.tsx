'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProfileCompletenessIndicator from '@/components/ProfileCompletenessIndicator'
import TharakaLogo from '@/components/TharakaLogo'

interface Profile {
  id: string
  firstName: string
  lastName: string
  position: string
  department: string
  faculty: string
  isPublic: boolean
  slug: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (!session.user.hasProfile) {
      router.push('/onboarding')
      return
    }

    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile/me')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async () => {
    if (!profile) return

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !profile.isPublic }),
      })

      if (response.ok) {
        setProfile({ ...profile, isPublic: !profile.isPublic })
      }
    } catch (error) {
      console.error('Failed to update visibility:', error)
    }
  }

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
      <header className="bg-white shadow-lg border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <TharakaLogo size="md" showText={false} />
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  Staff Dashboard
                </h1>
                <p className="text-gray-600">Manage your profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-4">
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                  Public Directory
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
              {session?.user.role === 'ADMIN' && (
                <Link href="/admin" className="btn-secondary">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {profile && (
          <div className="card">
            <div className="px-6 py-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600">{profile.position}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Profile Visibility:</span>
                  <button
                    onClick={toggleVisibility}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.isPublic
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {profile.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Link
                    href="/dashboard/edit"
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">Edit Profile</h3>
                    <p className="text-sm text-gray-600">
                      Update your personal and professional information
                    </p>
                  </Link>

                  {profile.isPublic && (
                    <Link
                      href={`/staff/${profile.slug}`}
                      target="_blank"
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900">View Public Profile</h3>
                      <p className="text-sm text-gray-600">
                        See how your profile appears to visitors
                      </p>
                    </Link>
                  )}
                </div>

                <div className="space-y-4">
                  <ProfileCompletenessIndicator profile={profile} />
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Quick Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="text-gray-900">{profile.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Faculty:</span>
                        <span className="text-gray-900">{profile.faculty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profile Status:</span>
                        <span className={profile.isPublic ? 'text-green-600' : 'text-red-600'}>
                          {profile.isPublic ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}