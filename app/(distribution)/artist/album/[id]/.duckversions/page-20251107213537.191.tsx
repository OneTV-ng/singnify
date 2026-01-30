// app/album/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { 
  Album, Music, Play, Pause, Edit, Eye, Share, Trash2, Heart, 
  MoreVertical, Clock, Users, Download, AlertCircle, Save, X, Headphones,
  Plus, ChevronLeft, ChevronRight, BarChart3, Globe, User, Calendar, FileText,
  Image as ImageIcon, Upload, Loader2, CheckCircle, AlertTriangle, Search
} from 'lucide-react';
import Link from 'next/link';

interface Track {
  id: string;
  track_name: string;
  audio: string;
  duration: string;
  lyrics: string;
  lyrics_file: string;
  is_explicit: boolean;
  order: number;
}

interface AlbumData {
  id: string;
  name: string;
  artist_name: string;
  label: string;
  genre: string;
  language: string;
  image: string;
  country: string;
  description: string;
  is_explicit: boolean;
  is_cover: boolean;
  music_upload_date: string;
  time_number: string;
  active: string;
  rejection: string;
  no_plays: string;
  no_downloads: string;
  tracks: Track[];
}

interface ApiResponse {
  status: string;
  message: string;
  result: AlbumData[];
}

export default function AlbumDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const albumId = params.id as string;
  
  const [allAlbums, setAllAlbums] = useState<AlbumData[]>([]);
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(searchParams.get('mode') === 'edit');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    artist_name: '',
    label: '',
    genre: '',
    language: '',
    country: '',
    description: '',
    is_explicit: false,
    is_cover: false,
    music_upload_date: '',
  });

  const [tracks, setTracks] = useState<Track[]>([]);

  const genres = [
    'Afrobeats', 'Pop', 'Hip-Hop', 'R&B', 'Gospel', 'Highlife', 'Fuji', 'Juju',
    'Rock', 'Jazz', 'Reggae', 'Electronic', 'Classical', 'Folk', 'Country', 'Blues', 'Amapiano', 'Alternative'
  ];

  const languages = [
    'English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin', 'French', 'Spanish', 'Portuguese', 'Swahili', 'Arabic'
  ];

  const countries = [
    'Nigeria', 'Ghana', 'South Africa', 'Kenya', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Brazil', 'India'
  ];

  // Fetch all albums
  const fetchAllAlbums = async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);
      const API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c';
      const apiUrl = 'https://singnify.com/api/v2/php/get-user-albums.php?API_KEY=' + API_KEY;
       const aapiUrl = 'https://singnify.com/api/v2/php/get-record.php?API_KEY=' + API_KEY;

      const formData = new FormData();
      formData.append('token', session.accessToken);
       formData.append('table_name', 'albums');

            formData.append('id',albumId);


      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });



const aresponse = await fetch(aapiUrl, {
        method: 'POST',
        body: formData,
      });

      console.log(aresponse)
   if (aresponse.ok) {
        const adata: ApiResponse = await aresponse.json();
        console.log('Record Data:', adata);

   }



      if (response.ok) {
        const data: ApiResponse = await response.json();
        console.log('Albums Data:', data);
        
        if (data.status === '200') {
          setAllAlbums(data.result);
          
          // Find the album with matching ID
          const foundAlbum = data.result.find(a => a.id === albumId);
          if (foundAlbum) {
            setAlbum(foundAlbum);
            setFormData({
              name: foundAlbum.name || '',
              artist_name: foundAlbum.artist_name || '',
              label: foundAlbum.label || '',
              genre: foundAlbum.genre || '',
              language: foundAlbum.language || '',
              country: foundAlbum.country || '',
              description: foundAlbum.description || '',
              is_explicit: foundAlbum.is_explicit || false,
              is_cover: foundAlbum.is_cover || false,
              music_upload_date: foundAlbum.music_upload_date || '',
            });
            setTracks(foundAlbum.tracks || []);
          } else {
            setError('Album not found');
          }
        } else {
          setError(`Failed to fetch albums: ${data.message}`);
        }
      } else {
        setError(`Network error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setError('Error fetching albums: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchAllAlbums();
    }
  }, [session, albumId]);

  useEffect(() => {
    setEditMode(searchParams.get('mode') === 'edit');
  }, [searchParams]);

  // Find next and previous albums for navigation
  const currentAlbumIndex = allAlbums.findIndex(a => a.id === albumId);
  const nextAlbum = currentAlbumIndex < allAlbums.length - 1 ? allAlbums[currentAlbumIndex + 1] : null;
  const prevAlbum = currentAlbumIndex > 0 ? allAlbums[currentAlbumIndex - 1] : null;

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

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTrackChange = (index: number, field: keyof Track, value: any) => {
    const updatedTracks = [...tracks];
    updatedTracks[index] = { ...updatedTracks[index], [field]: value };
    setTracks(updatedTracks);
  };

  const addTrack = () => {
    setTracks([...tracks, {
      id: `new-${Date.now()}`,
      track_name: '',
      audio: '',
      duration: '',
      lyrics: '',
      lyrics_file: '',
      is_explicit: false,
      order: tracks.length + 1
    }]);
  };

  const removeTrack = (index: number) => {
    if (tracks.length > 1) {
      const updatedTracks = [...tracks];
      updatedTracks.splice(index, 1);
      setTracks(updatedTracks);
    }
  };

  const saveAlbum = async () => {
    if (!session?.accessToken || !album) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c';
      const apiUrl = 'https://singnify.com/api/v2/php/save-audio.php?API_KEY=' + API_KEY;

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('token', session.accessToken);
      formDataToSubmit.append('track_id', album.id);
      formDataToSubmit.append('is_edit', '1');
      
      // Add album fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value.toString());
      });

      // Add tracks data with ||:: separator
      if (tracks.length > 0) {
        const trackNames = tracks.map(track => track.track_name).join('||::');
        const audioUrls = tracks.map(track => track.audio).join('||::');
        const durations = tracks.map(track => track.duration).join('||::');
        
        formDataToSubmit.append('track_name', trackNames);
        formDataToSubmit.append('audio', audioUrls);
        formDataToSubmit.append('duration', durations);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formDataToSubmit,
      });

      const result = await response.json();
      
      if (result.status === '200') {
        setSaveStatus('success');
        setSaveMessage('Album updated successfully!');
        setTimeout(() => {
          setEditMode(false);
          fetchAllAlbums(); // Refresh all albums data
        }, 1500);
      } else {
        setSaveStatus('error');
        setSaveMessage(result.message || 'Failed to update album');
      }
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage('Error updating album: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAlbum = async () => {
    if (!session?.accessToken || !album) return;

    if (!confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c';
      const apiUrl = 'https://singnify.com/api/v2/php/delete-music.php?API_KEY=' + API_KEY;

      const formData = new FormData();
      formData.append('token', session.accessToken);
      formData.append('music_id', album.id);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status === '200') {
        alert('Album deleted successfully!');
        router.push('/artist/albums');
      } else {
        alert(`Failed to delete album: ${result.message}`);
      }
    } catch (error) {
      alert('Error deleting album: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteTrack = async (trackId: string) => {
    if (!session?.accessToken) return;

    if (!confirm('Are you sure you want to delete this track?')) {
      return;
    }

    try {
      const API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c';
      const apiUrl = 'https://singnify.com/api/v2/php/delete-music.php?API_KEY=' + API_KEY;

      const formData = new FormData();
      formData.append('token', session.accessToken);
      formData.append('music_id', trackId);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status === '200') {
        alert('Track deleted successfully!');
        fetchAllAlbums(); // Refresh all albums data
      } else {
        alert(`Failed to delete track: ${result.message}`);
      }
    } catch (error) {
      alert('Error deleting track: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPlayCount = (count: string) => {
    if (!count) return "0";
    
    const num = parseInt(count);
    if (isNaN(num)) return count;
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Filter albums based on search query - FIXED THE ERROR HERE
  const filteredAlbums = allAlbums.filter(album => {
    const name = album.name || '';
    const artist = album.artist_name || '';
    const query = searchQuery.toLowerCase();
    
    return name.toLowerCase().includes(query) || artist.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading album...</p>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Album Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The album you are looking for does not exist.'}</p>
          <Link 
            href="/artist/albums"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Back to Albums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Sidebar with album list */}
        <div className="lg:w-1/4">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">My Albums</h2>
              <Link 
                href="/artist/upload"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
                title="Create new album"
              >
                <Plus className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredAlbums.map((alb) => (
                <Link
                  key={alb.id}
                  href={`/album/${alb.id}`}
                  className={`block p-3 rounded-lg transition-colors ${
                    alb.id === albumId 
                      ? 'bg-indigo-900/30 border border-indigo-700/50' 
                      : 'bg-gray-700/30 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 mr-3">
                      <img 
                        src={alb.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGR5PSIwLjM1ZW0iIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2YjcyOGEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkE8L3RleHQ+PC9zdmc+'} 
                        alt={alb.name || 'Album'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGR5PSIwLjM1ZW0iIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTAiIGZvbGw9IiM2YjcyOGEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkE8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{alb.name || 'Untitled Album'}</p>
                      <p className="text-gray-400 text-xs truncate">{alb.artist_name || 'Unknown Artist'}</p>
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredAlbums.length === 0 && (
                <p className="text-gray-400 text-center py-4 text-sm">No albums found</p>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link 
              href="/artist/albums"
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Link>
            
            {/* Navigation between albums */}
            <div className="flex items-center space-x-2 mr-4">
              {prevAlbum && (
                <Link
                  href={`/album/${prevAlbum.id}`}
                  className="p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                  title="Previous album"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              )}
              
              {nextAlbum && (
                <Link
                  href={`/album/${nextAlbum.id}`}
                  className="p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                  title="Next album"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            
            <div className="flex-1" />
            
            {!editMode ? (
              <>
                <button 
                  onClick={() => setEditMode(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center mr-2 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={deleteAlbum}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setEditMode(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center mr-2 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button 
                  onClick={saveAlbum}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </button>
              </>
            )}
          </div>

          {saveStatus === 'success' && (
            <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-300">{saveMessage}</span>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-300">{saveMessage}</span>
            </div>
          )}

          {/* Album Header */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                  <img 
                    src={album.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgZmlsbD0iIzM3NDE1MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNmI3MjhhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BbGJ1bSBJbWFnZTwvdGV4dD48L3N2Zz4='} 
                    alt={album.name || 'Album'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgZmlsbD0iIzM3NDE1MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNmI3MjhhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BbGJ1bSBJbWFnZTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>

              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Album Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="Album name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Artist Name</label>
                      <input
                        type="text"
                        value={formData.artist_name}
                        onChange={(e) => handleInputChange('artist_name', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="Artist name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
                        <select
                          value={formData.genre}
                          onChange={(e) => handleInputChange('genre', e.target.value)}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        >
                          <option value="">Select genre</option>
                          {genres.map(genre => (
                            <option key={genre} value={genre.toLowerCase()}>{genre}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                        <select
                          value={formData.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        >
                          <option value="">Select language</option>
                          {languages.map(lang => (
                            <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold mb-2">{album.name || 'Untitled Album'}</h1>
                    <p className="text-xl text-gray-300 mb-4">{album.artist_name || 'Unknown Artist'}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Music className="w-4 h-4 mr-1" />
                        {album.genre || 'No genre'}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Globe className="w-4 h-4 mr-1" />
                        {album.language || 'No language'}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {album.time_number ? formatDate(album.time_number) : 'No date'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-sm">
                        <Headphones className="w-4 h-4 mr-1 text-indigo-400" />
                        <span className="text-white font-medium">{formatPlayCount(album.no_plays)}</span>
                        <span className="text-gray-400 ml-1">plays</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Download className="w-4 h-4 mr-1 text-indigo-400" />
                        <span className="text-white font-medium">{formatPlayCount(album.no_downloads)}</span>
                        <span className="text-gray-400 ml-1">downloads</span>
                      </div>
                    </div>

                    {album.description && (
                      <div className="mb-4">
                        <p className="text-gray-300">{album.description}</p>
                      </div>
                    )}

                    {album.active !== "1" && (
                      <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-yellow-200 text-sm">Under Review</span>
                        </div>
                        {album.rejection && (
                          <p className="text-yellow-300 text-xs mt-1">{album.rejection}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tracks Section */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Tracks</h2>
              {editMode && (
                <button 
                  onClick={addTrack}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg flex items-center text-sm transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Track
                </button>
              )}
            </div>

            {tracks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tracks in this album yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tracks.map((track, index) => (
                  <div key={track.id} className="flex items-center p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                    <div className="flex-shrink-0 w-8 text-center text-gray-400 mr-3">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {editMode ? (
                        <input
                          type="text"
                          value={track.track_name}
                          onChange={(e) => handleTrackChange(index, 'track_name', e.target.value)}
                          className="w-full bg-gray-600/50 border border-gray-500 rounded px-3 py-1 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                          placeholder="Track name"
                        />
                      ) : (
                        <p className="font-medium truncate">{track.track_name || 'Untitled Track'}</p>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {track.duration || '0:00'}
                        {track.is_explicit && (
                          <span className="ml-2 px-1 bg-red-900/30 text-red-400 rounded text-xs">Explicit</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!editMode ? (
                        <>
                          <button 
                            className="text-gray-400 hover:text-indigo-400 transition-colors p-1"
                            onClick={() => {
                              if (currentlyPlaying === track.id) {
                                pauseTrack();
                              } else {
                                playTrack(track.audio, track.id);
                              }
                            }}
                          >
                            {currentlyPlaying === track.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            className="text-gray-400 hover:text-red-400 transition-colors p-1"
                            onClick={() => deleteTrack(track.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button 
                          className="text-gray-400 hover:text-red-400 transition-colors p-1"
                          onClick={() => removeTrack(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Album Details Section */}
          {!editMode && (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 mt-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4">Album Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Record Label:</span>
                    <span className="text-white">{album.label || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white">{album.country || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Upload Date:</span>
                    <span className="text-white">{album.time_number ? formatDate(album.time_number) : 'Not specified'}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={album.active === "1" ? "text-green-400" : "text-yellow-400"}>
                      {album.active === "1" ? "Approved" : "Pending Approval"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Explicit Content:</span>
                    <span className="text-white">{album.is_explicit ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cover Song:</span>
                    <span className="text-white">{album.is_cover ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audio element (hidden) */}
          <audio ref={audioRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}