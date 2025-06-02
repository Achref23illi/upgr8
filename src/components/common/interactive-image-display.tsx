"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AppAssets } from "@/config/assets";

/**
 * Props for the InteractiveImageDisplay component
 */
export interface InteractiveImageDisplayProps {
  /**
   * Key to look up the base image path in AppAssets
   */
  baseImageKey?: string;
  /**
   * Optional text to display as overlay (e.g., "A", "AA", "AAA")
   */
  overlayText?: string;
  /**
   * Alt text for the base image
   */
  altText?: string;
  /**
   * Custom classes for the main container
   */
  className?: string;
  /**
   * Custom classes for the base motion.img element
   */
  imageClassName?: string;
  /**
   * Custom classes for the overlay text element
   */
  overlayClassName?: string;
}

/**
 * Helper function to get image path from nested AppAssets structure
 */
function getImagePath(key?: string): string | null {
  if (!key) return null;
  
  // Check in different asset categories
  const categories = ['coachLevels', 'teamCategories'] as const;
  
  for (const category of categories) {
    const assets = AppAssets[category] as Record<string, string> | undefined;
    if (assets && key in assets) {
      return assets[key];
    }
  }
  
  // Check placeholders as fallback
  if (AppAssets.placeholders?.defaultBackground) {
    return AppAssets.placeholders.defaultBackground;
  }
  
  return null;
}

/**
 * InteractiveImageDisplay Component
 * 
 * Displays a base image with an optional overlay image.
 * Uses framer-motion for smooth transitions when images change.
 * 
 * Features:
 * - Smooth fade animations when switching images
 * - Support for overlay images (e.g., stars, badges)
 * - Flexible styling options
 * - Handles missing images gracefully
 * - PNG images with white backgrounds work well
 */
export function InteractiveImageDisplay({
  baseImageKey,
  overlayText,
  altText = "Display image",
  className,
  imageClassName,
  overlayClassName,
}: InteractiveImageDisplayProps) {
  // Get image paths from AppAssets
  const baseImagePath = getImagePath(baseImageKey);

  // Animation variants for smooth transitions
  const imageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.1,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full h-full overflow-hidden rounded-lg bg-gray-50",
        className
      )}
    >
      {/* Base Image */}
      <AnimatePresence mode="wait">
        {baseImagePath && (
          <motion.img
            key={baseImageKey}
            src={baseImagePath}
            alt={altText}
            className={cn(
              "w-full h-full object-contain",
              imageClassName
            )}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        )}
      </AnimatePresence>

      {/* Overlay Text */}
      <AnimatePresence>
        {overlayText && (
          <motion.div
            key={overlayText}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div
              className={cn(
                "text-6xl font-bold text-red-600 bg-white/90 rounded-full w-24 h-24 flex items-center justify-center shadow-lg",
                overlayClassName
              )}
            >
              {overlayText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder when no image is available */}
      {!baseImagePath && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center p-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No image selected</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveImageDisplay;