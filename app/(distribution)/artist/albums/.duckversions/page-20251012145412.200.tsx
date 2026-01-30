// app/artist/albums/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { useParams, useSearchParams, useRouter } from 'next/navigation';

import { 
  Album, Plus, Music, Play, MoreHorizontal, Clock, Users, Download, 
  AlertCircle, Pause, Edit, Eye, Share, Trash2, Heart, MoreVertical,
  ChevronDown, ChevronUp, List, Grid, Search, Filter, X, Calendar,
  User, Globe, Headphones, BarChart3, BadgeCheck
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
  choice: string;
  base: string;
  chart: string;
  display_upc: string | null;
  display_isrc: string | null;
  user_id: string;
  id: string;
  music_id: string;
  no_plays: string | null;
  no_downloads: string | null;
  active: string;
  track_active: string;
  time_approved_lap: string | null;
  is_express: string | null;
  rejection_id: number;
  rejection: string;
  artist_name: string;
  data_id: string;
  actor: string;
}

interface ApiResponse {
  status: string;
  message: string;
  member: any;
  result: Track[];
}

interface AlbumStats {
  totalPlays: number;
  totalDownloads: number;
  approvedAlbums: number;
  pendingAlbums: number;
}

export default function AlbumsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [albums, setAlbums] = useState<Track[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'plays'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState<AlbumStats>({
    totalPlays: 0,
    totalDownloads: 0,
    approvedAlbums: 0,
    pendingAlbums: 0
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchAlbums = async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);
      const API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c';
      const apiUrl = 'https://singnify.com/api/v2/php/get-user-albums.php?API_KEY=' + API_KEY;

      const formData = new FormData();
      formData.append('token', session.accessToken);

      console.log('Fetching albums from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();
        console.log('API Response:', data);
        
        if (data.status === '200') {
          // Filter to only show album base type
          const albumTracks = data.result.filter(track => track.base === 'album');
          console.log('Filtered albums:', albumTracks);
          setAlbums(albumTracks);
          setFilteredAlbums(albumTracks);
          
          // Calculate stats
          calculateStats(albumTracks);
        } else {
          console.error('API returned error status:', data.status, data.message);
          setError(`Failed to fetch albums: ${data.message}`);
        }
      } else {
        console.error('Network response not ok:', response.status, response.statusText);
        setError(`Network error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
      setError('Error fetching albums: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (albums: Track[]) => {
    let totalPlays = 0;
    let totalDownloads = 0;
    let approvedAlbums = 0;
    let pendingAlbums = 0;

    albums.forEach(album => {
      totalPlays += parseInt(album.no_plays || '0');
      totalDownloads += parseInt(album.no_downloads || '0');
      
      if (album.active === "1") {
        approvedAlbums++;
      } else {
        pendingAlbums++;
      }
    });

    setStats({
      totalPlays,
      totalDownloads,
      approvedAlbums,
      pendingAlbums
    });
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchAlbums();
    }
  }, [session]);

  // Filter and sort albums based on current settings
  useEffect(() => {
    let result = [...albums];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(album => 
        album.track_name.toLowerCase().includes(query) ||
        album.artist_name.toLowerCase().includes(query) ||
        album.genre.toLowerCase().includes(query) ||
        album.label.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(album => 
        statusFilter === 'approved' ? album.active === "1" : album.active !== "1"
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.track_name.toLowerCase();
          bValue = b.track_name.toLowerCase();
          break;
        case 'plays':
          aValue = parseInt(a.no_plays || '0');
          bValue = parseInt(b.no_plays || '0');
          break;
        case 'date':
        default:
          aValue = parseInt(a.time_number);
          bValue = parseInt(b.time_number);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredAlbums(result);
  }, [albums, searchQuery, statusFilter, sortBy, sortOrder]);

  // Clean up audio element on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playTrack = (audioUrl: string, trackId: string) => {
    // Stop currently playing track if any
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    }

    // Create new audio element
    const newAudio = new Audio(audioUrl);
    audioRef.current = newAudio;
    
    newAudio.play()
      .then(() => {
        setCurrentlyPlaying(trackId);
        console.log('Playing track:', trackId);
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
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    }
  };

  // Update these functions in your component

const handleEditAlbum = (albumId: string) => {
  console.log('Edit album:', albumId);
  // Navigate to the same album page with edit mode enabled
  router.push(`/artist/album/${albumId}?mode=edit`);
};

const handleViewDetails = (album: any) => {
   handleViewDetailsxx(album);
  console.log('View details:', album);
  // Navigate to the album details page
  router.push(`/artist/album/${album.id}?mode=view`);
};


  const handleEditAlbumxx = (albumId: string) => {
    console.log('Edit album:', albumId);
    // Implement edit functionality
    alert(`Edit functionality for album ${albumId} would be implemented here`);
  };

  const handleViewDetailsxx = (album: Track) => {
    console.log('View details:', album);
    // Implement view details functionality
    setExpandedAlbum(expandedAlbum === album.id ? null : album.id);
  };

  const handleShareAlbum = (album: Track) => {
    console.log('Share album:', album);
    if (navigator.share) {
      navigator.share({
        title: album.track_name,
        text: `Check out ${album.track_name} by ${album.artist_name} on Singnify`,
        url: window.location.href,
      })
      .catch(error => {
        console.log('Sharing failed', error);
        alert('Sharing is not supported on this browser');
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${album.track_name} by ${album.artist_name} - ${window.location.href}`)
        .then(() => {
          alert('Album link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const handleDeleteAlbum = (albumId: string) => {
    console.log('Delete album:', albumId);
    if (confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      // Implement delete functionality
      alert(`Delete functionality for album ${albumId} would be implemented here`);
    }
  };

  const handleLikeAlbum = (albumId: string) => {
    console.log('Like album:', albumId);
    // Implement like functionality
    alert(`Like functionality for album ${albumId} would be implemented here`);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPlayCount = (count: string | null) => {
    if (!count) return "0";
    
    // Handle formatted numbers like "10.50K"
    if (count.includes('K') || count.includes('M')) {
      return count;
    }
    
    const num = parseInt(count);
    if (isNaN(num)) return count; // Return original if not a number
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getStatusBadge = (active: string) => {
    if (active === "1") {
      return (
        <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
          <BadgeCheck className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="bg-yellow-900/30 text-yellow-400 text-xs px-2 py-1 rounded-full">
          Pending
        </span>
      );
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your albums...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <Album className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Your Music</h2>
          <p className="text-gray-400 mb-6">Sign in to view and manage your albums</p>
          <Link 
            href="/signin"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-2">{error}</p>
          <button 
            onClick={fetchAlbums}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              My Albums
            </h1>
            <p className="text-gray-400 mt-1">
              {albums.length} album{albums.length !== 1 ? 's' : ''} • {stats.approvedAlbums} approved • {stats.pendingAlbums} pending
            </p>
          </div>
          <Link 
            href="/artist/upload"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg hover:shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Album
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Albums</p>
                <p className="text-2xl font-bold">{albums.length}</p>
              </div>
              <div className="p-2 bg-indigo-900/30 rounded-lg">
                <Album className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Plays</p>
                <p className="text-2xl font-bold">{formatPlayCount(stats.totalPlays.toString())}</p>
              </div>
              <div className="p-2 bg-green-900/30 rounded-lg">
                <Headphones className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Downloads</p>
                <p className="text-2xl font-bold">{formatPlayCount(stats.totalDownloads.toString())}</p>
              </div>
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Download className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approval Rate</p>
                <p className="text-2xl font-bold">
                  {albums.length > 0 ? Math.round((stats.approvedAlbums / albums.length) * 100) : 0}%
                </p>
              </div>
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'approved' | 'pending')}
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'plays')}
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="plays">Sort by Plays</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white hover:bg-gray-600/50 transition-colors"
              >
                {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className="flex bg-gray-700/50 border border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-indigo-600' : 'hover:bg-gray-600/50'} transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-indigo-600' : 'hover:bg-gray-600/50'} transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white hover:bg-gray-600/50 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredAlbums.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/20 rounded-xl border border-gray-700/30">
            <Album className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No matching albums' : 'No albums yet'}
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Create your first album to organize your music and share it with the world.'
              }
            </p>
            {(searchQuery || statusFilter !== 'all') ? (
              <button
                onClick={clearFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                <X className="w-5 h-5 mr-2" />
                Clear Filters
              </button>
            ) : (
              <Link 
                href="/artist/upload"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Album
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album) => (
              <div key={album.id} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 hover:bg-gray-800/50 transition-all border border-gray-700/30 group relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-900/30 p-2 rounded-lg mr-3">
                      <Album className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{album.track_name}</h3>
                      <p className="text-gray-400 text-sm">{album.genre}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700/50"
                      onClick={() => setSelectedAlbum(selectedAlbum === album.id ? null : album.id)}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    {selectedAlbum === album.id && (
                      <div className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg z-10 py-2 w-40 border border-gray-600">
                        <button 
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center text-sm"
                          onClick={() => handleEditAlbum(album.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center text-sm"
                          onClick={() => handleShareAlbum(album)}
                        >
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center text-sm text-red-400"
                          onClick={() => handleDeleteAlbum(album.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4 relative">
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-gray-700 to-gray-800">
                    <img 
                      src={album.image} 
                      alt={album.track_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM3NDE1MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjNmI3MjhhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BbGJ1bSBJbWFnZTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentlyPlaying === album.id ? (
                        <button 
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transform transition-all hover:scale-105"
                          onClick={pauseTrack}
                        >
                          <Pause className="w-6 h-6" />
                        </button>
                      ) : (
                        <button 
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transform transition-all hover:scale-105"
                          onClick={() => playTrack(album.audio, album.id)}
                        >
                          <Play className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(album.active)}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      Artist:
                    </span>
                    <span className="text-white font-medium">{album.artist_name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Music className="w-3 h-3 mr-1" />
                      Label:
                    </span>
                    <span className="text-white">{album.label}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      Country:
                    </span>
                    <span className="text-white">{album.country}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(album.time_number)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Headphones className="w-3 h-3 mr-1" />
                      <span>{formatPlayCount(album.no_plays)}</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-3 h-3 mr-1" />
                      <span>{formatPlayCount(album.no_downloads)}</span>
                    </div>
                  </div>
                </div>

                {album.active !== "1" && album.rejection && (
                  <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-yellow-200 text-sm">Under Review</span>
                    </div>
                    <p className="text-yellow-300 text-xs mt-1">{album.rejection}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button 
                    className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center transition-colors"
                    onClick={() => handleEditAlbum(album.id)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                  <button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center transition-colors"
                    onClick={() => handleViewDetails(album)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </button>
                </div>

                {/* Expanded details */}
                {expandedAlbum === album.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <h4 className="font-medium text-gray-300 mb-2">Album Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Language:</span>
                        <span className="text-white capitalize">{album.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Uploaded:</span>
                        <span className="text-white">{formatDateTime(album.time_number)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Music ID:</span>
                        <span className="text-white font-mono">{album.music_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white">{album.active === "1" ? "Approved" : "Pending Approval"}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/30">
                  <button 
                    className="text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded-full hover:bg-gray-700/30"
                    onClick={() => handleLikeAlbum(album.id)}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded-full hover:bg-gray-700/30"
                    onClick={() => handleShareAlbum(album)}
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded-full hover:bg-gray-700/30"
                    onClick={() => {
                      if (currentlyPlaying === album.id) {
                        pauseTrack();
                      } else {
                        playTrack(album.audio, album.id);
                      }
                    }}
                  >
                    {currentlyPlaying === album.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700/30"
                    onClick={() => handleDeleteAlbum(album.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs text-gray-400 border-b border-gray-700/30 font-medium">
              <div className="col-span-4">Album</div>
              <div className="col-span-2">Genre</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-center">Plays</div>
              <div className="col-span-1 text-center">Downloads</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            {filteredAlbums.map((album) => (
              <div key={album.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-700/20 hover:bg-gray-800/20 transition-colors">
                <div className="col-span-4 flex items-center">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={album.image} 
                      alt={album.track_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGR5PSIwLjM1ZW0iIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2YjcyOGEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkE8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium line-clamp-1">{album.track_name}</div>
                    <div className="text-xs text-gray-400">{album.artist_name}</div>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center text-sm">
                  <span className="capitalize">{album.genre}</span>
                </div>
                
                <div className="col-span-2 flex items-center">
                  {getStatusBadge(album.active)}
                </div>
                
                <div className="col-span-1 flex items-center justify-center text-sm">
                  {formatPlayCount(album.no_plays)}
                </div>
                
                <div className="col-span-1 flex items-center justify-center text-sm">
                  {formatPlayCount(album.no_downloads)}
                </div>
                
                <div className="col-span-2 flex items-center justify-end space-x-2">
                  <button 
                    className="text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded-full hover:bg-gray-700/30"
                    onClick={() => {
                      if (currentlyPlaying === album.id) {
                        pauseTrack();
                      } else {
                        playTrack(album.audio, album.id);
                      }
                    }}
                  >
                    {currentlyPlaying === album.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/30"
                    onClick={() => handleViewDetails(album)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/30"
                    onClick={() => handleEditAlbum(album.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700/30"
                    onClick={() => handleDeleteAlbum(album.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Audio element (hidden) */}
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
}