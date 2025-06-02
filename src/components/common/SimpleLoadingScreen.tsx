"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the SimpleLoadingScreen component
 */
interface SimpleLoadingScreenProps {
  /**
   * Controls the visibility of the loading screen
   */
  isLoading: boolean;
  /**
   * Optional custom classes for the overlay container
   */
  className?: string;
}

/**
 * SimpleLoadingScreen Component
 * 
 * Displays a simple animated loading indicator with hockey branding.
 * Lightweight CSS-only animations for fast loading performance.
 * 
 * @param {SimpleLoadingScreenProps} props - Component props
 * @returns {JSX.Element | null} The loading screen component or null when not loading
 */
export function SimpleLoadingScreen({ isLoading, className }: SimpleLoadingScreenProps) {
  // Don't render anything if not loading
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-950/90",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Main loading content */}
      <div className="text-center space-y-8">
        {/* Hockey puck loading spinner */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto relative">
            {/* Hockey puck */}
            <div className="absolute inset-0 bg-black rounded-full border-4 border-white/30 animate-spin" 
                 style={{ animationDuration: '2s' }}>
              {/* Puck details */}
              <div className="absolute inset-2 rounded-full border border-white/20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-white/40 rounded-full"></div>
            </div>
            
            {/* Orbit ring */}
            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-white space-y-4">
          <h2 className="text-3xl font-bold tracking-wider">
            CHARGEMENT
          </h2>
          
          {/* Animated dots */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "1.4s"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-white via-red-200 to-white rounded-full animate-pulse">
              <div className="h-full bg-white/80 rounded-full animate-pulse" 
                   style={{ 
                     animation: 'loading-progress 3s ease-in-out infinite',
                     width: '100%'
                   }}>
              </div>
            </div>
          </div>
        </div>

        {/* UpGr8 branding */}
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg">U8</span>
          </div>
          <span className="text-white/80 text-lg font-medium tracking-wide">UpGr8 Hockey</span>
        </div>
      </div>

      {/* CSS-in-JS for custom animations */}
      <style jsx>{`
        @keyframes loading-progress {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}

export default SimpleLoadingScreen;