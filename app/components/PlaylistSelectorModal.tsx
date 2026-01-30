'use client';

import { useState, useEffect } from 'react';
import { Music, Plus, Check, Loader2, X } from 'lucide-react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import { useSession } from 'next-auth/react';

interface PlaylistSelectorModalProps {
  trackIds: string[];
  tracks: Array<{ id: string; data_id: string; base: string; base_id: string }>;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PlaylistSelectorModal({
  trackIds,
  tracks,
  onClose,
  onSuccess
}: PlaylistSelectorModalProps) {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch playlists on mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiClient = getSingnifyApiClient();
        const token = (session as any).accessToken || (session as any)?.user?.Token || '';
        if (token) {
          apiClient.setToken(token);
        }

        const fetchedPlaylists = await apiClient.getUserPlaylists();
        setPlaylists(fetchedPlaylists || []);
      } catch (err: any) {
        console.error('Failed to fetch playlists:', err);
        setError(err.message || 'Failed to load playlists');
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchPlaylists();
    }
  }, [session]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      alert('Please enter a playlist name');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const newPlaylist = await apiClient.createPlaylist(newPlaylistName);
      setPlaylists(prev => [...prev, newPlaylist]);
      setSelectedPlaylistId(newPlaylist.id);
      setNewPlaylistName('');
      setShowCreateForm(false);
    } catch (err: any) {
      console.error('Failed to create playlist:', err);
      setError(err.message || 'Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const handleAddTracksToPlaylist = async () => {
    if (!selectedPlaylistId) {
      alert('Please select a playlist');
      return;
    }

    try {
      setAdding(true);
      setError(null);

      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.addTracksToPlaylist(selectedPlaylistId, tracks);

      // Success - close modal and call callback
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      console.error('Failed to add tracks to playlist:', err);
      setError(err.message || 'Failed to add tracks to playlist');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Music className="w-5 h-5" />
            Save {trackIds.length} track{trackIds.length !== 1 ? 's' : ''} to Playlist
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Create New Playlist Button */}
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={creating}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg mb-4 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Playlist
          </button>

          {/* Create New Playlist Form */}
          {showCreateForm && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <input
                type="text"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={creating}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPlaylistName('');
                  }}
                  disabled={creating}
                  className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={creating}
                  className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Playlists List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              <span className="ml-2 text-gray-400 text-sm">Loading playlists...</span>
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-8">
              <Music className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No playlists yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <label
                  key={playlist.id}
                  className="flex items-center p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="playlist"
                    value={playlist.id}
                    checked={selectedPlaylistId === playlist.id}
                    onChange={(e) => setSelectedPlaylistId(e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{playlist.playlist || playlist.name}</p>
                    <p className="text-gray-400 text-sm">
                      {playlist.playlist_count || 0} track{(playlist.playlist_count || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {selectedPlaylistId === playlist.id && (
                    <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-6 border-t border-gray-700 bg-gray-900">
          <button
            onClick={onClose}
            disabled={adding}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTracksToPlaylist}
            disabled={adding || !selectedPlaylistId || loading}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {adding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add to Playlist'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
