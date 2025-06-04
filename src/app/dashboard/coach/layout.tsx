"use client";

import * as React from "react";

/**
 * Coach Layout
 * 
 * Layout wrapper for all coach dashboard pages.
 * Provides consistent structure for coach-specific functionality.
 */
export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="coach-layout">
      {children}
    </div>
  );
}
