"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import {
  Music, Upload, TrendingUp, User, DollarSign, Bell,
  Settings, Play, Heart, Eye, Download, Plus,
  BarChart3, Users, Calendar, Headphones, Loader2, AlertCircle
} from 'lucide-react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';

interface Track {
  id: string | number;
  music_id?: string | number;
  track_name?: string;
  name?: string;
  base_name?: string;
  label?: string;
  genre?: string;
  image?: string;
  no_plays?: string | number;
  no_downloads?: string | number;
  Play?: string | number;
  Download?: string | number;
  time_number?: string;
}

interface DashboardStats {
  totalStreams: string;
  monthlyListeners: string;
  totalEarnings: string;
  songsUploaded: number;
}

export default function ArtistDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const { data: session, status } = useSession();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalStreams: '0',
    monthlyListeners: '0',
    totalEarnings: '$0',
    songsUploaded: 0
  });
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);

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
          const unseenCount = data.notifications.filter((notif: any) => !notif.IsSeen).length;
          setNotificationCount(unseenCount);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchDashboardData = async () => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiClient = getSingnifyApiClient();

      // Set token for authenticated requests
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      // Fetch tracks and calculate stats
      const [tracks, calculatedStats] = await Promise.all([
        apiClient.getUserTracks(),
        apiClient.calculateDashboardStats()
      ]);

      // Update stats
      setStats(calculatedStats);

      // Get recent tracks (top 5 by plays)
      const sortedTracks = [...tracks]
        .sort((a, b) => {
          const playsA = parseInt(a.no_plays || a.Play || '0');
          const playsB = parseInt(b.no_plays || b.Play || '0');
          return playsB - playsA;
        })
        .slice(0, 5);

      setRecentTracks(sortedTracks);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchNotificationCount();
      fetchDashboardData();
    }
  }, [session]);

  // Format numbers for display
  const formatNumber = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Map tracks to recent songs format
  const recentSongs = recentTracks.map((track, index) => ({
    id: track.id || track.music_id || index,
    title: track.track_name || track.name || track.base_name || 'Untitled',
    streams: formatNumber(track.no_plays || track.Play || 0),
    likes: formatNumber(parseInt(String(track.no_plays || track.Play || '0')) * 0.05), // Estimate likes as 5% of plays
    status: 'Published',
    image: track.image || null
  }));



  const menuItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview', color: 'bg-blue-500', href: "/artist/analytics", disabled: true  },
    { id: 'upload', icon: Upload, label: 'Upload', color: 'bg-green-500' , href: "/artist/upload" },
    { id: 'songs', icon: Music, label: 'My Songs', color: 'bg-purple-500' , href: "/artist/songs"},
    { id: 'albums', icon: Play, label: 'Albums', color: 'bg-orange-500' , href: "/artist/albums"},
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', color: 'bg-pink-500' , href: "/artist/analytics", disabled: true  },
    { id: 'royalties', icon: DollarSign, label: 'Royalties', color: 'bg-yellow-500', href: "/artist/royalty" },
    { id: 'profile', icon: User, label: 'Profile', color: 'bg-indigo-500' , href: "/member/profile" },
    { id: 'notifications', icon: Bell, label: 'Notifications', color: 'bg-red-500', href: "/artist/notification", badge: notificationCount > 0 ? notificationCount.toString() : undefined }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {session?.user.FirstName}!
            </h1>
            <p className="text-slate-300">
              Your Music Journey Continues
            </p>
          </div>
          <div className=" hidden flex items-center space-x-4">
            <div className="relative">
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                
              </span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
     
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 mb-8 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="flex-1">
              <p className="text-red-400 font-medium">Error loading dashboard data</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="ml-3 text-slate-300">Loading dashboard data...</span>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Headphones className="w-8 h-8" />
              <span className="text-blue-200 text-sm">+12%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.totalStreams}</h3>
            <p className="text-blue-200">Total Streams</p>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8" />
              <span className="text-green-200 text-sm">+8%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.monthlyListeners}</h3>
            <p className="text-green-200">Monthly Listeners</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <span className="text-yellow-200 text-sm">+15%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.totalEarnings}</h3>
            <p className="text-yellow-200">Total Earnings</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Music className="w-8 h-8" />
              <span className="text-purple-200 text-sm">+3</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.songsUploaded}</h3>
            <p className="text-purple-200">Songs Uploaded</p>
          </div>
        </div>
        )}

        {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Menu */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => (              <a href={item.href}>

                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      activeSection === item.id 
                        ? 'bg-white/20 shadow-lg' 
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                  </button></a>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mt-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Ready to Upload?</h3>
              <p className="text-green-100 text-sm mb-4">
                Share your latest creation with the world
              </p>
              <a href="/artist/upload">
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload New Track</span>
              </button></a>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Songs</h2>
                <button className="text-purple-400 hover:text-purple-300 flex items-center space-x-1">
                  <span>View All</span>
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {recentSongs.map((song) => (
                  <div key={song.id} className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {/* Album Cover Thumbnail */}
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500">
                        {song.image ? (
                          <img
                            src={song.image}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Music className="w-6 h-6 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-white font-medium">{song.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                          <span className="flex items-center space-x-1">
                            <Play className="w-3 h-3" />
                            <span>{song.streams}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{song.likes}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          song.status === 'Published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {song.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Preview */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Performance Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">89K</p>
                  <p className="text-slate-400 text-sm">Profile Views</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Download className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">12K</p>
                  <p className="text-slate-400 text-sm">Downloads</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-8 h-8 text-pink-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">45K</p>
                  <p className="text-slate-400 text-sm">Total Likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}