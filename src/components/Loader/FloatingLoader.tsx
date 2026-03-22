// components/FloatingLoader.tsx
'use client'

import React from 'react'
import MedicalLoadingSpinner from './MedicalLoadingSpinner'

interface FloatingLoaderProps {
  isLoading: boolean
  type?: 'fullscreen' | 'inline' | 'minimal'
  message?: string
  progress?: number
}

const FloatingLoader: React.FC<FloatingLoaderProps> = ({ 
  isLoading, 
  type = 'fullscreen',
  message,
  progress 
}) => {
  if (!isLoading) return null

  if (type === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Animated gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-md animate-gradient-xy"></div>
        
        {/* Floating loader card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center transform animate-float">
          {/* Animated rings */}
          <div className="relative w-32 h-32 mb-6">
            {/* Pulsing rings */}
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 border-4 border-purple-200 rounded-full animate-ping opacity-20 [animation-delay:0.3s]"></div>
            
            {/* Spinning medical symbol */}
            <div className="absolute inset-0 border-4 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
            
            {/* Medical cross */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-14 h-14">
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-y-1/2 rounded-full"></div>
                <div className="absolute top-0 left-1/2 w-1.5 h-full bg-gradient-to-b from-blue-600 to-purple-600 transform -translate-x-1/2 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{message}</h3>
          )}

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="w-64 mt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Loading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Bouncing dots */}
          <div className="flex space-x-2 mt-4">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2.5 h-2.5 bg-pink-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'minimal') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-full shadow-lg px-4 py-3 flex items-center space-x-3 animate-slide-up">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">{message || 'Processing...'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <MedicalLoadingSpinner size="sm" color="blue" text={message} />
    </div>
  )
}

export default FloatingLoader