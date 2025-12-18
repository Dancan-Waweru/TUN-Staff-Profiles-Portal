'use client'

import { useEffect } from 'react'
import TharakaLogo from '@/components/TharakaLogo'

export default function LibraryRedirectPage() {
  useEffect(() => {
    // Redirect to the library website
    window.location.href = 'https://library.tharaka.ac.ke'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <TharakaLogo size="xl" className="justify-center mb-8" />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-primary mb-2">Redirecting to Library</h1>
        <p className="text-gray-600 mb-4">
          You are being redirected to the Tharaka University Library website...
        </p>
        <a 
          href="https://library.tharaka.ac.ke"
          className="btn-primary"
        >
          Continue to Library →
        </a>
      </div>
    </div>
  )
}