"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Menu,
  Settings,
  User,
  LogOut,
  MessageSquare,
  Calendar,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  //Tooltip,
  //TooltipContent,
  TooltipProvider,
  //TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Props for the Topbar component
 */
interface TopbarProps {
  /**
   * Function to call when the hamburger/menu icon is clicked
   */
  onToggleSidebar: () => void;
  /**
   * Optional custom classes
   */
  className?: string;
}

/**
 * Mock notification data
 */
interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
}

/**
 * Topbar Component
 * 
 * Header bar with search, notifications, and user menu.
 * Responsive design with mobile hamburger menu.
 */
export function Topbar({ onToggleSidebar, className }: TopbarProps) {
  const [searchValue, setSearchValue] = React.useState("");

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Nouvelle évaluation",
      description: "Martin Dubois a été évalué",
      time: "Il y a 5 min",
      read: false,
      icon: TrendingUp,
    },
    {
      id: "2",
      title: "Entraînement planifié",
      description: "Entraînement demain à 19h00",
      time: "Il y a 1h",
      read: false,
      icon: Calendar,
    },
    {
      id: "3",
      title: "Message reçu",
      description: "Nouveau message des parents",
      time: "Il y a 2h",
      read: true,
      icon: MessageSquare,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchValue);
    // TODO: Implement search functionality
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <TooltipProvider delayDuration={0}>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 md:px-6",
          className
        )}
      >
        {/* Left Section - Mobile Menu & Search */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher joueurs, équipes..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 pr-4 w-full"
            />
          </form>
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-red-600 font-normal">
                    {unreadCount} non lues
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex items-start space-x-3 p-3 cursor-pointer",
                        !notification.read && "bg-blue-50/50"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        notification.read ? "bg-gray-100" : "bg-red-100"
                      )}>
                        <Icon className={cn(
                          "h-4 w-4",
                          notification.read ? "text-gray-600" : "text-red-600"
                        )} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
              {notifications.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  Aucune notification
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatar.jpg" alt="Coach Avatar" />
                  <AvatarFallback className="bg-red-100 text-red-600 font-semibold">
                    CM
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Coach Martin</p>
                  <p className="text-xs leading-none text-gray-500">
                    coach.martin@upgr8.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => window.location.href = "/dashboard/profile"}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => window.location.href = "/dashboard/settings"}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}