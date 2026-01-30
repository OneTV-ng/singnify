"use client"
import React, { useState, useEffect } from 'react';
import { 
  Music, Upload, TrendingUp, User, DollarSign, Bell, 
  Settings, Play, Heart, Eye, Download, Plus,
  BarChart3, Users, Calendar, Headphones, LogOut,
  Loader2, AlertCircle, CheckCircle, Search, Filter
} from 'lucide-react';

const API_BASE = 'https://singnify.com/api/v2/php';
const API_KEY = '7c6a180b36896a0a8c02787eeafb0e4c';

export default function CompleteSingnifyDashboard() {
  // State management
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState(null);
  const [userTracks, setUserTracks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showLogin, setShowLogin] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Handle login function
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (loginForm.email === 'office@nicholasidoko.com' && loginForm.password === 'Nickzom2021#') {
        const mockUserData = {
          ID: "9237",
          Username: "nicholasoffice",
          EmailAddress: "office@nicholasidoko.com",
          FirstName: "Nicholas",
          LastName: "Idoko",
          Picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          Gender: "Male",
          Phone: "+2347039247359",
          Country: "Nigeria",
          StageName: "Nicholas Office",
          RecordLabel: "NIT Animation Studios",
          About: "Professional software developer and music producer creating innovative soundscapes.",
          IsArtist: "1",
          Token: "29d56683b0e8211939ec45f6e17c26bfcee561db",
          IsVerified: "1"
        };

        setUser(mockUserData);
        setIsLoggedIn(true);
        setShowLogin(false);
        
        sessionStorage.setItem('userToken', mockUserData.Token);
        sessionStorage.setItem('userId', mockUserData.ID);
        sessionStorage.setItem('userData', JSON.stringify(mockUserData));
        
        await loadMockDashboardData();
      } else {
        setError('Invalid credentials. Use: office@nicholasidoko.com / Nickzom2021#');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load mock dashboard data
  const loadMockDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTracks = [
        {
          id: "8567",
          track_name: "Midnight Dreams",
          label: "NIT Animation Studios",
          genre: "R&B",
          language: "English",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
          no_plays: "24580",
          no_downloads: "3420",
          duration: "04:23",
          status: "Published",
          likes: "892",
          isLiked: false,
          uploadDate: "2024-01-15"
        },
        {
          id: "8466",
          track_name: "Electric Nights", 
          label: "NIT Animation Studios",
          genre: "Electronic",
          language: "English",
          image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
          no_plays: "18750",
          no_downloads: "2890",
          duration: "03:45",
          status: "Published",
          likes: "567",
          isLiked: true,
          uploadDate: "2024-01-10"
        },
        {
          id: "8471",
          track_name: "Golden Hour",
          label: "NIT Animation Studios", 
          genre: "Pop",
          language: "English",
          image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop",
          no_plays: "12340",
          no_downloads: "1750",
          duration: "03:12",
          status: "Published",
          likes: "423",
          isLiked: false,
          uploadDate: "2024-01-08"
        },
        {
          id: "8472",
          track_name: "Neon Lights",
          label: "NIT Animation Studios",
          genre: "Hip-Hop",
          language: "English", 
          image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
          no_plays: "8920",
          no_downloads: "1230",
          duration: "04:01",
          status: "Processing",
          likes: "234",
          isLiked: false,
          uploadDate: "2024-01-05"
        }
      ];
      
      const mockAnalytics = {
        total_plays: "64590",
        monthly_listeners: "28450",
        total_earnings: "4250",
        total_downloads: "9290",
        profile_views: "15670",
        total_likes: "2116",
        growth_rate: "+12.5",
        top_country: "Nigeria",
        top_genre: "R&B"
      };
      
      const mockNotifications = [
        {
          id: 1,
          title: "🎉 New Milestone Reached!",
          message: "Your track 'Midnight Dreams' has reached 25K plays!",
          date: "2 hours ago",
          type: "milestone",
          read: false
        },
        {
          id: 2,
          title: "💰 Royalty Payment Ready",
          message: "Your monthly royalty payment of $425 is ready for withdrawal.",
          date: "1 day ago", 
          type: "payment",
          read: false
        },
        {
          id: 3,
          title: "✅ Track Approved",
          message: "Your track 'Electric Nights' has been approved for all platforms.",
          date: "3 days ago",
          type: "approval",
          read: true
        },
        {
          id: 4,
          title: "📊 Weekly Report",
          message: "Your weekly analytics report is now available.",
          date: "5 days ago",
          type: "report", 
          read: true
        }
      ];

      setUserTracks(mockTracks);
      setAnalytics(mockAnalytics);
      setNotifications(mockNotifications);
      
    } catch (err) {
      setError('Failed to load dashboard data');
    }
  };

  // Auto-refresh analytics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        total_plays: String(parseInt(prev.total_plays) + Math.floor(Math.random() * 15)),
        profile_views: String(parseInt(prev.profile_views) + Math.floor(Math.random() * 8))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    setShowLogin(true);
    setUserTracks([]);
    setAnalytics(null);
    setNotifications([]);
    setActiveSection('overview');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setUploadFile(file);
    setUploadProgress(0);
    
    for (let i = 0; i <= 100; i++) {
      await new Promise(resolve => setTimeout(resolve, 40));
      setUploadProgress(i);
    }
    
    setTimeout(() => {
      const newTrack = {
        id: Date.now().toString(),
        track_name: file.name.replace(/\.[^/.]+$/, ""),
        label: user?.RecordLabel || "Independent",
        genre: "Unknown",
        language: "English",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        no_plays: "0",
        no_downloads: "0",
        duration: "00:00",
        status: "Processing",
        likes: "0",
        isLiked: false,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      setUserTracks(prev => [newTrack, ...prev]);
      setUploadProgress(0);
      setUploadFile(null);
      
      // Add success notification
      const successNotification = {
        id: Date.now(),
        title: "✅ Upload Successful",
        message: `Your track "${newTrack.track_name}" has been uploaded successfully!`,
        date: "Just now",
        type: "success",
        read: false
      };
      setNotifications(prev => [successNotification, ...prev]);
    }, 1000);
  };

  const toggleTrackLike = (trackId) => {
    setUserTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        const currentLikes = parseInt(track.likes || 0);
        const isLiked = track.isLiked || false;
        return {
          ...track,
          likes: String(isLiked ? currentLikes - 1 : currentLikes + 1),
          isLiked: !isLiked
        };
      }
      return track;
    }));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const getStats = () => {
    if (!analytics) {
      return {
        totalStreams: '0',
        monthlyListeners: '0', 
        totalEarnings: '$0',
        songsUploaded: userTracks.length || 0
      };
    }

    return {
      totalStreams: parseInt(analytics.total_plays).toLocaleString(),
      monthlyListeners: parseInt(analytics.monthly_listeners).toLocaleString(),
      totalEarnings: `$${parseInt(analytics.total_earnings).toLocaleString()}`,
      songsUploaded: userTracks.length || 0
    };
  };

  const filteredTracks = userTracks.filter(track => {
    const matchesSearch = track.track_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const stats = getStats();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview', color: 'bg-blue-500' },
    { id: 'upload', icon: Upload, label: 'Upload', color: 'bg-green-500' },
    { id: 'songs', icon: Music, label: 'My Songs', color: 'bg-purple-500' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', color: 'bg-pink-500' },
    { id: 'royalties', icon: DollarSign, label: 'Royalties', color: 'bg-yellow-500' },
    { id: 'profile', icon: User, label: 'Profile', color: 'bg-indigo-500' },
    { id: 'notifications', icon: Bell, label: 'Notifications', color: 'bg-red-500' }
  ];

  // Login Screen
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Singnify Artist</h1>
            <p className="text-slate-300">Sign in to your dashboard</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6">
              <div className="flex items-center text-red-400">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Email or Username
              </label>
              <input
                type="text"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email or username"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Demo credentials:<br />
              <span className="text-purple-400 font-mono">office@nicholasidoko.com</span><br />
              <span className="text-purple-400 font-mono">Nickzom2021#</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.FirstName || 'Artist'}!
            </h1>
            <p className="text-slate-300 text-lg">
              {user?.StageName && `${user.StageName} • `}
              {user?.RecordLabel}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {user?.Country} {user?.IsVerified === '1' && '• ✅ Verified Artist'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div 
              className="relative cursor-pointer"
              onClick={() => setActiveSection('notifications')}
            >
              <Bell className="w-6 h-6 text-white hover:text-purple-300 transition-colors" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
              {user?.Picture ? (
                <img src={user.Picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <Headphones className="w-8 h-8" />
              <span className="text-blue-200 text-sm">+{analytics?.growth_rate || '0'}%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.totalStreams}</h3>
            <p className="text-blue-200">Total Streams</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8" />
              <span className="text-green-200 text-sm">Monthly</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.monthlyListeners}</h3>
            <p className="text-green-200">Listeners</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <span className="text-yellow-200 text-sm">Total</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.totalEarnings}</h3>
            <p className="text-yellow-200">Earnings</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <Music className="w-8 h-8" />
              <span className="text-purple-200 text-sm">Uploaded</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.songsUploaded}</h3>
            <p className="text-purple-200">Songs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Menu */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      activeSection === item.id 
                        ? 'bg-white/20 shadow-lg scale-105' 
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    {item.id === 'notifications' && unreadNotifications > 0 && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Quick Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Ready to Upload?</h3>
              <p className="text-green-100 text-sm mb-4">
                Share your latest creation with the world
              </p>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4">
                  <div className="bg-white/20 rounded-full h-2 mb-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-green-100 text-xs">Uploading {uploadFile?.name}... {uploadProgress}%</p>
                </div>
              )}
              
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
                id="quick-audio-upload"
              />
              <label
                htmlFor="quick-audio-upload"
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Track</span>
              </label>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {activeSection === 'overview' && 'Recent Songs'}
                  {activeSection === 'songs' && 'All Your Songs'}
                  {activeSection === 'upload' && 'Upload Music'}
                  {activeSection === 'analytics' && 'Performance Analytics'}
                  {activeSection === 'notifications' && 'Notifications'}
                  {activeSection === 'profile' && 'Profile Information'}
                  {activeSection === 'royalties' && 'Royalties & Earnings'}
                </h2>
                
                {(activeSection === 'songs' || activeSection === 'overview') && (
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search tracks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content based on active section */}
              {activeSection === 'overview' && (
                <div className="space-y-4">
                  {filteredTracks.length > 0 ? (
                    filteredTracks.slice(0, 5).map((song) => (
                      <div key={song.id} className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={song.image} alt={song.track_name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{song.track_name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                              <span className="flex items-center space-x-1">
                                <Play className="w-3 h-3" />
                                <span>{parseInt(song.no_plays).toLocaleString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Download className="w-3 h-3" />
                                <span>{parseInt(song.no_downloads).toLocaleString()}</span>
                              </span>
                              <span className="text-slate-500">{song.genre}</span>
                              <span className="text-slate-500">{song.duration}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleTrackLike(song.id)}
                              className={`p-2 rounded-full transition-colors ${
                                song.isLiked 
                                  ? 'text-red-400 hover:text-red-300' 
                                  : 'text-slate-400 hover:text-red-400'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${song.isLiked ? 'fill-current' : ''}`} />
                            </button>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              song.status === 'Published' 
                                ? 'bg-green-500/20 text-green-400' 
                                : song.status === 'Processing'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {song.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No tracks found</p>
                      <p className="text-sm">Try adjusting your search or upload your first song!</p>
                      <button 
                        onClick={() => setActiveSection('upload')}
                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Upload Now
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'songs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <select 
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
                      >
                        <option value="all">All Genres</option>
                        <option value="R&B">R&B</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Pop">Pop</option>
                        <option value="Hip-Hop">Hip-Hop</option>
                      </select>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {filteredTracks.length} of {userTracks.length} tracks
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredTracks.map((song) => (
                      <div key={song.id} className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={song.image} alt={song.track_name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{song.track_name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                              <span className="flex items-center space-x-1">
                                <Play className="w-3 h-3" />
                                <span>{parseInt(song.no_plays).toLocaleString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Download className="w-3 h-3" />
                                <span>{parseInt(song.no_downloads).toLocaleString()}</span>
                              </span>
                              <span>{song.genre}</span>
                              <span>{song.duration}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-slate-400 hover:text-white transition-colors">
                              <Settings className="w-4 h-4" />
                            </button>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              song.status === 'Published' 
                                ? 'bg-green-500/20 text-green-400' 
                                : song.status === 'Processing'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {song.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'upload' && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">Upload Your Music</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Drag and drop your audio files here, or click to browse
                    </p>
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mb-4">
                        <div className="bg-slate-700 rounded-full h-3 mb-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-slate-300 text-sm">Uploading {uploadFile?.name}... {uploadProgress}%</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="audio-upload-main"
                    />
                    <label
                      htmlFor="audio-upload-main"
                      className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/30 rounded-xl p-6">
                      <h3 className="text-white font-medium mb-4">Upload Guidelines</h3>
                      <ul className="text-slate-400 text-sm space-y-2">
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Supported formats: MP3, WAV, FLAC</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Maximum file size: 100MB</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Minimum quality: 320 kbps</li>
                        <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Include cover art (1400x1400px)</li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-700/30 rounded-xl p-6">
                      <h3 className="text-white font-medium mb-4">Distribution Platforms</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-slate-300"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Spotify</div>
                        <div className="flex items-center text-slate-300"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Apple Music</div>
                        <div className="flex items-center text-slate-300"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />YouTube Music</div>
                        <div className="flex items-center text-slate-300"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Amazon Music</div>
                        <div className="flex items-center text-slate-300"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Deezer</div>
                        <div className="flex items-center text-slate-300"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />TIDAL</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                          notification.read 
                            ? 'bg-slate-700/20' 
                            : 'bg-slate-700/40 border-l-4 border-purple-500'
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-3 ${
                            notification.read ? 'bg-slate-500' : 'bg-purple-500'
                          }`}></div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{notification.title}</h3>
                            <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
                            <span className="text-slate-500 text-xs mt-2 block">{notification.date}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No notifications</p>
                      <p className="text-sm">You're all caught up!</p>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'profile' && user && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500">
                      <img src={user.Picture} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{user.FirstName} {user.LastName}</h3>
                      <p className="text-purple-400 text-lg">{user.StageName}</p>
                      {user.IsVerified === '1' && (
                        <div className="flex items-center text-green-400 mt-2">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span>Verified Artist</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Email</label>
                        <p className="text-white bg-slate-700/30 p-3 rounded-lg">{user.EmailAddress}</p>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Phone</label>
                        <p className="text-white bg-slate-700/30 p-3 rounded-lg">{user.Phone}</p>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Country</label>
                        <p className="text-white bg-slate-700/30 p-3 rounded-lg">{user.Country}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Record Label</label>
                        <p className="text-white bg-slate-700/30 p-3 rounded-lg">{user.RecordLabel}</p>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Gender</label>
                        <p className="text-white bg-slate-700/30 p-3 rounded-lg">{user.Gender}</p>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Artist ID</label>
                        <p className="text-white bg-slate-700/30 p-3 rounded-lg font-mono">{user.ID}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">About</label>
                    <p className="text-white bg-slate-700/30 p-4 rounded-lg">{user.About}</p>
                  </div>
                </div>
              )}

              {activeSection === 'analytics' && analytics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-700/30 rounded-xl p-6 text-center">
                      <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{parseInt(analytics.profile_views).toLocaleString()}</p>
                      <p className="text-slate-400 text-sm">Profile Views</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-6 text-center">
                      <Download className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{parseInt(analytics.total_downloads).toLocaleString()}</p>
                      <p className="text-slate-400 text-sm">Total Downloads</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-6 text-center">
                      <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{parseInt(analytics.total_likes).toLocaleString()}</p>
                      <p className="text-slate-400 text-sm">Total Likes</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h3 className="text-white font-medium mb-4">Top Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Top Country</span>
                        <span className="text-white font-medium">{analytics.top_country}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Top Genre</span>
                        <span className="text-white font-medium">{analytics.top_genre}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Growth Rate</span>
                        <span className="text-green-400 font-medium">{analytics.growth_rate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'royalties' && analytics && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
                    <p className="text-3xl font-bold">${parseInt(analytics.total_earnings).toLocaleString()}</p>
                    <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                      Request Withdrawal
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/30 rounded-xl p-6">
                      <h3 className="text-white font-medium mb-4">Earnings Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Streaming Revenue</span>
                          <span className="text-white">$3,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Download Revenue</span>
                          <span className="text-white">$850</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sync Licensing</span>
                          <span className="text-white">$200</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/30 rounded-xl p-6">
                      <h3 className="text-white font-medium mb-4">Payment History</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Dec 2024</span>
                          <span className="text-green-400">+$425</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Nov 2024</span>
                          <span className="text-green-400">+$380</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Oct 2024</span>
                          <span className="text-green-400">+$320</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Analytics Preview for Overview */}
            {activeSection === 'overview' && analytics && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mt-6">
                <h2 className="text-xl font-semibold text-white mb-4">Performance Overview</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{parseInt(analytics.profile_views).toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">Profile Views</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Download className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{parseInt(analytics.total_downloads).toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">Downloads</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-8 h-8 text-pink-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{parseInt(analytics.total_likes).toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">Total Likes</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}