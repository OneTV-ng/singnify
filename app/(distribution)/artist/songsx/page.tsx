"use client";
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Play, Download, Music, Album, List, MoreVertical, Clock, Eye, AlertCircle } from 'lucide-react';
import {UserType , Track} from "@/app/lib/types";

const ArtistSongsPage = () => {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState<Track[]|any[]|[]>([]);
  const [member, setMember] = useState <UserType|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState('songs');

  console.log("Session data:", session);

  useEffect(() => {
    if (session) {
      fetchUserTracks();
    } else if (session === null) {
      // Session is null, user is not authenticated
      setLoading(false);
      setError("Authentication required");
    }
  }, [session]);

  const fetchUserTracks = async () => {
    if (!session) {
      setError("No session available");
      setLoading(false);
      return;
    }

    // Get token from session - supporting multiple possible locations
    const token = session.accessToken || session?.user?.Token || '';
    
    if (!token) {
      setError("No authentication token available");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('token', token);

      const response = await fetch('https://singnify.com/api/v2/php/get-user-tracks.php?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c', {
        method: 'POST',
        body: formData,
        // Add headers to handle CORS if needed
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      console.log(data);
      
      // Check for successful response
      if (data.status === "200" && data.message === "success") {
        setMember(data.member);
        setTracks(data.result || []);
        setError(null); // Clear any previous errors
      } else {
        // Handle API-level errors
        throw new Error(data.message || `API returned status: ${data.status}`);
      }
    } catch (err: any) {
      console.error('Error fetching tracks:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load tracks';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Network error - please check your connection';
      } else if (err.message.includes('401')) {
        errorMessage = 'Authentication failed - please sign in again';
      } else if (err.message.includes('403')) {
        errorMessage = 'Access denied - insufficient permissions';
      } else if (err.message.includes('404')) {
        errorMessage = 'API endpoint not found';
      } else if (err.message.includes('500')) {
        errorMessage = 'Server error - please try again later';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Don't set fallback data - let user see the actual error
      setTracks([]);
      setMember(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSongClick = (trackId: string) => {
    // Navigate to song page using the music_id or id from API
    window.location.href = `/artist/song/${trackId}`;
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    switch(tab) {
      case 'albums':
        window.location.href = '/artist/albums';
        break;
      case 'playlists':
        window.location.href = '/artist/playlists';
        break;
      default:
        setActiveTab('songs');
    }
  };

  const handleRetry = () => {
    if (session) {
      fetchUserTracks();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/auth/signin' });
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback to redirect
      window.location.href = '/auth/signin';
    }
  };

  // Show loading while session is loading
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading session...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if no session
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Music className="mx-auto mb-4 text-purple-400" size={64} />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please sign in to view your tracks and manage your music.</p>
          <button 
            onClick={() => window.location.href = '/auth/signin'}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-900 border-l-4 border-red-500 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <AlertCircle className="text-red-400 mr-2" size={20} />
              <div>
                <p className="text-red-100 font-medium">
                  {error.includes('Authentication') || error.includes('sign in') ? 'Authentication Error' : 'Error Loading Tracks'}
                </p>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {(error.includes('Authentication') || error.includes('sign in')) && (
                <button 
                  onClick={handleSignOut}
                  className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              )}
              <button 
                onClick={handleRetry}
                className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              <img 
                src={member?.Picture || '/api/placeholder/160/160'} 
                alt={member?.StageName || member?.FirstName + ' ' + member?.LastName}
                className="w-full h-full object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src= '/api/placeholder/160/160';
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold">
                  {member?.StageName || `${member?.FirstName} ${member?.LastName}` || 'Unknown Artist'}
                </h1>
                {member?.IsVerified === "1" && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-lg mb-2">@{member?.Username || 'unknown'}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                {member?.Membership && (
                  <span className="bg-purple-600 px-2 py-1 rounded-full text-xs capitalize">
                    {member.Membership}
                  </span>
                )}
                {member?.Country && <span>{member.Country}</span>}
                <span>{tracks.length} track{tracks.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            {[
              { id: 'songs', label: 'Songs', icon: Music },
              { id: 'albums', label: 'Albums', icon: Album },
              { id: 'playlists', label: 'Playlists', icon: List }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400 bg-gray-700'
                      : 'border-transparent text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm text-gray-400 font-medium">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Track</div>
              <div className="col-span-2">Genre</div>
              <div className="col-span-1 flex items-center gap-1">
                <Clock size={14} />
              </div>
              <div className="col-span-1 flex items-center gap-1">
                <Eye size={14} />
              </div>
              <div className="col-span-1"></div>
            </div>
            
            {tracks.map((track, index) => (
              <div
                key={track.id || track.music_id || index}
                onClick={() => handleSongClick(track.id || track.music_id)}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors group"
              >
                <div className="col-span-1 flex items-center">
                  <div className="group-hover:hidden text-gray-400">{index + 1}</div>
                  <Play className="hidden group-hover:block text-purple-400" size={16} />
                </div>
                
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                    <img 
                      src={track.image || '/api/placeholder/48/48'} 
                      alt={track.track_name || 'Track'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                          (e.target as HTMLImageElement).src= '/api/placeholder/48/48';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                      {track.track_name || track.base_name || 'Unknown Track'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {track.artist_name || track.label || 'Unknown Artist'}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center">
                  {track.genre && (
                    <span className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                      {track.genre}
                    </span>
                  )}
                </div>
                
                <div className="col-span-1 flex items-center text-gray-400">
                  {track.duration || '--:--'}
                </div>
                
                <div className="col-span-1 flex items-center text-gray-400">
                  {track.no_plays || '0'}
                </div>
                
                <div className="col-span-1 flex items-center">
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {tracks.map((track, index) => (
            <div
              key={track.id || track.music_id || index}
              onClick={() => handleSongClick(track.id || track.music_id)}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={track.image || '/api/placeholder/64/64'} 
                    alt={track.track_name || 'Track'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src= '/api/placeholder/64/64';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="text-white" size={20} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">
                    {track.track_name || track.base_name || 'Unknown Track'}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {track.artist_name || track.label || 'Unknown Artist'}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {track.genre && (
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                        {track.genre}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {track.duration || '--:--'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {track.no_plays || '0'} plays
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:bg-gray-600 rounded-full transition-colors"
                >
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tracks.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <Music className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No tracks found</h3>
            <p className="text-gray-500">Upload your first track to get started</p>
            <button 
              onClick={handleRetry}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistSongsPage;