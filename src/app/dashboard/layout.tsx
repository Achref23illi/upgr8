"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SimpleLoadingScreen } from "@/components/common/SimpleLoadingScreen";

/**
 * Dashboard Layout
 * 
 * Wraps all pages under the /dashboard route with the DashboardLayout component.
 * Provides consistent sidebar, topbar, and content structure with loading screen.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDashboardLoading, setIsDashboardLoading] = React.useState(true);

  // Show loading screen for 1.5 seconds when dashboard first loads
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsDashboardLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Dashboard loading screen */}
      <SimpleLoadingScreen isLoading={isDashboardLoading} />
      
      {/* Show dashboard after loading */}
      {!isDashboardLoading && <DashboardLayout>{children}</DashboardLayout>}
    </>
  );
}