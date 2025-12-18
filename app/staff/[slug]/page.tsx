import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { FACULTIES, DEPARTMENTS } from '@/lib/constants'
import { NextSeo } from 'next-seo'

interface StaffProfilePageProps {
  params: { slug: string }
}

async function getStaffProfile(slug: string) {
  return await prisma.profile.findUnique({
    where: { slug, isPublic: true },
    include: { user: true }
  })
}

export async function generateMetadata({ params }: StaffProfilePageProps) {
  const profile = await getStaffProfile(params.slug)
  
  if (!profile) {
    return {
      title: 'Staff Not Found - Tharaka University'
    }
  }

  return {
    title: `${profile.title} ${profile.firstName} ${profile.lastName} - Tharaka University`,
    description: profile.biography || `${profile.position} at ${DEPARTMENTS[profile.department as keyof typeof DEPARTMENTS]}`,
    openGraph: {
      title: `${profile.title} ${profile.firstName} ${profile.lastName}`,
      description: profile.biography || `${profile.position} at Tharaka University`,
      images: profile.profileImage ? [{ url: profile.profileImage }] : [],
    }
  }
}

export default async function StaffProfilePage({ params }: StaffProfilePageProps) {
  const profile = await getStaffProfile(params.slug)

  if (!profile) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${profile.firstName} ${profile.lastName}`,
    jobTitle: profile.position,
    worksFor: {
      '@type': 'Organization',
      name: 'Tharaka University',
    },
    email: profile.email,
    telephone: profile.phone,
    description: profile.biography,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
              <a href="/" className="text-primary-600 hover:text-primary-500">
                ← Back to Directory
              </a>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-primary-600 px-6 py-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary-600">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </span>
                  )}
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold">
                    {profile.title} {profile.firstName} {profile.middleName} {profile.lastName}
                  </h1>
                  <p className="text-xl text-primary-100 mt-1">{profile.position}</p>
                  <p className="text-primary-200">
                    {DEPARTMENTS[profile.department as keyof typeof DEPARTMENTS]}
                  </p>
                  <p className="text-primary-200">
                    {FACULTIES[profile.faculty as keyof typeof FACULTIES]}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>
                      {profile.phone && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Phone:</span>
                          <p className="text-gray-900">{profile.phone}</p>
                        </div>
                      )}
                      {profile.officeLocation && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Office:</span>
                          <p className="text-gray-900">{profile.officeLocation}</p>
                        </div>
                      )}
                      {profile.staffId && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Staff ID:</span>
                          <p className="text-gray-900">{profile.staffId}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Links */}
                  {(profile.linkedinUrl || profile.googleScholarUrl || profile.orcidUrl || profile.researchgateUrl || profile.websiteUrl) && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Professional Links
                      </h2>
                      <div className="space-y-2">
                        {profile.linkedinUrl && (
                          <a
                            href={profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                          </a>
                        )}
                        {profile.googleScholarUrl && (
                          <a
                            href={profile.googleScholarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                            </svg>
                            Google Scholar
                          </a>
                        )}
                        {profile.orcidUrl && (
                          <a
                            href={profile.orcidUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-green-600 hover:text-green-800"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947-.525 0-.946-.422-.946-.947 0-.525.421-.947.946-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.588-1.444 3.588-3.722 0-2.016-1.091-3.722-3.588-3.722h-2.297z"/>
                            </svg>
                            ORCID
                          </a>
                        )}
                        {profile.researchgateUrl && (
                          <a
                            href={profile.researchgateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-teal-600 hover:text-teal-800"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.586 0H4.414A4.414 4.414 0 0 0 0 4.414v15.172A4.414 4.414 0 0 0 4.414 24h15.172A4.414 4.414 0 0 0 24 19.586V4.414A4.414 4.414 0 0 0 19.586 0zM8.063 18.411H6.031V9.75h2.032v8.661zm-1.016-9.85c-.648 0-1.172-.525-1.172-1.172s.524-1.172 1.172-1.172c.647 0 1.171.525 1.171 1.172s-.524 1.172-1.171 1.172zm10.172 9.85h-2.032v-4.219c0-.758-.016-1.734-1.056-1.734-1.057 0-1.219.825-1.219 1.678v4.275h-2.031V9.75h1.95v1.181h.027c.271-.514.935-1.056 1.925-1.056 2.059 0 2.436 1.355 2.436 3.117v5.419z"/>
                            </svg>
                            ResearchGate
                          </a>
                        )}
                        {profile.websiteUrl && (
                          <a
                            href={profile.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-gray-800"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 13.8h-3.924c.372-1.764.901-3.592 1.596-5.4 1.596.864 2.688 2.484 3.024 4.2-.216.408-.432.804-.696 1.2zm-1.596-6.6c-.696 1.8-1.224 3.636-1.596 5.4H9.624c-.372-1.764-.9-3.6-1.596-5.4 1.596-.864 3.372-.864 4.968 0zm-7.164 6.6c.372-1.764.9-3.636 1.596-5.4 1.596.864 2.688 2.484 3.024 4.2-.216.408-.432.804-.696 1.2H8.808zm7.164 1.2c-.372 1.764-.9 3.636-1.596 5.4-1.596-.864-2.688-2.484-3.024-4.2.216-.408.432-.804.696-1.2h3.924zm-7.164 0h3.924c-.372 1.764-.901 3.536-1.596 5.4-1.596-.864-2.688-2.484-3.024-4.2.216-.408.432-.804.696-1.2z"/>
                            </svg>
                            Personal Website
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {profile.biography && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        Biography
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {profile.biography}
                      </p>
                    </div>
                  )}

                  {profile.qualifications && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        Qualifications
                      </h2>
                      <div className="text-gray-700 whitespace-pre-line">
                        {profile.qualifications}
                      </div>
                    </div>
                  )}

                  {profile.researchInterests && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        Research Interests
                      </h2>
                      <div className="text-gray-700 whitespace-pre-line">
                        {profile.researchInterests}
                      </div>
                    </div>
                  )}

                  {profile.publications && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        Publications
                      </h2>
                      <div className="text-gray-700 whitespace-pre-line">
                        {profile.publications}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}