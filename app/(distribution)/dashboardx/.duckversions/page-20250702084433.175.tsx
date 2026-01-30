"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from "next-auth/react";

import {
  Bell,
  UploadCloud,
  Music,
  Album,
  UserCog,
  DollarSign,
} from 'lucide-react';

const cards = [
  { icon: UploadCloud, label: 'Upload Music' },
  { icon: Music, label: 'Manage Songs' },
  { icon: Album, label: 'Albums' },
  { icon: UserCog, label: 'Profile Settings' },
  { icon: DollarSign, label: 'Royalties' },
  { icon: Bell, label: 'Notifications' },
];

export default function ArtistDashboard() {


export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Please log in to view your profile</p>
          <Link href="/signin" className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Artist Dashboard
        </h1>
        <Button variant="ghost" className="rounded-full p-2 hover:bg-gray-800">
          <Bell className="w-6 h-6 text-pink-400" />
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map(({ icon: Icon, label }, i) => (
          <Card
            key={i}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02] transition-transform duration-300 rounded-2xl p-6 flex flex-col items-center justify-center"
          >
            <div className="bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-2 rounded-full mb-4 shadow-md shadow-pink-500/20">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-medium text-gray-200">{label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
