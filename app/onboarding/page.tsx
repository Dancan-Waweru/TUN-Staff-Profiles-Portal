'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FACULTIES, DEPARTMENTS, TITLES, POSITIONS } from '@/lib/constants'
import { professionalLinksSchema, getUrlValidationError, getUrlExample } from '@/lib/validation'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  position: z.string().min(1, 'Position is required'),
  department: z.string().min(1, 'Department is required'),
  faculty: z.string().min(1, 'Faculty is required'),
  phone: z.string().optional(),
  officeLocation: z.string().optional(),
  biography: z.string().optional(),
  qualifications: z.string().optional(),
  researchInterests: z.string().optional(),
}).merge(professionalLinksSchema)

type ProfileFormData = z.infer<typeof profileSchema>

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  // Watch URL fields for real-time validation
  const watchedUrls = watch(['linkedinUrl', 'googleScholarUrl', 'orcidUrl', 'researchgateUrl', 'websiteUrl'])

  // Validate URLs in real-time
  useEffect(() => {
    const [linkedinUrl, googleScholarUrl, orcidUrl, researchgateUrl, websiteUrl] = watchedUrls
    const newErrors: Record<string, string> = {}

    if (linkedinUrl) {
      const error = getUrlValidationError('linkedin', linkedinUrl)
      if (error) newErrors.linkedinUrl = error
    }

    if (googleScholarUrl) {
      const error = getUrlValidationError('googleScholar', googleScholarUrl)
      if (error) newErrors.googleScholarUrl = error
    }

    if (orcidUrl) {
      const error = getUrlValidationError('orcid', orcidUrl)
      if (error) newErrors.orcidUrl = error
    }

    if (researchgateUrl) {
      const error = getUrlValidationError('researchgate', researchgateUrl)
      if (error) newErrors.researchgateUrl = error
    }

    if (websiteUrl) {
      const error = getUrlValidationError('website', websiteUrl)
      if (error) newErrors.websiteUrl = error
    }

    setUrlErrors(newErrors)
  }, watchedUrls)

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Profile created successfully!')
        // Force a page reload to update the session
        window.location.href = '/dashboard'
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create profile')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 mb-8">
              Please provide your details to create your staff profile.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Title *</label>
                  <select {...register('title')} className="form-input">
                    <option value="">Select Title</option>
                    {TITLES.map(title => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className="form-input"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className="form-input"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Middle Name</label>
                <input
                  type="text"
                  {...register('middleName')}
                  className="form-input"
                />
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Position *</label>
                  <select {...register('position')} className="form-input">
                    <option value="">Select Position</option>
                    {POSITIONS.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  {errors.position && (
                    <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Faculty *</label>
                  <select {...register('faculty')} className="form-input">
                    <option value="">Select Faculty</option>
                    {Object.entries(FACULTIES).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                  {errors.faculty && (
                    <p className="text-red-500 text-sm mt-1">{errors.faculty.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Department *</label>
                <select {...register('department')} className="form-input">
                  <option value="">Select Department</option>
                  {Object.entries(DEPARTMENTS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Office Location</label>
                  <input
                    type="text"
                    {...register('officeLocation')}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="form-label">Biography</label>
                <textarea
                  {...register('biography')}
                  rows={4}
                  className="form-input"
                  placeholder="Brief professional biography..."
                />
              </div>

              <div>
                <label className="form-label">Qualifications</label>
                <textarea
                  {...register('qualifications')}
                  rows={3}
                  className="form-input"
                  placeholder="Educational qualifications and certifications..."
                />
              </div>

              <div>
                <label className="form-label">Research Interests</label>
                <textarea
                  {...register('researchInterests')}
                  rows={3}
                  className="form-input"
                  placeholder="Areas of research and academic interest..."
                />
              </div>

              {/* Professional Links */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Links (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">LinkedIn URL</label>
                    <input
                      type="url"
                      {...register('linkedinUrl')}
                      placeholder={getUrlExample('linkedin')}
                      className={`form-input ${urlErrors.linkedinUrl ? 'border-red-500' : ''}`}
                    />
                    {urlErrors.linkedinUrl && (
                      <p className="text-red-500 text-sm mt-1">{urlErrors.linkedinUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Google Scholar URL</label>
                    <input
                      type="url"
                      {...register('googleScholarUrl')}
                      placeholder={getUrlExample('googleScholar')}
                      className={`form-input ${urlErrors.googleScholarUrl ? 'border-red-500' : ''}`}
                    />
                    {urlErrors.googleScholarUrl && (
                      <p className="text-red-500 text-sm mt-1">{urlErrors.googleScholarUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">ORCID URL</label>
                    <input
                      type="url"
                      {...register('orcidUrl')}
                      placeholder={getUrlExample('orcid')}
                      className={`form-input ${urlErrors.orcidUrl ? 'border-red-500' : ''}`}
                    />
                    {urlErrors.orcidUrl && (
                      <p className="text-red-500 text-sm mt-1">{urlErrors.orcidUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">ResearchGate URL</label>
                    <input
                      type="url"
                      {...register('researchgateUrl')}
                      placeholder={getUrlExample('researchgate')}
                      className={`form-input ${urlErrors.researchgateUrl ? 'border-red-500' : ''}`}
                    />
                    {urlErrors.researchgateUrl && (
                      <p className="text-red-500 text-sm mt-1">{urlErrors.researchgateUrl}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Personal Website</label>
                    <input
                      type="url"
                      {...register('websiteUrl')}
                      placeholder={getUrlExample('website')}
                      className={`form-input ${urlErrors.websiteUrl ? 'border-red-500' : ''}`}
                    />
                    {urlErrors.websiteUrl && (
                      <p className="text-red-500 text-sm mt-1">{urlErrors.websiteUrl}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(urlErrors).length > 0}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
                </button>
                {Object.keys(urlErrors).length > 0 && (
                  <p className="text-red-500 text-sm">
                    Please fix URL validation errors before submitting
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}