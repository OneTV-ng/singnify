"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

import {
  LayoutDashboard,
  User,
  Upload,
  Home,
  Music,
  Album,
  Heart,
  Code,
  Headphones,
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  UserPlus,
  LayoutGrid,
  Compass,
  Mic,
  Grid3x3,
} from 'lucide-react'

const menuItems = [
    {
    label: "Home",
    href: "/home",
    icon: Home,
    description: "Main Home"
  },
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
    label: "Albums",
    href: "/artist/albums",
    icon: Album,
    description: "View your albums"
  },

  {
    label: "Artist HUB",
    href: "/artist/hub",
    icon: Headphones,
    description: "Artist control panel"
  },
  {
    label: "Discover",
    href: "/browse",
    icon: Compass,
    description: "Discover Songs"
  },
  {
    label: "Artist",
    href: "/artist",
    icon: Mic,
    description: "Music Discover"
  }
  
]
const old={
    label: "Browse",
    href: "/browse",
    icon: Grid3x3,
    description: "Find all"
  };

  
export default function Sidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isActive = (path: string) => pathname === path

  const authLinks = !user ? [
    { label: 'Sign In', href: '/signin', icon: UserIcon },
    { label: 'Sign Up', href: '/signup', icon: UserPlus },
  ] : []

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-3 left-[60px] z-50 p-2 rounded-lg bg-background"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex  bg-black/60 backdrop-blur-md fixed top-16 left-0 h-[calc(100vh-4rem)] w-[170px]  border-border  p-2 flex-col z-20">
        <nav className="space-y-1 flex-1 bg-black/60 backdrop-blur-md border border-white/10 text-white p-2 rounded-xl">
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-violet-600 bg-opacity-10 text-primary'
                    : 'hover:bg-secondary hover:bg-opacity-10'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            )
          })}

          {authLinks.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-secondary hover:bg-opacity-10 transition-colors"
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {user && (
          <div className="space-y-1  bg-black/60 backdrop-blur-md border border-white/10 text-white p-2 rounded-xl mt-4">
            {user?.IsAdmin === '1' && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-secondary hover:bg-opacity-10"
              >
                <LayoutGrid className="h-5 w-5 mr-3" />
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/profile/settings"
              className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-secondary hover:bg-opacity-10"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-3 text-sm rounded-lg hover:bg-secondary hover:bg-opacity-10"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-background z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden pt-16`}
      >
        <nav className="space-y-1 p-6">
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-violet-600 bg-opacity-10 text-primary'
                    : 'hover:bg-secondary hover:bg-opacity-10'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            )
          })}

          <div className="border-t border-border my-2  w-[170px] bg-black/60 backdrop-blur-md  border-border  p-2 flex-col" />

          {authLinks.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-secondary hover:bg-opacity-10"
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            )
          })}

          {user && (
            <>
              {user?.IsAdmin === '1' && (
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-secondary hover:bg-opacity-10"
                >
                  <LayoutGrid className="h-5 w-5 mr-3" />
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/profile/settings"
                className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-secondary hover:bg-opacity-10"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
              <button
                onClick={() => {
                  signOut()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center w-full px-4 py-3 text-sm rounded-lg hover:bg-secondary hover:bg-opacity-10"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  )
}
