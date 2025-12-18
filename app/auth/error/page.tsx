'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Linking Issue',
          message: 'This email is already associated with another account. Please try signing in with a different method or contact support.',
          suggestion: 'Try clearing your browser cookies and signing in again.'
        }
      case 'OAuthCallback':
        return {
          title: 'OAuth Callback Error',
          message: 'There was an issue with the Google authentication process.',
          suggestion: 'Please try signing in again.'
        }
      case 'Configuration':
        return {
          title: 'Configuration Error',
          message: 'There is a configuration issue with the authentication system.',
          suggestion: 'Please contact the system administrator.'
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred during sign in.',
          suggestion: 'Please try again or contact support if the problem persists.'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {errorInfo.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {errorInfo.message}
          </p>
          {errorInfo.suggestion && (
            <p className="mt-2 text-sm text-blue-600">
              {errorInfo.suggestion}
            </p>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <Link
            href="/auth/signin"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Try Again
          </Link>
          
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Debug Info:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}