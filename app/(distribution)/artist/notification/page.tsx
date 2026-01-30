'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Music, CheckCircle, XCircle, TrendingUp, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

interface Notification {
  ID: string;
  Title: string;
  Message: string;
  Image: string | null;
  ThumbImage: string | null;
  ButtonName: string | null;
  URL: string | null;
  AppURL: string | null;
  DateCreated: string;
  TimeNumber: string;
  IsSeen: boolean;
  IsRateNote: string;
  Counter: string;
}

interface NotificationResponse {
  status: string;
  message: string;
  notifications: Notification[];
}

const NotificationsPage: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'track-updates' | 'promotions' | 'general'>('all');

  const isDark = resolvedTheme === 'dark';

  const fetchNotifications = async () => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }

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
        const data: NotificationResponse = await response.json();
        console.log('Notifications data:', data);

        if (data.status === '200' && data.notifications) {
          setNotifications(data.notifications);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [session]);

  const parseNotificationDate = (notification: Notification): Date => {
    // Try to parse DateCreated first - format: "2025-08-28 07:10:02 PM WAT"
    if (notification.DateCreated) {
      // Remove timezone abbreviation and parse the date string
      const dateString = notification.DateCreated.replace(/ [A-Z]{3}$/, '');
      
      // Parse the date string with AM/PM format
      const date = new Date(dateString);
      
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // Fallback to TimeNumber (assuming it's a Unix timestamp string)
    if (notification.TimeNumber) {
      const timestamp = parseInt(notification.TimeNumber);
      if (!isNaN(timestamp)) {
        // Check if it's in seconds or milliseconds
        const dateFromTimeNumber = timestamp > 10000000000 
          ? new Date(timestamp) // milliseconds
          : new Date(timestamp * 1000); // seconds
        if (!isNaN(dateFromTimeNumber.getTime())) {
          return dateFromTimeNumber;
        }
      }
    }

    // Final fallback - use current date
    console.warn('Could not parse date for notification:', notification.ID);
    return new Date();
  };

  const formatDate = (notification: Notification) => {
    try {
      const date = parseNotificationDate(notification);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24 * 7) {
        const days = Math.floor(diffInHours / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24 * 30) {
        const weeks = Math.floor(diffInHours / (24 * 7));
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24 * 365) {
        const months = Math.floor(diffInHours / (24 * 30));
        return `${months} month${months !== 1 ? 's' : ''} ago`;
      } else {
        const years = Math.floor(diffInHours / (24 * 365));
        return `${years} year${years !== 1 ? 's' : ''} ago`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recent';
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.Title.includes('Approved')) {
      return <CheckCircle className="text-green-500" size={24} />;
    } else if (notification.Title.includes('Declined')) {
      return <XCircle className="text-red-500" size={24} />;
    } else if (notification.Title.includes('Promoted')) {
      return <TrendingUp className="text-blue-500" size={24} />;
    } else if (notification.Image || notification.ThumbImage) {
      return <Music className="text-purple-500" size={24} />;
    }
    return <Bell className="text-gray-500" size={24} />;
  };

  const getNotificationType = (notification: Notification): 'track-updates' | 'promotions' | 'general' => {
    if (notification.Title.includes('Approved') || notification.Title.includes('Declined')) {
      return 'track-updates';
    } else if (notification.Title.includes('Promoted') || notification.Title.includes('Promotion')) {
      return 'promotions';
    }
    return 'general';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return getNotificationType(notification) === filter;
  });

  const getFilterCounts = () => {
    return {
      all: notifications.length,
      'track-updates': notifications.filter(n => getNotificationType(n) === 'track-updates').length,
      promotions: notifications.filter(n => getNotificationType(n) === 'promotions').length,
      general: notifications.filter(n => getNotificationType(n) === 'general').length,
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/artist/dashboard"
              className="p-2 rounded-lg hover:bg-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Stay updated with your music journey</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setFilter('track-updates')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'track-updates'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Track Updates ({counts['track-updates']})
            </button>
            <button
              onClick={() => setFilter('promotions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'promotions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Promotions ({counts.promotions})
            </button>
            <button
              onClick={() => setFilter('general')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'general'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              General ({counts.general})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "You'll see notifications about your tracks and account activity here."
                  : `No ${filter.replace('-', ' ')} notifications at the moment.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.ID}
                className={`bg-white rounded-lg border transition-all hover:shadow-md ${
                  !notification.IsSeen ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon or Image */}
                    <div className="flex-shrink-0">
                      {notification.ThumbImage ? (
                        <img
                          src={notification.ThumbImage}
                          alt={notification.Title}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {(!notification.ThumbImage || notification.ThumbImage === '') && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          {getNotificationIcon(notification)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {notification.Title}
                        </h3>
                        {!notification.IsSeen && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>

                      <div 
                        className="text-gray-600 mb-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: notification.Message.replace(/\n/g, '<br />') 
                        }}
                      />

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {formatDate(notification)}
                        </p>

                        {notification.URL && notification.ButtonName && (
                          <a
                            href={notification.URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            {notification.ButtonName}
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More or Pagination could go here */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={fetchNotifications}
              className="px-6 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              Refresh notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;