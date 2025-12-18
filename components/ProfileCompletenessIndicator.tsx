'use client'

import { useState, useEffect } from 'react'

interface ProfileCompletenessIndicatorProps {
  profile: {
    firstName?: string
    lastName?: string
    title?: string
    position?: string
    department?: string
    faculty?: string
    email?: string
    phone?: string
    officeLocation?: string
    biography?: string
    qualifications?: string
    researchInterests?: string
    profileImage?: string
    linkedinUrl?: string
    googleScholarUrl?: string
    orcidUrl?: string
    researchgateUrl?: string
    websiteUrl?: string
  }
}

export default function ProfileCompletenessIndicator({ profile }: ProfileCompletenessIndicatorProps) {
  const [publicationCount, setPublicationCount] = useState(0)

  useEffect(() => {
    // Fetch publication count
    fetch('/api/publications')
      .then(res => res.json())
      .then(data => setPublicationCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setPublicationCount(0))
  }, [])

  const requiredFields = [
    profile.firstName,
    profile.lastName,
    profile.title,
    profile.position,
    profile.department,
    profile.faculty,
    profile.email
  ]

  const optionalFields = [
    profile.phone,
    profile.officeLocation,
    profile.biography,
    profile.qualifications,
    profile.researchInterests,
    profile.profileImage,
    profile.linkedinUrl,
    profile.googleScholarUrl,
    profile.orcidUrl,
    profile.researchgateUrl,
    profile.websiteUrl,
    publicationCount > 0 ? 'has-publications' : null
  ]

  const filledRequiredFields = requiredFields.filter(field => field && field.trim() !== '').length
  const filledOptionalFields = optionalFields.filter(field => field && field.trim() !== '').length
  
  const totalFields = requiredFields.length + optionalFields.length
  const filledFields = filledRequiredFields + filledOptionalFields
  const completionPercentage = Math.round((filledFields / totalFields) * 100)
  
  const isComplete = filledRequiredFields === requiredFields.length && filledOptionalFields >= 4

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Profile Completeness</h3>
        <span className={`text-sm font-semibold ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
          {completionPercentage}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isComplete ? 'bg-green-500' : completionPercentage > 50 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Required: {filledRequiredFields}/{requiredFields.length}</span>
          <span>Optional: {filledOptionalFields}/{optionalFields.length}</span>
        </div>
        {!isComplete && (
          <p className="mt-1 text-orange-600">
            {filledRequiredFields < requiredFields.length 
              ? 'Complete required fields first' 
              : `Add ${4 - filledOptionalFields} more optional fields for completion`
            }
          </p>
        )}
      </div>
    </div>
  )
}