import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FACULTIES, DEPARTMENTS } from '@/lib/constants'
import { NextSeo } from 'next-seo'

async function getStaffProfiles() {
  return await prisma.profile.findMany({
    where: { isPublic: true },
    include: { user: true },
    orderBy: { lastName: 'asc' }
  })
}

export default async function HomePage() {
  const profiles = await getStaffProfiles()
  
  const groupedByFaculty = profiles.reduce((acc, profile) => {
    const faculty = profile.faculty
    if (!acc[faculty]) acc[faculty] = []
    acc[faculty].push(profile)
    return acc
  }, {} as Record<string, typeof profiles>)

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

        {/* Staff Directory */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {Object.entries(groupedByFaculty).map(([faculty, facultyProfiles]) => (
            <section key={faculty} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {FACULTIES[faculty as keyof typeof FACULTIES]}
              </h3>
              
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