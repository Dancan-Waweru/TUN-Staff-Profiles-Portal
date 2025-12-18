import Image from 'next/image'

interface TharakaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

export default function TharakaLogo({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: TharakaLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Official Tharaka University Logo */}
      <div className={`${sizeClasses[size]} flex-shrink-0 relative`}>
        <Image
          src="/tharaka-university-logo.png"
          alt="Tharaka University Logo"
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary ${textSizeClasses[size]}`}>
            Tharaka University
          </span>
          <span className={`text-accent text-xs ${size === 'sm' ? 'hidden' : ''}`}>
            Education for Freedom
          </span>
        </div>
      )}
    </div>
  )
}