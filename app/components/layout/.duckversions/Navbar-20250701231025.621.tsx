"use client";
import { useState } from "react";
import Link from "next/link";
//import { useAuth } from "@/app/context/AuthContext";
import { useSession } from "next-auth/react";

//import { useTheme } from "@/app/context/ThemeContext";
import { Bell, Sun, Moon, LogIn, UserPlus, Search } from "lucide-react";
import {Track, UserType} from "@/app/lib/types";
import {ThemeSelector}from '@/app/components/ThemeSelector'
//import { ThemeSelector } from '@/app/components/ThemeSelector';


export default function Navbar() {
  const { data: session } = useSession();
 // const { user } = useAuth();
 const user:UserType|undefined = session?.user;
  //const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-surface z-30 
    dark:bg-black/50 bg-white/50 transition-all duration-300
       bottom-0  
        bg-surface/50 backdrop-blur-md 
     border-secondary/20  ">
      <div className="h-full flex items-center justify-between px-4 ">
        {/* Logo and Brand */}
        <div className="flex left-8 items-center">
          <Link href="/" className="flex items-center">
            <img src="/images/logo.png" alt="Singnify" className="ml-6 h-12 w-12" />
            <span className="ml-2 text-xl font-bold hidden md:block">Singnify</span>
          </Link>
        </div>

        {/* Middle: Search bar on mobile */}
        <div className="flex items-center md:hidden space-x-2">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-40 py-1 px-2 border rounded-md text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Theme toggle */}
       <ThemeSelector/>

          {user ? (
            <>
              {/* Notifications */}
              <button className="p-2 rounded-full hover:bg-secondary hover:bg-opacity-10 relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-primary rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* User info */}
              <div className="flex items-center space-x-3">
                <img
                  src={user?.Avatar || "/assets/images/ProfilePictures/default-avatar.png"}
                  alt={user?.FirstName}
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-medium hidden md:block">{user.FirstName}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Sign in button for mobile */}
              <Link
                href="/signin"
                className=" bg-white text-black p-1 rounded-full font-small text-sm hover:scale-120 transition  flex items-center space-x-1  rounded-lg  hover:bg-opacity-10 md:hidden "  >
                SignIn
              </Link> 
              {/* Sign in button for desktop */}
              <div className="hidden md:flex" >
              <Link  href="/signup" className="bg-black text-sm text-white px-4 py-1 rounded-full text-sm font-medium hover:scale-105 transition mr-4">
                Sign Up
              </Link>
              <Link   href="/signin" className="bg-white text-sm text-black px-8 py-2 rounded-full font-medium hover:scale-105 transition">
                Sing In
              </Link> </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const mx = `
 <div className="flex items-center space-x-2">
              {/* Sign in button for mobile */}
              <Link
                href="/signin"
                className="  flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-secondary hover:bg-opacity-10 md:hidden "
              >
                <LogIn className="h-5 w-5" />
              </Link>

              {/* Sign in button for desktop */}

              <Link
                href="/signin"
                className="hidden md:flex items-center  space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <LogIn className="h-5 w-5" /> 
                <span>Sign In</span>
              </Link>
            </div>

            
              <Link className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium hover:scale-105 transition mr-4">
                Sign Up
              </Link>
              <Link className="bg-white text-black px-8 py-2 rounded-full font-medium hover:scale-105 transition">
                Log In
              </Link>
            </div>





             <div className="flex items-center space-x-2">
              {/* Sign in button for mobile */}
              <Link
                href="/signin"
                className="  flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-secondary hover:bg-opacity-10 md:hidden "
              >
                <LogIn className="h-5 w-5" />
              </Link>

              {/* Sign in button for desktop */}

              <Link
                href="/signin"
                className="hidden md:flex items-center  space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <LogIn className="h-5 w-5" /> 
                <span>Sign In</span>
              </Link>
            </div>
`