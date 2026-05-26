import TharakaLogo from '@/components/TharakaLogo'
import Link from 'next/link'

export default function PendingApproval() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border-t-4 border-primary">
        <div className="flex justify-center mb-6">
          <TharakaLogo size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Pending Approval</h1>
        <p className="text-gray-600 mb-8">
          Thank you for joining the Tharaka University Staff Portal. 
          Your account is currently being reviewed by the administration.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> You will be able to access the dashboard and create your profile once an admin approves your request.
          </p>
        </div>
        <Link href="/" className="btn-primary w-full inline-block">
          Return to Directory
        </Link>
      </div>
    </div>
  )
}
