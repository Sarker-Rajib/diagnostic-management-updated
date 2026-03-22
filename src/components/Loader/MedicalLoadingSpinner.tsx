// components/MedicalLoadingSpinner.tsx
'use client'

import React from 'react'

interface MedicalLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'red' | 'green' | 'purple'
  text?: string
}

const MedicalLoadingSpinner: React.FC<MedicalLoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const colorClasses = {
    blue: {
      border: 'border-blue-200',
      top: 'border-t-blue-600',
      right: 'border-r-blue-600',
      cross: 'bg-blue-600'
    },
    red: {
      border: 'border-red-200',
      top: 'border-t-red-600',
      right: 'border-r-red-600',
      cross: 'bg-red-600'
    },
    green: {
      border: 'border-green-200',
      top: 'border-t-green-600',
      right: 'border-r-green-600',
      cross: 'bg-green-600'
    },
    purple: {
      border: 'border-purple-200',
      top: 'border-t-purple-600',
      right: 'border-r-purple-600',
      cross: 'bg-purple-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background ring */}
        <div className={`absolute inset-0 border-4 ${colors.border} rounded-full`}></div>
        
        {/* Spinning ring */}
        <div className={`absolute inset-0 border-4 ${colors.top} ${colors.right} border-b-transparent border-l-transparent rounded-full animate-spin-slow`}></div>
        
        {/* Medical cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-1/2 h-1/2">
            <div className={`absolute top-1/2 left-0 w-full h-1 ${colors.cross} transform -translate-y-1/2 rounded-full`}></div>
            <div className={`absolute top-0 left-1/2 w-1 h-full ${colors.cross} transform -translate-x-1/2 rounded-full`}></div>
          </div>
        </div>
      </div>
      {text && (
        <p className={`mt-4 text-${color}-600 font-medium animate-pulse`}>{text}</p>
      )}
    </div>
  )
}

export default MedicalLoadingSpinner