import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FACULTIES, DEPARTMENTS } from '@/lib/constants'
import Footer from '@/components/Footer'

interface FacultyPageProps {
  params: { faculty: string }
}

async function getFacultyProfiles(faculty: string) {
  return await prisma.profile.findMany({
    where: { 
      faculty: faculty,
      isPublic: true 
    },
    include: { user: true },
    orderBy: { lastName: 'asc' }
  })
}

export async function generateMetadata({ params }: FacultyPageProps) {
  const facultyName = FACULTIES[params.faculty as keyof typeof FACULTIES]
  
  if (!facultyName) {
    return {
      title: 'Faculty Not Found - Tharaka University'
    }
  }

  return {
    title: `${facultyName} - Tharaka University`,
    description: `Meet the academic and administrative staff of ${facultyName} at Tharaka University`,
  }
}

export default async function FacultyPage({ params }: FacultyPageProps) {
  const facultyName = FACULTIES[params.faculty as keyof typeof FACULTIES]
  
  if (!facultyName) {
    notFound()
  }

  const profiles = await getFacultyProfiles(params.faculty)

  // Group by department
  const groupedByDepartment = profiles.reduce((acc, profile) => {
    const department = profile.department
    if (!acc[department]) acc[department] = []
    acc[department].push(profile)
    return acc
  }, {} as Record<string, typeof profiles>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tharaka University
              </h1>
            </div>
            <Link href="/" className="text-primary-600 hover:text-primary-500">
              ← Back to Directory
            </Link>
          </div>
        </div>
      </header>

      {/* Faculty Header */}
      <section className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{facultyName}</h1>
          <p className="text-xl text-primary-100">
            Meet our distinguished faculty members and staff
          </p>
          <div className="mt-4 text-primary-200">
            {profiles.length} staff member{profiles.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Staff by Department */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(groupedByDepartment).map(([department, departmentProfiles]) => (
          <section key={department} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {DEPARTMENTS[department as keyof typeof DEPARTMENTS]}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentProfiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/staff/${profile.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
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
                      <h3 className="font-semibold text-gray-900">
                        {profile.title} {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{profile.position}</p>
                      {profile.biography && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {profile.biography.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {profiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No staff profiles available for this faculty.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}