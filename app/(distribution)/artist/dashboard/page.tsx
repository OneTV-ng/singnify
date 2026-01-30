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
  Megaphone,
  Video,
  Star,
  Newspaper,
  Wifi,
  Heart,
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
    { icon: BarChart3, label: 'Analytics', href: "/artist/analytics" },
    { icon: Megaphone, label: 'Promotions', href: "/artist/promotions" },
    { icon: Video, label: 'Videos', href: "/artist/videos" },
    { icon: Star, label: 'Points & Rewards', href: "/artist/points" },
    { icon: Newspaper, label: 'News & Updates', href: "/artist/news" },
    { icon: Wifi, label: 'Streaming Platforms', href: "/artist/streaming" },
    { icon: Settings, label: 'Settings', href: "/artist/settings" },
    { icon: Users, label: 'Referral Code', href: "/artist/referrals" },
    { icon: Code, label: 'Song Codes', href: "/artist/codes" },
    { icon: CreditCard, label: 'Payment', href: "/artist/payment" },
    { icon: PiggyBank, label: 'Bank Account', href: "/artist/bank" },
    { icon: LinkIcon, label: 'Social Distribution', href: "/artist/social-distribution" },
    { icon: Trash2, label: 'Takedown Request', href: "/artist/takedown" },
    { icon: Heart, label: "Likes", href: "/artist/likes" },
  //  { icon: Code, label: "Song Codes", href: "/artist/codes" },
    { icon: DollarSign, label: 'Royalties', href: "/artist/royalty" },
    { icon: UserCog, label: 'Profile Settings', href: "/member/profile" },
    { icon: Headphones, label: 'Contact Support', href: "/support" },
    { icon: User, label: 'About', href: "/about" },
    { icon: Power, label: 'Log Out', href: "/signout" },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please log in to view your Dashboard</p>
          <Link href="/signin" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          Artist Dashboard
        </h1>
        <Button variant="ghost" className="rounded-full p-2 hover:bg-gray-800 relative">
          <Bell className="w-6 h-6 text-gray-300" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map(({ icon: Icon, label, href, badge }, i) => (
          <Link key={i} href={href} className="block">
            <Card className="bg-gray-800 border border-gray-700 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer">
              <CardContent className="p-0 flex flex-col items-center">
                <div className="bg-indigo-600 p-3 rounded-full mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-center font-medium text-gray-200">{label}</p>
                {badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {badge}
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}