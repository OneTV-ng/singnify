"use client"
//@/app/artist/page.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Play, Music, Album, List, Heart, FileText, AlertCircle, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, User, Users, Plus, Search, Edit } from 'lucide-react';

// Types
interface UserType {
  ID: string;
  Username: string;
  FirstName: string;
  LastName: string;
  Picture: string;
  StageName: string;
  Country: string;
  Membership: string;
  IsVerified: string;
  EmailAddress?: string;
  Phone?: string;
  About?: string;
  Gender?: string;
}

interface Track {
  id: string | number;
  music_id?: string | number;
  track_name?: string;
  name?: string;
  artist?: { name: string; id: string };
  label?: string;
  url?: string;
  audio?: string;
  genre?: string;
  duration?: string;
  image?: string;
  no_plays?: string | number;
  no_downloads?: string | number;
  artist_name?: string;
  base_name?: string;
  language?: string;
  Play?: string | number;
  Download?: string | number;
}

interface AlbumType {
  id: string;
  title?: string;
  album_name?: string;
  artist?: string;
  cover_art?: string;
  image?: string;
  release_date?: string;
  track_count?: string | number;
  genre?: string;
  total_plays?: string;
}

interface Playlist {
  id: string;
  playlist_name: string;
  description?: string;
  cover_image?: string;
  track_count: number;
  is_public: boolean;
  created_at: string;
}

interface LikedItem {
  id: string;
  type: 'track' | 'album' | 'playlist';
  item: Track | AlbumType | Playlist;
  liked_at: string;
}

interface Following {
  id: string;
  artist_id: string;
  artist_name: string;
  artist_picture: string;
  followed_at: string;
}

// Songs Component
const SongsTab = ({ tracks, member, loading, onPlay, currentPlaying, isPlaying }: {
  tracks: Track[];
  member: UserType | null;
  loading: boolean;
  onPlay: (track: Track) => void;
  currentPlaying: Track | null;
  isPlaying: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTracks = tracks.filter(track =>
    (track.track_name || track.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (track.genre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (track: Track) => {
    onPlay(track);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-16">
        <Music className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-xl font-medium text-gray-300 mb-2">No songs found</h3>
        <p className="text-gray-500 mb-6">Upload your first track to get started</p>
        <button
          onClick={() => window.location.href = '/artist/upload'}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus size={20} />
          Upload Track
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Songs ({filteredTracks.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Desktop Table View for Songs */}
      <div className="hidden md:block">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm text-gray-400 font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Track</div>
            <div className="col-span-2">Genre</div>
            <div className="col-span-1">Duration</div>
            <div className="col-span-1">Plays</div>
            <div className="col-span-1">Actions</div>
          </div>
          
          {filteredTracks.map((track: Track, index: number) => {
            const trackId = track.id || track.music_id;
            const isCurrentTrack = currentPlaying && (currentPlaying.id === trackId || currentPlaying.music_id === trackId);
            
            return (
              <div
                key={trackId}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors group"
              >
                <div className="col-span-1 flex items-center">
                  <button 
                    onClick={() => handleItemClick(track)}
                    className="w-full text-left flex items-center justify-center"
                  >
                    {isCurrentTrack && isPlaying ? (
                      <Pause className="text-purple-400" size={16} />
                    ) : (
                      <>
                        <div className="group-hover:hidden text-gray-400">{index + 1}</div>
                        <Play className="hidden group-hover:block text-purple-400" size={16} />
                      </>
                    )}
                  </button>
                </div>
                
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                    <img 
                      src={track.image || '/api/placeholder/48/48'} 
                      alt={track.track_name || track.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className={`font-medium transition-colors ${
                      isCurrentTrack ? 'text-purple-400' : 'text-white group-hover:text-purple-400'
                    }`}>
                      {track.track_name || track.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {track.artist_name || track.label || track?.artist?.name}
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
                  {track.no_plays || track.Play || '0'}
                </div>
                
                <div className="col-span-1 flex items-center">
                  <button 
                    onClick={() => window.location.href = `/artist/song/${trackId}`}
                    className="p-2 hover:bg-gray-600 rounded-full transition-colors text-gray-400 hover:text-white text-xs"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View for Songs */}
      <div className="md:hidden space-y-3">
        {filteredTracks.map((track: Track) => {
          const trackId = track.id || track.music_id;
          const isCurrentTrack = currentPlaying && (currentPlaying.id === trackId || currentPlaying.music_id === trackId);
          
          return (
            <div
              key={trackId}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={track.image || '/api/placeholder/64/64'} 
                    alt={track.track_name || track.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/64/64';
                    }}
                  />
                  <button
                    onClick={() => handleItemClick(track)}
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center hover:bg-opacity-60 transition-all"
                  >
                    {isCurrentTrack && isPlaying ? (
                      <Pause className="text-white" size={20} />
                    ) : (
                      <Play className="text-white" size={20} />
                    )}
                  </button>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div 
                    className="cursor-pointer"
                    onClick={() => window.location.href = `/artist/song/${trackId}`}
                  >
                    <h3 className={`font-medium truncate hover:text-purple-300 transition-colors ${
                      isCurrentTrack ? 'text-purple-400' : 'text-white'
                    }`}>
                      {track.track_name || track.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate hover:text-gray-300 transition-colors">
                      {track?.artist?.name || track.label || track.artist_name}
                    </p>
                  </div>
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
                      {track.no_plays || track.Play || '0'} plays
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// Albums Component
const AlbumsTab = ({ albums, member, loading, onAlbumClick }: {
  albums: AlbumType[];
  member: UserType | null;
  loading: boolean;
  onAlbumClick: (albumId: string, album: AlbumType) => void;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-16">
        <Album className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-xl font-medium text-gray-300 mb-2">No albums found</h3>
        <p className="text-gray-500 mb-6">Create your first album to get started</p>
        <button
          onClick={() => window.location.href = '/artist/albums/create'}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus size={20} />
          Create Album
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Albums ({albums.length})</h2>
        <button
          onClick={() => window.location.href = '/artist/albums/create'}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Album
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album: AlbumType) => (
          <div
            key={album.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group cursor-pointer"
          >
            <div 
              className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-700 relative cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
              onClick={() => onAlbumClick(album.id, album)}
            >
              <img 
                src={album.cover_art || album.image || '/api/placeholder/300/300'} 
                alt={album.title || album.album_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/300/300';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="text-white" size={32} />
              </div>
            </div>
            
            <div 
              className="cursor-pointer"
              onClick={() => onAlbumClick(album.id, album)}
            >
              <h3 className="font-medium text-white truncate mb-1 hover:text-purple-300 transition-colors">
                {album.title || album.album_name}
              </h3>
              <p className="text-sm text-gray-400 truncate mb-2 hover:text-gray-300 transition-colors">
                {album.artist || member?.StageName}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{album.track_count || '0'} tracks</span>
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
  );
};

// Playlists Component
const PlaylistsTab = ({ playlists, loading }: {
  playlists: Playlist[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-16">
        <List className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-xl font-medium text-gray-300 mb-2">No playlists found</h3>
        <p className="text-gray-500 mb-6">Create your first playlist to get started</p>
        <button
          onClick={() => window.location.href = '/artist/playlists/create'}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus size={20} />
          Create Playlist
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Playlists ({playlists.length})</h2>
        <button
          onClick={() => window.location.href = '/artist/playlists/create'}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group cursor-pointer"
            onClick={() => window.location.href = `/artist/playlist/${playlist.id}`}
          >
            <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-700 relative">
              <img 
                src={playlist.cover_image || '/api/placeholder/300/300'} 
                alt={playlist.playlist_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <List className="text-white" size={32} />
              </div>
            </div>
            
            <h3 className="font-medium text-white truncate mb-1">
              {playlist.playlist_name}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-2">
              {playlist.description || 'No description'}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{playlist.track_count} tracks</span>
              <span className={`px-2 py-1 rounded-full ${
                playlist.is_public ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-300'
              }`}>
                {playlist.is_public ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// Likes Component
const LikesTab = ({ likedItems, loading }: {
  likedItems: LikedItem[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (likedItems.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-xl font-medium text-gray-300 mb-2">No liked items</h3>
        <p className="text-gray-500">Items you like will appear here</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-6">Liked Items ({likedItems.length})</h2>
      
      <div className="space-y-4">
        {likedItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => {
              const basePath = item.type === 'track' ? '/track' : 
                             item.type === 'album' ? '/album' : '/playlist';
              window.location.href = `${basePath}/${item.item.id}`;
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                <img 
                  src={item.type === 'track' ? (item.item as Track).image :
                       item.type === 'album' ? (item.item as AlbumType).cover_art :
                       (item.item as Playlist).cover_image || '/api/placeholder/48/48'} 
                  alt={item.type === 'track' ? (item.item as Track).track_name :
                       item.type === 'album' ? (item.item as AlbumType).album_name :
                       (item.item as Playlist).playlist_name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                    item.type === 'track' ? 'bg-blue-600 text-blue-100' :
                    item.type === 'album' ? 'bg-green-600 text-green-100' :
                    'bg-purple-600 text-purple-100'
                  }`}>
                    {item.type}
                  </span>
                  <h3 className="font-medium text-white truncate">
                    {item.type === 'track' ? (item.item as Track).track_name || (item.item as Track).name :
                     item.type === 'album' ? (item.item as AlbumType).album_name || (item.item as AlbumType).title :
                     (item.item as Playlist).playlist_name}
                  </h3>
                </div>
                <p className="text-sm text-gray-400">
                  Liked on {new Date(item.liked_at).toLocaleDateString()}
                </p>
              </div>
              
              <Heart className="text-red-500 flex-shrink-0" size={20} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// Following Component
const FollowingTab = ({ following, loading }: {
  following: Following[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (following.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="mx-auto mb-4 text-gray-500" size={48} />
        <h3 className="text-xl font-medium text-gray-300 mb-2">Not following anyone</h3>
        <p className="text-gray-500">Artists you follow will appear here</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-6">Following ({following.length})</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {following.map((artist) => (
          <div
            key={artist.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => window.location.href = `/artist/${artist.artist_id}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                <img 
                  src={artist.artist_picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face'} 
                  alt={artist.artist_name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate mb-1">
                  {artist.artist_name}
                </h3>
                <p className="text-sm text-gray-400">
                  Following since {new Date(artist.followed_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// Audio Player Controls Component
const AudioPlayerControls = ({ 
  currentTrack, 
  isPlaying, 
  onPlay, 
  onPrevious, 
  onNext, 
  volume, 
  onVolumeChange,
  shuffle,
  repeat,
  onShuffle,
  onRepeat,
  currentTime,
  duration,
  onSeek
}: {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  shuffle: boolean;
  repeat: boolean;
  onShuffle: () => void;
  onRepeat: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden flex-shrink-0">
              <img 
                src={currentTrack.image || '/api/placeholder/48/48'} 
                alt={currentTrack.track_name || currentTrack.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-white text-sm truncate">
                {currentTrack.track_name || currentTrack.name}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {currentTrack.artist?.name || currentTrack.label || currentTrack.artist_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onShuffle}
              className={`p-2 rounded-full transition-colors ${shuffle ? 'text-purple-400 bg-purple-900' : 'text-gray-400 hover:text-white'}`}
            >
              <Shuffle size={16} />
            </button>
            
            <button
              onClick={onPrevious}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={onPlay}
              className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="text-white" size={20} />
              ) : (
                <Play className="text-white" size={20} />
              )}
            </button>
            
            <button
              onClick={onNext}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>
            
            <button
              onClick={onRepeat}
              className={`p-2 rounded-full transition-colors ${repeat ? 'text-purple-400 bg-purple-900' : 'text-gray-400 hover:text-white'}`}
            >
              <Repeat size={16} />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Volume2 className="text-gray-400" size={16} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full accent-purple-500 h-1"
            />
          </div>
          <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ArtistContentPage = () => {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [member, setMember] = useState<UserType | null>(null);
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('songs');
  
  // Audio Player State
  const [currentPlaying, setCurrentPlaying] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setError('Failed to play audio. The audio file may be corrupted or unavailable.');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Fetch user data based on active tab
  const fetchUserData = async (tab: string) => {
    if (!session) {
      setError("No session available");
      setLoading(false);
      return;
    }

    const token = (session as any).accessToken || (session as any)?.user?.Token || '';
    
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

      let endpoint = '';
      
      switch (tab) {
        case 'songs':
          endpoint = 'https://singnify.com/api/v2/php/get-user-tracks.php';
          break;
        case 'albums':
          endpoint = 'https://singnify.com/api/v2/php/get-user-albums.php';
          break;
        case 'playlists':
          endpoint = 'https://singnify.com/api/v2/php/get-user-playlists.php';
          break;
        case 'likes':
          endpoint = 'https://singnify.com/api/v2/php/get-user-likes.php';
          break;
        case 'following':
          endpoint = 'https://singnify.com/api/v2/php/get-user-following.php';
          break;
        default:
          endpoint = 'https://singnify.com/api/v2/php/get-user-tracks.php';
      }

      const response = await fetch(`${endpoint}?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`${tab} data:`, data);
      
      if (data.status === "200" && data.message === "success") {
        setMember(data.member || data.user);
        
        switch (tab) {
          case 'songs':
            setTracks(data.result || []);
            break;
          case 'albums':
            setAlbums(data.results || data.albums || []);
            break;
          case 'playlists':
            setPlaylists(data.playlists || data.result || []);
            break;
          case 'likes':
            setLikedItems(data.likes || data.result || []);
            break;
          case 'following':
            setFollowing(data.following || data.result || []);
            break;
        }
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (err: any) {
      console.error(`Error fetching ${tab}:`, err);
      setError(err.message);
      setFallbackData(tab);
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = (tab: string) => {
    setMember({
      ID: "4",
      Username: "nickzom",
      FirstName: "Nicholas",
      LastName: "Idoko",
      Picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face",
      StageName: "Nicholas Idoko",
      Country: "Nigeria",
      Membership: "premium",
      IsVerified: "1"
    });
    
    switch (tab) {
      case 'songs':
        setTracks([
          {
            id: "183",
            track_name: "Mo Money",
            label: "Nicholas",
            genre: "Hip-Hop",
            duration: "01:05",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            no_plays: "99",
            audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
          },
          {
            id: "184",
            track_name: "Summer Nights",
            label: "Nicholas",
            genre: "R&B",
            duration: "03:22",
            image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
            no_plays: "156",
            audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
          }
        ]);
        break;
      case 'albums':
        setAlbums([
          {
            id: "1",
            title: "Midnight Sessions",
            artist: "Nicholas Idoko",
            cover_art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            release_date: "2024-01-15",
            track_count: "12",
            genre: "R&B"
          }
        ]);
        break;
      case 'playlists':
        setPlaylists([
          {
            id: "1",
            playlist_name: "My Favorites",
            description: "My favorite tracks",
            track_count: 8,
            is_public: true,
            created_at: "2024-01-01"
          }
        ]);
        break;
    }
  };

  const getTrackId = (track: Track) => track.id || track.music_id;

  const handlePlay = async (track?: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (track) {
        const trackId = getTrackId(track);
        const currentTrackId = currentPlaying ? getTrackId(currentPlaying) : null;
        
        if (currentTrackId == trackId) {
          if (isPlaying) {
            audio.pause();
          } else {
            await audio.play();
          }
          return;
        }

        const audioUrl = track.audio || track.url;
        if (!audioUrl) {
          setError('No audio URL available for this track');
          return;
        }

        audio.pause();
        audio.currentTime = 0;
        setCurrentPlaying(track);
        audio.src = audioUrl;
        
        const index = tracks.findIndex(t => getTrackId(t) == trackId);
        setCurrentIndex(index !== -1 ? index : 0);
        
        await audio.play();
        setError(null);
        updatePlayCount(trackId || 0);
      } else if (currentPlaying) {
        if (isPlaying) {
          audio.pause();
        } else {
          await audio.play();
        }
      }
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    
    let nextIndex;
    
    if (shuffle) {
      let availableIndices = tracks.map((_, index) => index).filter(index => index !== currentIndex);
      if (availableIndices.length === 0) availableIndices = [0];
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= tracks.length) {
        nextIndex = repeat ? 0 : currentIndex;
      }
    }
    
    if (nextIndex !== currentIndex && nextIndex < tracks.length && tracks[nextIndex]) {
      handlePlay(tracks[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (tracks.length === 0) return;
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeat ? tracks.length - 1 : 0;
    }
    
    if (prevIndex !== currentIndex && prevIndex >= 0 && tracks[prevIndex]) {
      handlePlay(tracks[prevIndex]);
    }
  };

  const updatePlayCount = async (trackId: string | number) => {
    if (!session) return;
    
    const token = (session as any).accessToken || (session as any)?.user?.Token || '';
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('track_id', trackId.toString());

      await fetch('https://singnify.com/api/v2/php/update-play-count.php?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c', {
        method: 'POST',
        body: formData,
      });

      setTracks(prevTracks => 
        prevTracks.map(track => {
          const currentTrackId = getTrackId(track);
          if (currentTrackId == trackId) {
            return {
              ...track,
              no_plays: (parseInt(track.no_plays?.toString() || '0') + 1).toString()
            };
          }
          return track;
        })
      );
    } catch (err) {
      console.error('Error updating play count:', err);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleShuffle = () => {
    setShuffle(!shuffle);
  };

  const handleRepeat = () => {
    setRepeat(!repeat);
  };

  const handleAlbumClick = (albumId: string, album: AlbumType) => {
    window.location.href = `/artist/album/${albumId}`;
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'press-release') {
      window.location.href = '/artist/press';
      return;
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    if (session) {
      fetchUserData(activeTab);
    } else if (session === null) {
      setLoading(false);
      setError("Authentication required");
    }
  }, [session, activeTab]);

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Music className="mx-auto mb-4 text-purple-400" size={64} />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please sign in to view your content and manage your music.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'songs':
        return (
          <SongsTab 
            tracks={tracks}
            member={member}
            loading={loading}
            onPlay={handlePlay}
            currentPlaying={currentPlaying}
            isPlaying={isPlaying}
          />
        );
      case 'albums':
        return (
          <AlbumsTab 
            albums={albums}
            member={member}
            loading={loading}
            onAlbumClick={handleAlbumClick}
          />
        );
      case 'playlists':
        return <PlaylistsTab playlists={playlists} loading={loading} />;
      case 'likes':
        return <LikesTab likedItems={likedItems} loading={loading} />;
      case 'following':
        return <FollowingTab following={following} loading={loading} />;
      default:
        return (
          <SongsTab 
            tracks={tracks}
            member={member}
            loading={loading}
            onPlay={handlePlay}
            currentPlaying={currentPlaying}
            isPlaying={isPlaying}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      {error && (
        <div className="bg-red-900 border-l-4 border-red-500 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <AlertCircle className="text-red-400 mr-2" size={20} />
              <div>
                <p className="text-red-100 font-medium">
                  {error.includes('Authentication') ? 'Authentication Error' : 'Error'}
                </p>
                <p className="text-red-200 text-sm">{error}</p>
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
                onClick={() => setError(null)}
                className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Dismiss
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
                src={member?.Picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face'} 
                alt={member?.StageName || `${member?.FirstName} ${member?.LastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face';
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
                <span>{tracks.length} Songs</span>
                <span>{albums.length} Albums</span>
                <span>{following.length} Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            {[
              { id: 'songs', label: 'Songs', icon: Music },
              { id: 'albums', label: 'Albums', icon: Album },
              { id: 'playlists', label: 'Playlists', icon: List },
              { id: 'likes', label: 'Likes', icon: Heart },
              { id: 'following', label: 'Following', icon: Users },
              { id: 'press-release', label: 'Press Release', icon: FileText }
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
        {renderActiveTab()}
      </div>

      {/* Audio Player Controls */}
      <AudioPlayerControls
        currentTrack={currentPlaying}
        isPlaying={isPlaying}
        onPlay={() => handlePlay()}
        onPrevious={handlePrevious}
        onNext={handleNext}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        shuffle={shuffle}
        repeat={repeat}
        onShuffle={handleShuffle}
        onRepeat={handleRepeat}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />
    </div>
  );
};

export default ArtistContentPage;