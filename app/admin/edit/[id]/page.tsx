'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FACULTIES, DEPARTMENTS, TITLES, POSITIONS } from '@/lib/constants'
import { professionalLinksSchema, getUrlValidationError, getUrlExample } from '@/lib/validation'
import toast from 'react-hot-toast'
import Link from 'next/link'

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
  publications: z.string().optional(),
  isPublic: z.boolean(),
}).merge(professionalLinksSchema)

type ProfileFormData = z.infer<typeof profileSchema>

interface AdminEditProfilePageProps {
  params: { id: string }
}

export default function AdminEditProfilePage({ params }: AdminEditProfilePageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileImage, setProfileImage] = useState<string>('')
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchProfile()
  }, [session, router, params.id])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/admin/profiles/${params.id}`)
      if (response.ok) {
        const profile = await response.json()
        
        // Set form values
        Object.keys(profile).forEach((key) => {
          if (key in profileSchema.shape) {
            setValue(key as keyof ProfileFormData, profile[key] || '')
          }
        })
        
        setValue('isPublic', profile.isPublic)
        setProfileImage(profile.profileImage || '')
      } else {
        toast.error('Profile not found')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/profiles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          profileImage,
        }),
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
        router.push('/admin')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Staff Profile
                </h1>
                <p className="text-gray-600">Update staff member information</p>
              </div>
              <Link href="/admin" className="btn-secondary">
                ← Back to Admin
              </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile Image */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-600">
                        No Image
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image"
                    />
                    <label
                      htmlFor="profile-image"
                      className="btn-secondary cursor-pointer"
                    >
                      Change Picture
                    </label>
                  </div>
                </div>
              </div>

              {/* Visibility Control */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h2>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isPublic')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Make profile visible to public
                  </label>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
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

                <div className="mt-4">
                  <label className="form-label">Middle Name</label>
                  <input
                    type="text"
                    {...register('middleName')}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
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

                <div className="mt-4">
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
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
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
              </div>

              {/* Social Media & Professional Links */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h2>
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

              {/* Additional Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                <div className="space-y-4">
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

                  <div>
                    <label className="form-label">Publications</label>
                    <textarea
                      {...register('publications')}
                      rows={4}
                      className="form-input"
                      placeholder="Key publications and research outputs..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/admin" className="btn-secondary">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}