// components/LoadingOverlay.tsx
'use client'

import React from 'react'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  transparent?: boolean
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = 'Loading...', 
  transparent = false 
}) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className={`absolute inset-0 ${
        transparent ? 'bg-black/20 backdrop-blur-[2px]' : 'bg-black/50 backdrop-blur-sm'
      }`} />
      
      {/* Loading Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center min-w-[280px] animate-fade-in-up">
        {/* Medical-themed spinner */}
        <div className="relative w-24 h-24 mb-4">
          {/* Outer ring - medical cross pattern */}
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          
          {/* Spinning medical cross */}
          <div className="absolute inset-0 border-4 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
          
          {/* Inner medical cross */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-12 h-12">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-600 transform -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-1 h-full bg-blue-600 transform -translate-x-1/2 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Loading message */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>
        
        {/* Progress dots */}
        <div className="flex space-x-2 mt-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        </div>

        {/* Pulse effect rings */}
        <div className="absolute -z-10">
          <div className="w-32 h-32 border-4 border-blue-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-blue-300 rounded-full animate-ping opacity-10 [animation-delay:0.5s]"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay