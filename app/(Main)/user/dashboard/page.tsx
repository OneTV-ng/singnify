// app/user/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { 
  Headphones, Heart, Users, Play, Plus, MoreHorizontal, 
  Clock, Pause, Shuffle, SkipBack, SkipForward, Repeat,
  Search, Bell, User, Music, Album, Radio
} from 'lucide-react';
import Link from 'next/link';

interface Track {
  track_name: string;
  base_name: string;
  label: string;
  genre: string;
  language: string;
  image: string;
  audio: string;
  time_number: string;
  duration: string;
  country: string;
  artist_name: string;
  no_plays: string;
  no_downloads: string;
  data_id: string;
}

interface Playlist {
  id: string;
  playlist: string;
  member_id: string;
  active: string;
  time_number: string;
  Data?: Array<any>;
  Info?: Track[];
}

interface Artist {
  ID: string;
  Username: string;
  StageName: string;
  Picture: string;
  Country: string;
  About: string;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user data
  const fetchUserData = async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);
      const API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c';
      
      // Fetch playlists
      const playlistsUrl = `https://singnify.com/api/v2/php/get-user-playlists.php?API_KEY=${API_KEY}`;
      const playlistsFormData = new FormData();
      playlistsFormData.append('token', session.accessToken);

      const playlistsResponse = await fetch(playlistsUrl, {
        method: 'POST',
        body: playlistsFormData,
      });

      if (playlistsResponse.ok) {
        const playlistsData = await playlistsResponse.json();
        if (playlistsData.status === '200') {
          setPlaylists(playlistsData.result || []);
        }
      }

      // Fetch liked tracks
      const likesUrl = `https://singnify.com/api/v2/php/get-user-likes.php?API_KEY=${API_KEY}`;
      const likesFormData = new FormData();
      likesFormData.append('token', session.accessToken);

      const likesResponse = await fetch(likesUrl, {
        method: 'POST',
        body: likesFormData,
      });

      if (likesResponse.ok) {
        const likesData = await likesResponse.json();
        if (likesData.status === '200') {
          setLikedTracks(likesData.result || []);
        }
      }

      // Fetch followed artists
      const artistsUrl = `https://singnify.com/api/v2/php/get-user-followed-artists.php?API_KEY=${API_KEY}`;
      const artistsFormData = new FormData();
      artistsFormData.append('token', session.accessToken);

      const artistsResponse = await fetch(artistsUrl, {
        method: 'POST',
        body: artistsFormData,
      });

      if (artistsResponse.ok) {
        const artistsData = await artistsResponse.json();
        if (artistsData.status === '200') {
          setFollowedArtists(artistsData.result || []);
        }
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error loading your dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserData();
    }
  }, [session]);

  // Clean up audio element on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  const playTrack = (audioUrl: string, trackId: string) => {
    // Stop currently playing track if any
    if (audioElement) {
      audioElement.pause();
      setCurrentlyPlaying(null);
    }

    // Create new audio element
    const newAudio = new Audio(audioUrl);
    setAudioElement(newAudio);
    
    newAudio.play()
      .then(() => {
        setCurrentlyPlaying(trackId);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });

    // Handle when audio ends
    newAudio.onended = () => {
      setCurrentlyPlaying(null);
    };
  };

  const pauseTrack = () => {
    if (audioElement) {
      audioElement.pause();
      setCurrentlyPlaying(null);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPlayCount = (count: string) => {
    if (count.includes('K') || count.includes('M')) {
      return count;
    }
    
    const num = parseInt(count);
    if (isNaN(num)) return count;
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (status === 'loading' || loading) {
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
          <p className="text-xl mb-4">Please log in to view your dashboard</p>
          <Link href="/signin" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchUserData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Headphones className="h-8 w-8 text-indigo-500 mr-3" />
            <h1 className="text-2xl font-bold">Music Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search music, artists..." 
                className="bg-gray-700 border border-gray-600 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button className="p-2 rounded-full hover:bg-gray-700">
              <Bell className="h-5 w-5 text-gray-300" />
            </button>
            
            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-full pl-2 pr-4 py-1">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">{session?.user?.name || 'User'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-indigo-400 mr-4" />
              <div>
                <p className="text-2xl font-bold">{likedTracks.length}</p>
                <p className="text-gray-400">Liked Songs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Album className="h-8 w-8 text-green-400 mr-4" />
              <div>
                <p className="text-2xl font-bold">{playlists.length}</p>
                <p className="text-gray-400">Playlists</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-400 mr-4" />
              <div>
                <p className="text-2xl font-bold">{followedArtists.length}</p>
                <p className="text-gray-400">Artists Followed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'playlists'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('playlists')}
            >
              Playlists
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'liked'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('liked')}
            >
              Liked Songs
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'artists'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('artists')}
            >
              Artists
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Recently Played */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recently Played</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {likedTracks.slice(0, 6).map((track) => (
                  <div key={track.data_id} className="bg-gray-800 rounded-lg p-4 group">
                    <div className="relative mb-3">
                      <img 
                        src={track.image} 
                        alt={track.track_name}
                        className="w-full aspect-square object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/150/150';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentlyPlaying === track.data_id ? (
                          <button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full"
                            onClick={pauseTrack}
                          >
                            <Pause className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full"
                            onClick={() => playTrack(track.audio, track.data_id)}
                          >
                            <Play className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <h3 className="font-medium text-sm truncate">{track.track_name}</h3>
                    <p className="text-gray-400 text-xs truncate">{track.artist_name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Playlists */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Playlists</h2>
                <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists.slice(0, 3).map((playlist) => (
                  <div key={playlist.id} className="bg-gray-800 rounded-lg p-4 flex items-center group">
                    <div className="w-16 h-16 bg-indigo-600 rounded flex items-center justify-center mr-4">
                      <Album className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{playlist.playlist}</h3>
                      <p className="text-gray-400 text-sm">
                        {playlist.Info?.length || 0} songs
                      </p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Your Playlists</h2>
            {playlists.length === 0 ? (
              <div className="text-center py-12">
                <Album className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No playlists yet</h3>
                <p className="text-gray-400">Create your first playlist to organize your music</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="bg-gray-800 rounded-lg p-6 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Album className="w-6 h-6 text-white" />
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{playlist.playlist}</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {playlist.Info?.length || 0} songs • Created {formatDate(playlist.time_number)}
                    </p>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-sm">
                      Play
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Liked Songs</h2>
            {likedTracks.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No liked songs yet</h3>
                <p className="text-gray-400">Start liking songs to see them here</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-left text-gray-400 font-medium text-sm">#</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium text-sm">Title</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium text-sm">Artist</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium text-sm">Plays</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium text-sm">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {likedTracks.map((track, index) => (
                      <tr key={track.data_id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded overflow-hidden mr-3">
                              <img 
                                src={track.image} 
                                alt={track.track_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/api/placeholder/40/40';
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-medium">{track.track_name}</div>
                              <div className="text-gray-400 text-sm">{track.genre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{track.artist_name}</td>
                        <td className="py-3 px-4">{formatPlayCount(track.no_plays)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-between">
                            <span>{track.duration}</span>
                            {currentlyPlaying === track.data_id ? (
                              <button 
                                className="text-indigo-400 hover:text-indigo-300 ml-2"
                                onClick={pauseTrack}
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                className="text-gray-400 hover:text-white ml-2"
                                onClick={() => playTrack(track.audio, track.data_id)}
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'artists' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Followed Artists</h2>
            {followedArtists.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Not following any artists yet</h3>
                <p className="text-gray-400">Start following artists to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {followedArtists.map((artist) => (
                  <div key={artist.ID} className="bg-gray-800 rounded-lg p-4 text-center group">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden">
                      <img 
                        src={artist.Picture} 
                        alt={artist.StageName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/80/80';
                        }}
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{artist.StageName}</h3>
                    <p className="text-gray-400 text-sm mb-3">{artist.Country}</p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-full text-xs">
                      Following
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Music Player Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 w-1/4">
            <div className="w-12 h-12 rounded overflow-hidden">
              <img 
                src={likedTracks[0]?.image || '/api/placeholder/48/48'} 
                alt="Now playing"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-sm">
                {likedTracks[0]?.track_name || 'No track playing'}
              </div>
              <div className="text-gray-400 text-xs">
                {likedTracks[0]?.artist_name || 'Select a song to play'}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center w-2/4">
            <div className="flex items-center space-x-4 mb-2">
              <button className="text-gray-400 hover:text-white">
                <Shuffle className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <SkipBack className="w-4 h-4" />
              </button>
              {currentlyPlaying ? (
                <button 
                  className="bg-white text-black rounded-full p-2 hover:bg-gray-200"
                  onClick={pauseTrack}
                >
                  <Pause className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  className="bg-white text-black rounded-full p-2 hover:bg-gray-200"
                  onClick={() => likedTracks[0] && playTrack(likedTracks[0].audio, likedTracks[0].data_id)}
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              <button className="text-gray-400 hover:text-white">
                <SkipForward className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Repeat className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full flex items-center space-x-2">
              <span className="text-xs text-gray-400">0:00</span>
              <div className="flex-1 bg-gray-600 rounded-full h-1">
                <div className="bg-white rounded-full h-1 w-0"></div>
              </div>
              <span className="text-xs text-gray-400">{likedTracks[0]?.duration || '0:00'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-1/4 justify-end">
            <button className="text-gray-400 hover:text-white">
              <Heart className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Users className="w-4 h-4" />
            </button>
            <div className="w-24">
              <div className="bg-gray-600 rounded-full h-1">
                <div className="bg-white rounded-full h-1 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}