"use client"
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Play, Download, Music, Album, List, MoreVertical, Clock, Eye, AlertCircle, Disc3 } from 'lucide-react';
import {UserType , Track, AlbumType} from "@/app/lib/types";
import { usePlayer } from '@/app/context/PlayerContext';

const ArtistContentPage = () => {
  const { data: session } = useSession();
 const [tracks, setTracks] = useState<Track[]|any[]|[]>([]);
  const [member, setMember] = useState <UserType|null>(null);
    const [albums, setAlbums] = useState<AlbumType[]|any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState('songs');
  
  console.log("Session data:", session);

  useEffect(() => {
    if (session) {
      if (activeTab === 'songs') {
        fetchUserTracks();
      } else if (activeTab === 'albums') {
        fetchUserAlbums();
      }
    } else if (session === null) {
      setLoading(false);
      setError("Authentication required");
    }
  }, [session, activeTab]);

  const fetchUserTracks = async () => {
    if (!session) {
      setError("No session available");
      setLoading(false);
      return;
    }

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
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "200" && data.message === "success") {
        setMember(data.member);
        setTracks(data.result || []);






      } else {
        throw new Error(data.message || 'Failed to fetch tracks');
      }
    } catch (err:any) {
      console.error('Error fetching tracks:', err);
      setError(err.message);
      
      // Fallback sample data
      const sampleData = {
        member: {
          ID: "4",
          Username: "nickzom",
          FirstName: "Nicholas",
          LastName: "Idoko",
          Picture: "https://nextxtar.com/discover/../assets/images/ProfilePicture/1570317271_3684_3f1a49914ca514ee705bb1917998be2e.png",
          StageName: "Nicholas Idoko",
          Country: "Nigeria",
          Membership: "premium",
          IsVerified: "1"
        },
        result: [
          {
            track_name: "Mo Money",
            base_name: "Mo Money",
            label: "Nicholas",
            genre: "Hip-Hop",
            language: "English",
            image: "https://nextxtar.com/assets/images/CoverArt/Thumb/1587984696_cover_art_682406949.jpeg",
            duration: "01:05",
            id: "183",
            no_plays: "99",
            no_downloads: "0",
            artist_name: "nickzom"
          }
        ]
      };
      setMember(sampleData.member);
      setTracks(sampleData.result);
    } finally {
      setLoading(false);
    }
  };



  
  const fetchUserAlbums = async () => {
    if (!session) {
      setError("No session available");
      setLoading(false);
      return;
    }

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

      const response = await fetch('https://singnify.com/api/v2/php/user-albums.php?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "200" && data.message === "success") {
        setMember(data.member);
        setAlbums(data.albums || []);
      } else {
        throw new Error(data.message || 'Failed to fetch albums');
      }
    } catch (err:any) {
      console.error('Error fetching albums:', err);
      setError(err.message);
      
      // Fallback sample album data
      const sampleAlbums = [
        {
          id: "1",
          title: "Midnight Sessions",
          artist: "Nicholas Idoko",
          cover_art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
          release_date: "2024-01-15",
          track_count: "12",
          genre: "R&B",
          total_plays: "1,250"
        },
        {
          id: "2",
          title: "Digital Dreams",
          artist: "Nicholas Idoko",
          cover_art: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
          release_date: "2023-08-20",
          track_count: "8",
          genre: "Electronic",
          total_plays: "890"
        }
      ];
      setAlbums(sampleAlbums);
    } finally {
      setLoading(false);
    }
  };
 
  const handleItemClick = (itemId:string, type = 'song') => {
    if (type === 'album') {
      window.location.href = `/artist/album/${itemId}`;
    } else {
      window.location.href = `/artist/song/${itemId}`;
    }
  };

  const handleTabClick = (tab:string) => {
    if (tab === 'playlists') {
      window.location.href = '/artist/playlists';
      return;
    }
    setActiveTab(tab);
  };

  const handleRetry = () => {
    if (session) {
      if (activeTab === 'songs') {
        fetchUserTracks();
      } else if (activeTab === 'albums') {
        fetchUserAlbums();
      }
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
          <p className="text-gray-300">Loading {activeTab}...</p>
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
                  {error.includes('Authentication') ? 'Authentication Error' : 'API Error'}
                </p>
                <p className="text-red-200 text-sm">
                  {error.includes('Authentication') 
                    ? 'Please check your login status or try signing in again.' 
                    : `Failed to load ${activeTab} from API. Showing demo data.`
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {error.includes('Authentication') && (
                <button 
                  onClick={() => signOut()}
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
                 (e.target as HTMLImageElement).src = '/api/placeholder/160/160';
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold">
                  {member?.StageName || `${member?.FirstName} ${member?.LastName}`}
                </h1>
                {member?.IsVerified === "1" && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-lg mb-2">@{member?.Username}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                {member?.Membership && (
                  <span className="bg-purple-600 px-2 py-1 rounded-full text-xs capitalize">
                    {member.Membership}
                  </span>
                )}
                {member?.Country && <span>{member.Country}</span>}
                <span>
                  {activeTab === 'songs' ? tracks.length : albums.length} {activeTab}
                </span>
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
        {activeTab === 'songs' && (
          <>
            {/* Desktop Table View for Songs */}
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
                    key={track.id || track.music_id}
                    onClick={() => handleItemClick(track.id || track.music_id, 'song')}
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
                          alt={track.track_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                           (e.target as HTMLImageElement).src= '/api/placeholder/48/48';
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                          {track.track_name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {track.artist_name || track.label}
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

            {/* Mobile Card View for Songs */}
            <div className="md:hidden space-y-3">
              {tracks.map((track) => (
                <div
                  key={track.id || track.music_id}
                  onClick={() => handleItemClick(track.id || track.music_id, 'song')}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={track.image || '/api/placeholder/64/64'} 
                        alt={track.track_name}
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
                      <h3 className="font-medium text-white truncate">{track.track_name}</h3>
                      <p className="text-sm text-gray-400 truncate">
                        {track.artist_name || track.label}
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
          </>
        )}

        {activeTab === 'albums' && (
          <>
            {/* Albums Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => handleItemClick(album.id, 'album')}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-colors group"
                >
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-700 relative">
                    <img 
                      src={album.cover_art || album.image || '/api/placeholder/300/300'} 
                      alt={album.title || album.album_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                       (e.target as HTMLImageElement).src= '/api/placeholder/300/300';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="text-white" size={32} />
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-white truncate mb-1">
                    {album.title || album.album_name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate mb-2">
                    {album.artist || member?.StageName}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Disc3 size={12} />
                      <span>{album.track_count || '0'} tracks</span>
                    </div>
                    {album.release_date && (
                      <span>{new Date(album.release_date).getFullYear()}</span>
                    )}
                  </div>
                  
                  {album.genre && (
                    <div className="mt-2">
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                        {album.genre}
                      </span>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {((activeTab === 'songs' && tracks.length === 0) || (activeTab === 'albums' && albums.length === 0)) && !loading && (
          <div className="text-center py-16">
            {activeTab === 'songs' ? (
              <Music className="mx-auto mb-4 text-gray-500" size={48} />
            ) : (
              <Album className="mx-auto mb-4 text-gray-500" size={48} />
            )}
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-500">
              {activeTab === 'songs' ? 'Upload your first track to get started' : 'Create your first album to get started'}
            </p>
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

export default ArtistContentPage;