"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  Bell, 
  Search, 
  ChevronDown, 
  User, 
  Settings, 
  Upload, 
  Music, 
  LayoutDashboard, 
  LogOut,
  Headphones
} from "lucide-react";
import { Track, UserType } from "@/app/lib/types";
import { ThemeSelector } from '@/app/components/ThemeSelector';

export default function Navbar() {
  const { data: session } = useSession();
  const user: UserType | undefined = session?.user;
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Main dashboard"
    },
    {
      label: "Profile",
      href: "/member/profile",
      icon: User,
      description: "View and edit profile"
    },
    {
      label: "Upload",
      href: "/artist/upload",
      icon: Upload,
      description: "Upload new music"
    },
    {
      label: "My Songs",
      href: "/artist/songs",
      icon: Music,
      description: "Manage your tracks"
    },
    {
      label: "Artist Dashboard",
      href: "/artist/",
      icon: Headphones,
      description: "Artist control panel"
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-30 
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-md 
      border-b border-gray-200/50 dark:border-gray-700/50 
      transition-all duration-300">
      <div className="h-full flex items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="Singnify" 
              className="h-10 w-10 rounded-lg" 
            />
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white hidden md:block">
              Singnify
            </span>
          </Link>
        </div>

        {/* Middle: Search bar on mobile */}
        <div className="flex items-center md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-40 pl-10 pr-4 py-2 
                bg-gray-100 dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 
                rounded-full text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                text-gray-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <ThemeSelector />

          {user ? (
            <>
              {/* Notifications */}
              <button className="relative p-2 rounded-full 
                hover:bg-gray-100 dark:hover:bg-gray-800 
                transition-colors duration-200">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 
                    bg-gradient-to-r from-blue-500 to-purple-600 
                    rounded-full text-xs flex items-center justify-center 
                    text-white font-medium shadow-lg">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl
                    hover:bg-gray-100 dark:hover:bg-gray-800 
                    transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={user?.Picture || "/assets/images/ProfilePictures/default-avatar.png"}
                      alt={user?.FirstName}
                      className="h-8 w-8 rounded-full border-2 border-transparent
                        group-hover:border-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600
                        shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 
                      bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white hidden md:block">
                    {user.FirstName}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 
                    ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 
                    bg-white dark:bg-gray-900 
                    border border-gray-200 dark:border-gray-700 
                    rounded-2xl shadow-2xl 
                    backdrop-blur-md
                    animate-in slide-in-from-top-2 duration-200
                    z-50">
                    
                    {/* User Info Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user?.Avatar || "/assets/images/ProfilePictures/default-avatar.png"}
                          alt={user?.FirstName}
                          className="h-12 w-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {user.FirstName} {user.LastName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 
                              rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
                              dark:hover:from-blue-900/20 dark:hover:to-purple-900/20
                              transition-all duration-200 group"
                          >
                            <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 
                              group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Sign Out */}
                    <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 
                          rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20
                          transition-all duration-200 group"
                      >
                        <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400 
                          group-hover:text-red-600 dark:group-hover:text-red-400" />
                        <span className="font-medium text-gray-900 dark:text-white 
                          group-hover:text-red-600 dark:group-hover:text-red-400">
                          Sign Out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Mobile Sign In */}
              <Link
                href="/signin"
                className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 
                  text-white px-4 py-2 rounded-full text-sm font-medium 
                  hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                Sign In
              </Link>

              {/* Desktop Sign In/Up */}
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/signup"
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                    px-6 py-2 rounded-full text-sm font-medium 
                    hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  Sign Up
                </Link>
                <Link
                  href="/signin"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 
                    text-white px-8 py-2 rounded-full font-medium 
                    hover:scale-105 transition-transform duration-200 shadow-lg
                    hover:shadow-xl"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}