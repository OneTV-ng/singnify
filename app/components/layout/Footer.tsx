"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Search, Mic2, Library, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [minimized, setMinimized] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation items with their paths and icons
  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Browse", path: "/browse", icon: Search },
    { name: "DashBoard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Library", path: "/library", icon: Library },
  ];

  // Reset timer on user activity
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMinimized(false);
    timerRef.current = setTimeout(() => setMinimized(true), 3000);
  };

  useEffect(() => {
    // Listen for mouse and touch activity
   // window.addEventListener("mousemove", resetTimer);
   // window.addEventListener("touchstart", resetTimer);
    resetTimer(); // Start timer on mount

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Expand on mouse enter, minimize on mouse leave (if idle)
  const handleMouseEnter = () => setMinimized(false);
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setMinimized(true), 3000);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-16 z-30 bg-black border-t border-gray-800 transition-all duration-300 ${
        minimized ? "h-8" : "h-16"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ overflow: "hidden" }}
    >
      <div
        className={`h-full max-w-lg mx-auto flex items-center justify-between px-4 transition-all duration-300 ${
          minimized ? "justify-center" : ""
        }`}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center justify-center flex-1 h-full transition-all duration-300 ${
                minimized
                  ? "flex-row space-x-1 text-xs"
                  : "flex-col space-y-0 text-base"
              } ${
                isActive ? "text-orange-500" : "text-gray-400"
              } hover:text-orange-500`}
              style={{
                minWidth: minimized ? "auto" : "60px",
                padding: minimized ? "0 4px" : "0",
              }}
            >
              <IconComponent
                className={`transition-all duration-300 ${
                  minimized ? "w-4 h-4 mr-1 mb-0" : "w-5 h-5 mb-1"
                }`}
              />
              <span
                className={`transition-all duration-300 ${
                  minimized ? "text-xs" : "text-xs font-medium"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}