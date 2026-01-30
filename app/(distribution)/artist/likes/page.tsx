'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Pause, Loader2, AlertCircle, Music, Download, Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import PlaylistSelectorModal from '@/app/components/PlaylistSelectorModal';
import Link from 'next/link';

interface LikedTrack {
  id: string;
  music_id: string;
  track_name: string;
  base_name: string;
  label: string;
  artist_name: string;
  genre: string;
  language: string;
  image: string;
  audio: string;
  duration: string;
  no_plays: string;
  no_downloads: string;
  country: string;
  choice: string;
  base: string;
  chart: string;
  user_id: string;
  display_upc: string | null;
  display_isrc: string | null;
  active: string;
  time_number: string;
  time_approved_lap: string;
  data_id: string;
  actor: string;
}

export default function LikesPage() {
  const { data: session } = useSession();
  const [likedTracks, setLikedTracks] = useState<LikedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkUnliking, setBulkUnliking] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchLikedTracks = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiClient = getSingnifyApiClient();
        const token = (session as any).accessToken || (session as any)?.user?.Token || '';
        if (token) {
          apiClient.setToken(token);
        }

        const tracks = await apiClient.getUserLikes();
        setLikedTracks(tracks || []);
      } catch (err: any) {
        console.error('Error fetching liked tracks:', err);
        setError(err.message || 'Failed to load liked tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedTracks();
  }, [session]);

  const handlePlay = (track: LikedTrack) => {
    if (audioRef.current) {
      if (currentlyPlaying === track.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.pause();
        audioRef.current.src = track.audio;
        audioRef.current.play();
        setCurrentlyPlaying(track.id);
        setIsPlaying(true);
      }
    }
  };

  const toggleSelection = (trackId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === likedTracks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(likedTracks.map(t => t.id)));
    }
  };

  const handleUnlike = async (trackId: string) => {
    try {
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.unlikeTrack(trackId);
      setLikedTracks(prev => prev.filter(t => t.id !== trackId));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(trackId);
        return newSet;
      });
    } catch (err) {
      console.error('Failed to unlike track:', err);
      alert('Failed to unlike track. Please try again.');
    }
  };

  const bulkUnlike = async () => {
    if (selectedIds.size === 0) return;

    try {
      setBulkUnliking(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const trackIds = Array.from(selectedIds);
      await apiClient.bulkUnlikeTrack(trackIds);

      // Remove unliked tracks from display
      setLikedTracks(prev => prev.filter(t => !selectedIds.has(t.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Bulk unlike failed:', err);
      alert('Failed to unlike some tracks. Please try again.');
    } finally {
      setBulkUnliking(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentlyPlaying(null);
  };

  const formatPlayCount = (count: string | null): string => {
    if (!count) return '0';
    const num = parseInt(count);
    if (isNaN(num)) return count;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (error && loading) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <div>
          <p className="text-red-400 font-medium">Error loading liked tracks</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Liked Tracks</h1>
          <p className="text-gray-400">{likedTracks.length} track{likedTracks.length !== 1 ? 's' : ''}</p>
        </div>
        <Heart className="w-8 h-8 text-red-500 fill-current" />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading liked tracks...</span>
        </div>
      )}

      {!loading && likedTracks.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-300 mb-2">No liked tracks yet</h2>
          <p className="text-gray-400 mb-6">Start exploring and liking tracks to see them here</p>
          <Link
            href="/browse"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
          >
            Explore Music
          </Link>
        </div>
      )}

      {!loading && likedTracks.length > 0 && (
        <>
          {/* Bulk Action Toolbar */}
          {selectedIds.size > 0 && (
            <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-4 mb-6 flex items-center justify-between sticky top-0 z-40">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.size === likedTracks.length}
                  onChange={toggleSelectAll}
                  className="cursor-pointer w-5 h-5 rounded"
                />
                <span className="text-white font-medium">
                  {selectedIds.size} track{selectedIds.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700/50 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={() => setShowPlaylistModal(true)}
                  disabled={bulkUnliking}
                  className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                >
                  Add to Playlist
                </button>
                <button
                  onClick={bulkUnlike}
                  disabled={bulkUnliking}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                >
                  {bulkUnliking ? 'Unliking...' : `Unlike ${selectedIds.size}`}
                </button>
              </div>
            </div>
          )}

          {/* Select All Checkbox */}
          {!selectedIds.size && likedTracks.length > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={false}
                onChange={toggleSelectAll}
                className="cursor-pointer w-4 h-4 rounded"
                title="Select all tracks"
              />
              <span className="text-sm text-gray-400">Select all</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedTracks.map((track) => (
            <div
              key={track.id}
              className={`rounded-lg overflow-hidden hover:bg-gray-750 transition-colors group border-2 ${
                selectedIds.has(track.id)
                  ? 'bg-indigo-900/30 border-indigo-600'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              {/* Album Art with Checkbox Overlay */}
              <div className="relative aspect-square overflow-hidden bg-gray-900">
                <img
                  src={track.image || '/placeholder.png'}
                  alt={track.track_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Checkbox Overlay */}
                <div className="absolute top-2 left-2 z-20">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(track.id)}
                    onChange={() => toggleSelection(track.id)}
                    className="cursor-pointer w-5 h-5 rounded"
                  />
                </div>
                {/* Overlay with Play Button */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handlePlay(track)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full transition-colors"
                  >
                    {isPlaying && currentlyPlaying === track.id ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Track Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white truncate">{track.track_name}</h3>
                    <p className="text-sm text-gray-400 truncate">{track.artist_name || track.label}</p>
                  </div>
                  <button
                    onClick={() => handleUnlike(track.id)}
                    className="text-red-500 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {track.genre && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {track.genre}
                    </span>
                  )}
                  {track.language && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {track.language}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span>{track.duration}</span>
                  <span>•</span>
                  <span>{formatPlayCount(track.no_plays)} plays</span>
                  <span>•</span>
                  <span>{formatPlayCount(track.no_downloads)} downloads</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-700">
                  <button
                    onClick={() => handlePlay(track)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-indigo-400 py-2 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    {isPlaying && currentlyPlaying === track.id ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Playing
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Play
                      </>
                    )}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-blue-400 py-2 rounded hover:bg-gray-700/50 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-green-400 py-2 rounded hover:bg-gray-700/50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <PlaylistSelectorModal
          trackIds={Array.from(selectedIds)}
          tracks={likedTracks
            .filter(t => selectedIds.has(t.id))
            .map(t => ({
              id: t.music_id || t.id,
              data_id: t.data_id,
              base: t.base,
              base_id: t.id // Using track id as base_id fallback
            }))}
          onClose={() => setShowPlaylistModal(false)}
          onSuccess={() => {
            setShowPlaylistModal(false);
            setSelectedIds(new Set());
          }}
        />
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
}
