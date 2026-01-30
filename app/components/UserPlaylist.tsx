"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Play, Pause, List, Music, Clock, Eye, MoreVertical, Plus, Trash2, Edit3 } from 'lucide-react';

interface PlaylistTrack {
  id: string;
  track_name: string;
  base_name: string;
  label: string;
  genre: string;
  language: string;
  image: string;
  audio: string;
  duration: string;
  artist_name: string;
  no_plays: string;
  no_downloads: string;
  music_id: string;
  data_id: string;
}

interface PlaylistData {
  id: string;
  playlist_id: string;
  data_id: string;
  member_id: string;
  music_id: string;
  base: string;
  base_id: string;
  active: string;
  time_number: string;
}

interface Playlist {
  id: string;
  playlist: string;
  member_id: string;
  active: string;
  time_number: string;
  Data?: PlaylistData[];
  Info?: PlaylistTrack[];
}

interface UserPlaylistProps {
  onPlay?: (track: PlaylistTrack) => void;
  currentPlaying?: PlaylistTrack | null;
  isPlaying?: boolean;
}

const UserPlaylist: React.FC<UserPlaylistProps> = ({ 
  onPlay, 
  currentPlaying, 
  isPlaying 
}) => {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (session) {
      fetchUserPlaylists();
    }
  }, [session]);

  const fetchUserPlaylists = async () => {
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

      const response = await fetch('https://singnify.com/api/v2/php/get-user-playlists.php?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "200" && data.message === "success") {
        setPlaylists(data.result || []);
      } else {
        throw new Error(data.message || 'Failed to fetch playlists');
      }
    } catch (err: any) {
      console.error('Error fetching playlists:', err);
      setError(err.message);
      
      // Fallback sample data
      const samplePlaylists = [
        {
          id: "1",
          playlist: "My Favorites",
          member_id: "4",
          active: "1",
          time_number: "1577016433",
          Data: [
            {
              id: "1",
              playlist_id: "1",
              data_id: "sample123",
              member_id: "4",
              music_id: "19",
              base: "track",
              base_id: "19",
              active: "1",
              time_number: "1577016445"
            }
          ],
          Info: [
            {
              id: "19",
              track_name: "Sample Track",
              base_name: "Sample Track",
              label: "Sample Label",
              genre: "Hip-Hop",
              language: "English",
              image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
              audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
              duration: "03:45",
              artist_name: "Sample Artist",
              no_plays: "100",
              no_downloads: "5",
              music_id: "19",
              data_id: "sample123"
            }
          ]
        }
      ];
      setPlaylists(samplePlaylists);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: PlaylistTrack) => {
    if (onPlay) {
      onPlay(track);
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    if (playlist.Info && playlist.Info.length > 0) {
      setSelectedPlaylist(playlist);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    // Here you would typically make an API call to create the playlist
    // For now, we'll just add it locally
    const newPlaylist: Playlist = {
      id: String(Date.now()),
      playlist: newPlaylistName,
      member_id: session?.user?.id || "4",
      active: "1",
      time_number: String(Math.floor(Date.now() / 1000)),
      Data: [],
      Info: []
    };
    
    setPlaylists(prev => [newPlaylist, ...prev]);
    setNewPlaylistName("");
    setShowCreateModal(false);
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading playlists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <List className="mx-auto mb-4 text-red-400" size={48} />
        <h3 className="text-xl font-medium text-gray-300 mb-2">Error loading playlists</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={fetchUserPlaylists}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (selectedPlaylist) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            ← Back to Playlists
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
              <List className="text-gray-400" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{selectedPlaylist.playlist}</h1>
              <p className="text-gray-300">
                {selectedPlaylist.Info?.length || 0} tracks
              </p>
            </div>
          </div>
        </div>

        {selectedPlaylist.Info && selectedPlaylist.Info.length > 0 ? (
          <div className="space-y-2">
            {selectedPlaylist.Info.map((track, index) => (
              <div
                key={track.data_id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    {currentPlaying?.music_id === track.music_id && isPlaying ? (
                      <Pause className="text-white" size={20} />
                    ) : (
                      <Play className="text-white" size={20} />
                    )}
                  </button>

                  <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                    <img 
                      src={track.image || '/api/placeholder/48/48'} 
                      alt={track.track_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      currentPlaying?.music_id === track.music_id ? 'text-purple-400' : 'text-white'
                    }`}>
                      {track.track_name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {track.artist_name || track.label}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{track.duration}</span>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{track.no_plays}</span>
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-600 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Music className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Empty playlist</h3>
            <p className="text-gray-500">Add some tracks to this playlist</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Create Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-16">
          <List className="mx-auto mb-4 text-gray-500" size={48} />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No playlists yet</h3>
          <p className="text-gray-500 mb-6">Create your first playlist to organize your music</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group cursor-pointer"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-700 relative flex items-center justify-center">
                {playlist.Info && playlist.Info.length > 0 ? (
                  <img 
                    src={playlist.Info[0].image || '/api/placeholder/300/300'} 
                    alt={playlist.playlist}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/300/300';
                    }}
                  />
                ) : (
                  <List className="text-gray-500" size={48} />
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="text-white" size={32} />
                </div>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate mb-1">
                    {playlist.playlist}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {playlist.Info?.length || 0} tracks
                  </p>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit playlist functionality
                    }}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                  >
                    <Edit3 size={14} className="text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(playlist.id);
                    }}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName("");
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPlaylist;