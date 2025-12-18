'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.string().min(1, 'Authors are required'),
  url: z.string().min(1, 'Publication URL is required').url('Must be a valid URL'),
  year: z.string().min(1, 'Year is required').refine((val) => {
    const num = parseInt(val)
    return num >= 1900 && num <= 2030
  }, 'Year must be between 1900 and 2030')
})

const publicationsFormSchema = z.object({
  publications: z.array(publicationSchema).min(1, 'At least one publication is required').max(5, 'Maximum 5 publications allowed')
})

type PublicationFormData = z.infer<typeof publicationSchema>
type PublicationsFormData = z.infer<typeof publicationsFormSchema>

interface Publication {
  id: string
  title: string
  authors: string
  url?: string
  year?: number
  createdAt: string
}

export default function PublicationsManager() {
  const [existingPublications, setExistingPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<PublicationsFormData>({
    resolver: zodResolver(publicationsFormSchema),
    defaultValues: {
      publications: [{ title: '', authors: '', url: '', year: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'publications'
  })

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/publications')
      if (response.ok) {
        const data = await response.json()
        setExistingPublications(data)
      }
    } catch (error) {
      console.error('Failed to fetch publications:', error)
      toast.error('Failed to load publications')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: PublicationsFormData) => {
    console.log('Submitting publications:', data.publications.length)
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/publications/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publications: data.publications }),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Successfully added ${result.count} publication(s)!`)
        reset({
          publications: [{ title: '', authors: '', url: '', year: '' }]
        })
        fetchPublications()
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        toast.error('Failed to save publications: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Exception:', error)
      toast.error('An error occurred while saving publications')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addPublication = () => {
    if (fields.length < 5) {
      append({ title: '', authors: '', url: '', year: '' })
    } else {
      toast.error('Maximum 5 publications allowed at once')
    }
  }

  const clearAllFields = () => {
    reset({
      publications: [{ title: '', authors: '', url: '', year: '' }]
    })
    toast.success('All fields cleared')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return

    try {
      const response = await fetch(`/api/publications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Publication deleted!')
        fetchPublications()
      } else {
        toast.error('Failed to delete publication')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading publications...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Publications ({fields.length}/5)
          </h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={addPublication}
              disabled={fields.length >= 5}
              className="btn-secondary disabled:opacity-50"
            >
              Add Publication
            </button>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={clearAllFields}
                className="text-red-600 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Publication {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    {...register(`publications.${index}.title`)}
                    className="form-input"
                    placeholder="Publication title"
                  />
                  {errors.publications?.[index]?.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.publications[index]?.title?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Authors *</label>
                  <input
                    type="text"
                    {...register(`publications.${index}.authors`)}
                    className="form-input"
                    placeholder="Author names (e.g., John Doe, Jane Smith)"
                  />
                  {errors.publications?.[index]?.authors && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.publications[index]?.authors?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Publication URL *</label>
                    <input
                      type="url"
                      {...register(`publications.${index}.url`)}
                      className="form-input"
                      placeholder="https://example.com/publication"
                    />
                    {errors.publications?.[index]?.url && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.publications[index]?.url?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Year *</label>
                    <input
                      type="number"
                      {...register(`publications.${index}.year`)}
                      className="form-input"
                      placeholder="2024"
                      min="1900"
                      max="2030"
                    />
                    {errors.publications?.[index]?.year && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.publications[index]?.year?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {errors.publications && (
            <p className="text-red-500 text-sm">
              {errors.publications.message}
            </p>
          )}



          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Publications...' : `Save ${fields.length} Publication(s)`}
            </button>
          </div>
        </form>
      </div>

      {existingPublications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Publications ({existingPublications.length})
          </h3>
          
          <div className="space-y-4">
            {existingPublications.map((publication) => (
              <div key={publication.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{publication.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{publication.authors}</p>
                    {publication.year && (
                      <p className="text-gray-500 text-sm">Year: {publication.year}</p>
                    )}
                    {publication.url && (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        View Publication →
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleDelete(publication.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {existingPublications.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>No publications added yet.</p>
          <p className="text-sm">Add your first publication using the form above.</p>
        </div>
      )}
    </div>
  )
}