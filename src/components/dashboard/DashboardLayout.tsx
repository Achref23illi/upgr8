"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const pathname = usePathname();
  
  // Determine if this is a coach dashboard
  const isCoachDashboard = pathname?.includes('/dashboard/coach') || 
                          pathname?.includes('/dashboard/teams') ||
                          pathname?.includes('/dashboard/players') ||
                          pathname?.includes('/dashboard/trainings') ||
                          pathname?.includes('/dashboard/evaluations');

  return (
    <div className={cn("min-h-screen bg-gray-50 flex", className)}>
      {/* Fixed Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onChatOpen={() => setIsChatOpen(true)}
      />

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Fixed Topbar */}
        <Topbar 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 pt-16 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Chat Sidebar - only show for coach pages */}
      {isCoachDashboard && (
        <ChatSidebar
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          currentUser={{
            id: "coach-1",
            name: "Coach Martin",
            type: "coach"
          }}
        />
      )}
    </div>
  );
}