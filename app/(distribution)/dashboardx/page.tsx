"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from "next-auth/react";
import Link from 'next/link';  

import {


  Bell,
  UploadCloud,
  Music,
  Album,
  UserCog,
  DollarSign,
  Settings,
  Users,
  Code,
  CreditCard,
  PiggyBank,
  BarChart3,
  Link as LinkIcon,
  Trash2,
  Headphones,
  User,
  Power,
} from 'lucide-react';

export default function ArtistDashboard() {
  const { data: session, status } = useSession();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const fetchNotificationCount = async () => {
    if (!session?.accessToken) return;

    try {
      const API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c';
      const apiUrl = `https://singnify.com/api/v2/php/notifications.php?API_KEY=${API_KEY}`;

      const formData = new FormData();
      formData.append('token', session.accessToken);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === '200' && data.notifications) {
          // Count unseen notifications
          const unseenCount = data.notifications.filter((notif: any) => !notif.IsSeen).length;
          setNotificationCount(unseenCount);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchNotificationCount();
    }
  }, [session]);

  const cards = [
    { icon: UploadCloud, label: 'Upload Music', href: "/artist/upload" },
    { icon: Music, label: 'Manage Songs', href: "/artist/songs" },
    { icon: Album, label: 'Albums', href: "/artist/albums" },
    { icon: Bell, label: 'Notifications', href: "/artist/notification", badge: notificationCount > 0 ? notificationCount.toString() : undefined },
    { icon: Settings, label: 'Settings', href: "/artist/settings" },
    { icon: Users, label: 'Referral Code', href: "/artist/referrals" },
    { icon: Code, label: 'Song Codes', href: "/artist/codes" },
    { icon: CreditCard, label: 'Payment', href: "/artist/payment" },
    { icon: PiggyBank, label: 'Bank Account', href: "/artist/bank" },
    { icon: BarChart3, label: 'Analytics', href: "/artist/analytics", disabled: true },
    { icon: LinkIcon, label: 'Social Distribution', href: "/artist/social-distribution" },
    { icon: Trash2, label: 'Takedown Request', href: "/artist/takedown" },
    { icon: DollarSign, label: 'Royalties', href: "/artist/royalty" },
    { icon: UserCog, label: 'Profile Settings', href: "/artist/profile" },
    { icon: Headphones, label: 'Contact Support', href: "/artist/support" },
    { icon: User, label: 'About', href: "/artist/about" },
    { icon: Power, label: 'Log Out', href: "/logout" },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen  bg-background text-color flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background text-color flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Please log in to view your Dashboard</p>
          <Link href="/signin" className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-color to-gray-950 p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Artist Dashboard
        </h1>
        <Button variant="ghost" className="rounded-full p-2 hover:bg-gray-800">
          <Bell className="w-6 h-6 text-pink-400" />
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map(({ icon: Icon, label, href, badge, disabled }, i) => (
          <Link key={i} href={href} className={`block ${disabled ? 'pointer-events-none' : ''}`}>
            <Card className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02] transition-all duration-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-2 rounded-full mb-4 shadow-md shadow-pink-500/20">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <p className={`text-lg font-medium text-center ${disabled ? 'text-gray-400' : 'text-gray-200'}`}>{label}</p>
              {badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}