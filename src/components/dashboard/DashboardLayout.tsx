"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * Props for the DashboardLayout component
 */
interface DashboardLayoutProps {
  /**
   * The main content of the dashboard page
   */
  children: React.ReactNode;
  /**
   * Optional custom classes
   */
  className?: string;
}

/**
 * DashboardLayout Component
 * 
 * Main layout component that integrates Sidebar and Topbar.
 * Handles responsive behavior and state management for sidebar collapse.
 */
export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Handle mobile sidebar toggle
  const handleToggleMobileSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside or on navigation
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when screen size changes to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.div
        id="mobile-sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-40 h-full md:hidden"
      >
        <Sidebar 
          isCollapsed={false}
          setIsCollapsed={() => {}}
          className="w-64"
        />
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        animate={{
          marginLeft: isCollapsed ? 80 : 256,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:ml-64 md:transition-all md:duration-300 md:ease-in-out"
      >
        {/* Topbar */}
        <Topbar onToggleSidebar={handleToggleMobileSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6"
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      {/* Mobile Content Overlay to Close Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}