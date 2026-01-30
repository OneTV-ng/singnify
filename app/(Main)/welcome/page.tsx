// app/welcome/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(userPrefersDark);
      document.documentElement.classList.toggle("dark", userPrefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const username = session?.user?.name || "Music Lover";
  const userImage = session?.user?.image || "/default-avatar.png";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-yellow-400 transition"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="max-w-xl text-center">
        <div className="mb-6">
          <Image
            src={userImage}
            alt={username}
            width={100}
            height={100}
            className="rounded-full border-4 border-blue-500 dark:border-yellow-400 shadow-md"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome, {username}!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          You’ve just landed on your personalized music community space.
        </p>
        <p className="text-md mt-2 text-gray-600 dark:text-gray-400">
          Follow your favorite artists, share playlists, and vibe with the community.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 transition">
            Explore Music
          </button>
          <button className="px-6 py-2 rounded-xl bg-gray-300 text-gray-900 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition">
            Join a Fan Group
          </button>
        </div>
      </div>
    </div>
  );
}
