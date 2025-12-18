'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.string().min(1, 'Authors are required'),
  url: z.string().min(1, 'Publication URL is required').url('Must be a valid URL'),
  year: z.string().min(1, 'Year is required')
})

type PublicationFormData = z.infer<typeof publicationSchema>

interface Publication {
  id: string
  title: string
  authors: string
  url?: string
  year?: number
  createdAt: string
}

interface AdminPublicationsManagerProps {
  profileId: string
}

export default function AdminPublicationsManager({ profileId }: AdminPublicationsManagerProps) {
  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
  })

  useEffect(() => {
    if (profileId) {
      fetchPublications()
    }
  }, [profileId])

  const fetchPublications = async () => {
    try {
      const response = await fetch(`/api/admin/publications/${profileId}`)
      if (response.ok) {
        const data = await response.json()
        setPublications(data)
      }
    } catch (error) {
      console.error('Failed to fetch publications:', error)
      toast.error('Failed to load publications')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: PublicationFormData) => {
    setIsSubmitting(true)
    try {
      const url = editingId 
        ? `/api/admin/publications/${profileId}/${editingId}` 
        : `/api/admin/publications/${profileId}`
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingId ? 'Publication updated!' : 'Publication added!')
        reset()
        setEditingId(null)
        fetchPublications()
      } else {
        toast.error('Failed to save publication')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (publication: Publication) => {
    setEditingId(publication.id)
    setValue('title', publication.title)
    setValue('authors', publication.authors)
    setValue('url', publication.url || '')
    setValue('year', publication.year?.toString() || '')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return

    try {
      const response = await fetch(`/api/admin/publications/${profileId}/${id}`, {
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

  const handleCancel = () => {
    reset()
    setEditingId(null)
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Publication' : 'Add New Publication'}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Title *</label>
            <input
              type="text"
              {...register('title')}
              className="form-input"
              placeholder="Publication title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Authors *</label>
            <input
              type="text"
              {...register('authors')}
              className="form-input"
              placeholder="Author names (e.g., John Doe, Jane Smith)"
            />
            {errors.authors && (
              <p className="text-red-500 text-sm mt-1">{errors.authors.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Publication URL</label>
              <input
                type="url"
                {...register('url')}
                className="form-input"
                placeholder="https://example.com/publication"
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Year</label>
              <input
                type="number"
                {...register('year')}
                className="form-input"
                placeholder="2024"
                min="1900"
                max="2030"
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update Publication' : 'Add Publication'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {publications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Publications ({publications.length})
          </h3>
          
          <div className="space-y-4">
            {publications.map((publication) => (
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
                      onClick={() => handleEdit(publication)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
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

      {publications.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>No publications added yet.</p>
          <p className="text-sm">Add the first publication using the form above.</p>
        </div>
      )}
    </div>
  )
}