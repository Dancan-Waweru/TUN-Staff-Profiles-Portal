import Link from 'next/link'
import TharakaLogo from './TharakaLogo'

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <TharakaLogo size="md" showText={false} />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">
                  Tharaka University
                </span>
                <span className="text-accent text-xs">
                  Education for Freedom
                </span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Tharaka University is committed to providing quality education and fostering 
              academic excellence across all disciplines.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faculties" className="text-gray-300 hover:text-white transition-colors">Faculties</Link></li>
              <li><Link href="/departments" className="text-gray-300 hover:text-white transition-colors">Departments</Link></li>
              <li><Link href="/library" className="text-gray-300 hover:text-white transition-colors">Library</Link></li>
              <li>
                <a 
                  href="https://www.tharaka.ac.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  University Website ↗
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p className="text-white font-medium">Tharaka University</p>
              <p>P.O. Box 193-60215, Marimanti</p>
              <p>Email: info@tharaka.ac.ke</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Tharaka University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}