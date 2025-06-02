"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  User,
  ClipboardList,
  Star,
  //BarChart3,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Navigation item interface
 */
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
  /**
   * Controls the collapsed/expanded state
   */
  isCollapsed: boolean;
  /**
   * Function to toggle the collapsed state
   */
  setIsCollapsed: (isCollapsed: boolean) => void;
  /**
   * Optional custom classes
   */
  className?: string;
}

/**
 * Sidebar Component
 * 
 * A collapsible navigation sidebar with smooth animations.
 * Features navigation links, progression indicator, and team information.
 */
export function Sidebar({ isCollapsed, setIsCollapsed, className }: SidebarProps) {
  const pathname = usePathname();

  // Navigation items configuration
  const navItems: NavItem[] = [
    { name: "Tableau de Bord", href: "/dashboard", icon: Home },
    { name: "Équipes", href: "/dashboard/teams", icon: Users },
    { name: "Joueurs", href: "/dashboard/players", icon: User },
    { name: "Entraînements", href: "/dashboard/trainings", icon: ClipboardList },
    { name: "Évaluations", href: "/dashboard/evaluations", icon: Star },
  ];

  // Animation variants for the sidebar
  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };

  // Animation variants for text elements
  const textVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 shadow-sm",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <motion.div
                className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    variants={textVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="text-xl font-bold text-gray-900"
                  >
                    UpGr8
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {/* Collapse Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "ml-auto transition-all",
                isCollapsed && "ml-0"
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start relative",
                          isActive && "bg-red-50 text-red-600 hover:bg-red-100",
                          isCollapsed && "justify-center"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5",
                          isCollapsed ? "mr-0" : "mr-3"
                        )} />
                        <AnimatePresence mode="wait">
                          {!isCollapsed && (
                            <motion.span
                              variants={textVariants}
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                              className="text-sm"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-r-full"
                          />
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          {/* Progression Section */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-4 border-t border-gray-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-bold text-red-600">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-500">
                    15 évaluations complétées cette semaine
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User/Team Section */}
          <div className="p-4 border-t border-gray-200">
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "space-x-3"
            )}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    variants={textVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Coach Martin
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Les Titans • 2024-2025
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}