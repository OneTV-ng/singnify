import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

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
}

interface NotificationResponse {
  status: string;
  message: string;
  notifications: Notification[];
}

const NotificationBell: React.FC = () => {
  const { data: session } = useSession();
  const { theme, resolvedTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isDark = resolvedTheme === 'dark';

  const fetchNotifications = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
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
        if (data.status === '200' && data.notifications) {
          setNotifications(data.notifications);
          // Count unseen notifications
          const unseenCount = data.notifications.filter(notif => !notif.IsSeen).length;
          setUnreadCount(unseenCount);
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
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else if (diffInHours < 24 * 7) {
        const days = Math.floor(diffInHours / 24);
        return `${days}d ago`;
      } else if (diffInHours < 24 * 30) {
        const weeks = Math.floor(diffInHours / (24 * 7));
        return `${weeks}w ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recent';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    const cleanMessage = message.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return cleanMessage.length > maxLength 
      ? cleanMessage.substring(0, maxLength) + '...'
      : cleanMessage;
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.Title.includes('Approved')) {
      return '✅';
    } else if (notification.Title.includes('Declined')) {
      return '❌';
    } else if (notification.Title.includes('Promoted')) {
      return '🚀';
    }
    return '🔔';
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 transition-colors ${
          isDark 
            ? 'text-gray-300 hover:text-white' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border max-h-96 overflow-hidden z-50 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              <Link 
                href="/artist/notification"
                className={`text-sm transition-colors ${
                  isDark 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                View All
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className={`transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No notifications yet
              </div>
            ) : (
              <div>
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.ID}
                    className={`px-4 py-3 border-b cursor-pointer transition-colors ${
                      isDark 
                        ? `border-gray-700 hover:bg-gray-700 ${!notification.IsSeen ? 'bg-blue-900/30' : ''}` 
                        : `border-gray-50 hover:bg-gray-50 ${!notification.IsSeen ? 'bg-blue-50' : ''}`
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notification.ThumbImage ? (
                        <img
                          src={notification.ThumbImage}
                          alt={notification.Title}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            // Hide broken images
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isDark ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <span className="text-lg">
                            {getNotificationIcon(notification)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${
                          isDark ? 'text-gray-100' : 'text-gray-800'
                        }`}>
                          {notification.Title}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {truncateMessage(notification.Message)}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                          {formatDate(notification)}
                        </p>
                      </div>

                      {!notification.IsSeen && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className={`px-4 py-2 border-t ${
              isDark 
                ? 'border-gray-700 bg-gray-750' 
                : 'border-gray-100 bg-gray-50'
            }`}>
              <Link 
                href="/artist/notification"
                className={`text-sm block text-center transition-colors ${
                  isDark 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                View all {notifications.length} notifications
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;