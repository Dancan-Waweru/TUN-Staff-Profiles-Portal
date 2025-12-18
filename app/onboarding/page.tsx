'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FACULTIES, DEPARTMENTS, TITLES, POSITIONS } from '@/lib/constants'
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
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  googleScholarUrl: z.string().url().optional().or(z.literal('')),
  orcidUrl: z.string().url().optional().or(z.literal('')),
  researchgateUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

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
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Google Scholar URL</label>
                    <input
                      type="url"
                      {...register('googleScholarUrl')}
                      placeholder="https://scholar.google.com/citations?user=..."
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">ORCID URL</label>
                    <input
                      type="url"
                      {...register('orcidUrl')}
                      placeholder="https://orcid.org/0000-0000-0000-0000"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">ResearchGate URL</label>
                    <input
                      type="url"
                      {...register('researchgateUrl')}
                      placeholder="https://www.researchgate.net/profile/..."
                      className="form-input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Personal Website</label>
                    <input
                      type="url"
                      {...register('websiteUrl')}
                      placeholder="https://yourwebsite.com"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}