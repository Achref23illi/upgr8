"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Dumbbell, 
  ClipboardCheck,
  Settings,
  HelpCircle,
  MessageCircle,
  Shield
} from "lucide-react";

interface NavItem {
  name: string;
  href?: string;
  count?: number;
  icon: React.ElementType;
  onClick?: () => void;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  className?: string;
  onChatOpen?: () => void;
}

export function Sidebar({ isCollapsed, className, onChatOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: "Tableau de bord", href: "/dashboard/coach", icon: LayoutDashboard },
    { name: "Équipes", href: "/dashboard/teams", count: 3, icon: Users },
    { name: "Joueurs", href: "/dashboard/players", count: 156, icon: UserCheck },
    { name: "Entraînement", href: "/dashboard/trainings", icon: Dumbbell },
    { name: "Évaluations", href: "/dashboard/evaluations", count: 34, icon: ClipboardCheck },
    { name: "Personnel", href: "/dashboard/staff", icon: Shield },
    { name: "Messages", icon: MessageCircle, count: 2, onClick: onChatOpen },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 shadow-xl transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center px-6 border-b border-gray-700 bg-gray-800">
        {!isCollapsed ? (
          <div className="bg-white px-4 py-2 rounded-lg">
            <Image 
              src="/logo.png" 
              alt="UpGr8" 
              width={140} 
              height={48}
              className="w-auto h-8"
            />
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.href ? pathname === item.href : false;
            
            const linkContent = (
              <>
                {isCollapsed && (
                  <item.icon className="w-5 h-5 mx-auto transition-all duration-200" />
                )}
                <span className={cn(
                  "transition-opacity duration-200",
                  isCollapsed ? "sr-only" : ""
                )}>
                  {item.name}
                </span>
                {item.count && !isCollapsed && (
                  <span className={cn(
                    "ml-auto text-xs px-2 py-1 rounded-full transition-colors",
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                  )}>
                    {item.count}
                  </span>
                )}
                {item.count && isCollapsed && (
                  <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded transition-opacity z-50">
                    {item.name} ({item.count})
                  </span>
                )}
              </>
            );

            if (item.onClick) {
              return (
                <li key={item.name}>
                  <button
                    onClick={item.onClick}
                    className={cn(
                      "w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-700/50 relative",
                      "text-gray-300 hover:text-white text-left"
                    )}
                  >
                    {linkContent}
                  </button>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link 
                  href={item.href!}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-700/50 relative",
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                      : "text-gray-300 hover:text-white"
                  )}
                >
                  {linkContent}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-700 bg-gray-800">
        {/* User info */}
        {!isCollapsed && (
          <div className="mb-4 pb-4 border-b border-gray-700">
            <div className="flex items-center px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-white">CM</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Coach Martin</p>
                <p className="text-xs text-gray-400">Les Titans</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Link 
            href="/dashboard/settings"
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-all duration-200 relative",
              isCollapsed ? "justify-center" : ""
            )}
          >
            {isCollapsed && (
              <Settings className="w-4 h-4 mx-auto transition-all duration-200" />
            )}
            <span className={cn(isCollapsed ? "sr-only" : "")}>Paramètres</span>
            {isCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded transition-opacity z-50">
                Paramètres
              </span>
            )}
          </Link>
          <Link 
            href="/help"
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-all duration-200 relative",
              isCollapsed ? "justify-center" : ""
            )}
          >
            {isCollapsed && (
              <HelpCircle className="w-4 h-4 mx-auto transition-all duration-200" />
            )}
            <span className={cn(isCollapsed ? "sr-only" : "")}>Aide</span>
            {isCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded transition-opacity z-50">
                Aide
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}