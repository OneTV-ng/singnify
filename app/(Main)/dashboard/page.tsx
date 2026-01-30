// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    try {
      if (!session) {
        // Not logged in, redirect to signin
        router.push('/signin');
        return;
      }

      // Check if user object exists and has IsArtist property
      if (!session.user) {
        setError('User information not available');
        return;
      }

      // Check if user is an artist (IsArtist = "1")
      const isArtist = session.user.IsArtist === "1";
      
      if (isArtist) {
        // Redirect to artist dashboard
        router.push('/artist/dashboard');
      } else {
        // Redirect to user dashboard
        router.push('/user/dashboard');
      }
    } catch (err) {
      console.error('Redirect error:', err);
      setError('An error occurred during redirect');
    }
  }, [session, status, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-400 mb-2">Error</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
        <p className="text-lg">Redirecting to your dashboard...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait</p>
      </div>
    </div>
  );
}