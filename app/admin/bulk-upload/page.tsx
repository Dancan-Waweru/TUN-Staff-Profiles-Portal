'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function BulkUploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  const onSubmit = async (data: any) => {
    const file = data.csvFile[0]
    if (!file) {
      toast.error('Please select a CSV file')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/bulk-upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Successfully uploaded ${result.count} profiles`)
        reset()
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `firstName,lastName,middleName,title,position,department,faculty,email,phone,officeLocation,biography,qualifications,researchInterests,linkedinUrl,googleScholarUrl,orcidUrl,researchgateUrl,websiteUrl
John,Doe,,Dr.,Professor,COMPUTER_SCIENCE_ICT,PHYSICAL_SCIENCES_ENGINEERING_TECHNOLOGY,john.doe@tharakauniversity.ac.ke,+254700000000,Room 101,"Professor of Computer Science with 15 years experience","PhD Computer Science - MIT, MSc Software Engineering - Stanford","Artificial Intelligence, Machine Learning, Data Science",https://linkedin.com/in/johndoe,https://scholar.google.com/citations?user=johndoe,https://orcid.org/0000-0000-0000-0000,https://www.researchgate.net/profile/John-Doe,https://johndoe.com
Jane,Smith,,Prof.,Associate Professor,HEALTH_SCIENCES,HEALTH_SCIENCES,jane.smith@tharakauniversity.ac.ke,+254700000001,Room 201,"Leading researcher in public health","PhD Public Health - Harvard, MPH - Johns Hopkins","Public Health Policy, Epidemiology, Health Systems",https://linkedin.com/in/janesmith,https://scholar.google.com/citations?user=janesmith,https://orcid.org/0000-0000-0000-0001,https://www.researchgate.net/profile/Jane-Smith,https://janesmith.com`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'staff_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bulk Upload Staff
              </h1>
              <p className="text-gray-600">Upload multiple staff profiles via CSV</p>
            </div>
            <Link href="/admin" className="btn-secondary">
              ← Back to Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Instructions
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• File must be in CSV format (.csv)</li>
                  <li>• First row should contain column headers</li>
                  <li>• Required fields: firstName, lastName, title, position, department, faculty, email</li>
                  <li>• Optional fields: middleName, phone, officeLocation, biography, qualifications, researchInterests</li>
                  <li>• Use exact department and faculty codes (see template)</li>
                </ul>
              </div>
              
              <button
                onClick={downloadTemplate}
                className="btn-secondary mb-4"
              >
                Download CSV Template
              </button>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="form-label">Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  {...register('csvFile', { required: true })}
                  className="form-input"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn-primary disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload Staff Profiles'}
                </button>
              </div>
            </form>

            {/* Department and Faculty Codes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Faculty Codes</h3>
                <div className="text-sm space-y-1">
                  <div><code className="bg-gray-100 px-1">HEALTH_SCIENCES</code> - Faculty of Health Sciences</div>
                  <div><code className="bg-gray-100 px-1">LIFE_SCIENCES_NATURAL_RESOURCES</code> - Faculty of Life Sciences and Natural Resources</div>
                  <div><code className="bg-gray-100 px-1">BUSINESS_STUDIES</code> - Faculty of Business Studies</div>
                  <div><code className="bg-gray-100 px-1">EDUCATION</code> - Faculty of Education</div>
                  <div><code className="bg-gray-100 px-1">HUMANITIES_SOCIAL_SCIENCES</code> - Faculty of Humanities and Social Sciences</div>
                  <div><code className="bg-gray-100 px-1">PHYSICAL_SCIENCES_ENGINEERING_TECHNOLOGY</code> - Faculty of Physical Sciences, Engineering and Technology</div>
                  <div><code className="bg-gray-100 px-1">LAW</code> - Faculty of Law</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Department Codes</h3>
                <div className="text-sm space-y-1">
                  <div><code className="bg-gray-100 px-1">DRY_LAND_AGRICULTURE_NATURAL_RESOURCES</code> - Department of Dry Land Agriculture and Natural Resources</div>
                  <div><code className="bg-gray-100 px-1">BUSINESS_ADMINISTRATION</code> - Department of Business Administration</div>
                  <div><code className="bg-gray-100 px-1">EDUCATION</code> - Department of Education</div>
                  <div><code className="bg-gray-100 px-1">HUMANITIES</code> - Department of Humanities</div>
                  <div><code className="bg-gray-100 px-1">SOCIAL_SCIENCE</code> - Department of Social Science</div>
                  <div><code className="bg-gray-100 px-1">BASIC_SCIENCES</code> - Department of Basic Sciences</div>
                  <div><code className="bg-gray-100 px-1">COMPUTER_SCIENCE_ICT</code> - Department of Computer Science & ICT</div>
                  <div><code className="bg-gray-100 px-1">HEALTH_SCIENCES</code> - Department of Health Sciences</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}