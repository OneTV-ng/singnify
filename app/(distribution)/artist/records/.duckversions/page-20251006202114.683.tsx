"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Play, Music, Album, List, Heart, FileText, AlertCircle, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Edit, Save, X, Plus, Trash2, Search, User, Users } from 'lucide-react';

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
  Token: string;
  EmailAddress: string;
  Phone: string;
  About: string;
  Gender: string;
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

// Profile Component
const ProfileTab = ({ member, onUpdateProfile }: {
  member: UserType | null;
  onUpdateProfile: (profileData: any) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    StageName: '',
    FirstName: '',
    LastName: '',
    EmailAddress: '',
    Phone: '',
    Country: '',
    About: '',
    Gender: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        StageName: member.StageName || '',
        FirstName: member.FirstName || '',
        LastName: member.LastName || '',
        EmailAddress: member.EmailAddress || '',
        Phone: member.Phone || '',
        Country: member.Country || '',
        About: member.About || '',
        Gender: member.Gender || ''
      });
    }
  }, [member]);

  const handleSave = async () => {
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    if (member) {
      setFormData({
        StageName: member.StageName || '',
        FirstName: member.FirstName || '',
        LastName: member.LastName || '',
        EmailAddress: member.EmailAddress || '',
        Phone: member.Phone || '',
        Country: member.Country || '',
        About: member.About || '',
        Gender: member.Gender || ''
      });
    }
    setIsEditing(false);
  };

  if (!member) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
          <button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Edit size={20} />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mx-auto md:mx-0">
              <img 
                src={member.Picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face'} 
                alt={member.StageName}
                className="w-full h-full object-cover"
              />
            </div>
            {!isEditing && (
              <div className="mt-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.Membership === 'premium' 
                      ? 'bg-yellow-600 text-yellow-100' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {member.Membership} Member
                  </span>
                  {member.IsVerified === "1" && (
                    <span className="bg-blue-600 px-2 py-1 rounded-full text-xs text-white">
                      Verified ✓
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">@{member.Username}</p>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="flex-1">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stage Name *
                  </label>
                  <input
                    type="text"
                    value={formData.StageName}
                    onChange={(e) => setFormData(prev => ({ ...prev, StageName: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.Gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, Gender: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.FirstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, FirstName: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.LastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, LastName: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.EmailAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, EmailAddress: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.Phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, Phone: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.Country}
                    onChange={(e) => setFormData(prev => ({ ...prev, Country: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    About
                  </label>
                  <textarea
                    value={formData.About}
                    onChange={(e) => setFormData(prev => ({ ...prev, About: e.target.value }))}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Tell us about yourself and your music..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Stage Name
                    </label>
                    <p className="text-white font-medium">{member.StageName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Gender
                    </label>
                    <p className="text-white">{member.Gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      First Name
                    </label>
                    <p className="text-white">{member.FirstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Last Name
                    </label>
                    <p className="text-white">{member.LastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <p className="text-white">{member.EmailAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone
                    </label>
                    <p className="text-white">{member.Phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Country
                    </label>
                    <p className="text-white">{member.Country}</p>
                  </div>
                </div>
                {member.About && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      About
                    </label>
                    <p className="text-white">{member.About}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors border border-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Tracks Component
const TracksTab = ({ tracks, loading, onPlay, currentPlaying, isPlaying }: {
  tracks: Track[];
  loading: boolean;
  onPlay: (track: Track) => void;
  currentPlaying: Track | null;
  isPlaying: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTracks = tracks.filter(track =>
    track.track_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h3 className="text-xl font-medium text-gray-300 mb-2">No tracks found</h3>
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
        <h2 className="text-2xl font-bold text-white">Your Tracks ({filteredTracks.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm text-gray-400 font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Track</div>
            <div className="col-span-2">Genre</div>
            <div className="col-span-1">Plays</div>
            <div className="col-span-1">Downloads</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          {filteredTracks.map((track, index) => {
            const trackId = track.id || track.music_id;
            const isCurrentTrack = currentPlaying && (currentPlaying.id === trackId || currentPlaying.music_id === trackId);
            
            return (
              <div
                key={trackId}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <div className="col-span-1 flex items-center">
                  <button 
                    onClick={() => onPlay(track)}
                    className="w-full text-left flex items-center justify-center"
                  >
                    {isCurrentTrack && isPlaying ? (
                      <Pause className="text-purple-400" size={16} />
                    ) : (
                      <Play className="text-purple-400" size={16} />
                    )}
                  </button>
                </div>
                
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                    <img 
                      src={track.image || '/api/placeholder/48/48'} 
                      alt={track.track_name || track.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-medium truncate ${
                      isCurrentTrack ? 'text-purple-400' : 'text-white'
                    }`}>
                      {track.track_name || track.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
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
                  {track.no_plays || track.Play || '0'}
                </div>
                
                <div className="col-span-1 flex items-center text-gray-400">
                  {track.no_downloads || track.Download || '0'}
                </div>
                
                <div className="col-span-2 flex items-center gap-2">
                  <button 
                    onClick={() => window.location.href = `/artist/track/${trackId}`}
                    className="p-2 hover:bg-gray-600 rounded transition-colors text-blue-400 hover:text-blue-300 text-xs"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => window.location.href = `/artist/track/${trackId}/edit`}
                    className="p-2 hover:bg-gray-600 rounded transition-colors text-green-400 hover:text-green-300 text-xs"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredTracks.map((track) => {
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
                  />
                  <button
                    onClick={() => onPlay(track)}
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
                  <h3 className="font-medium text-white truncate">
                    {track.track_name || track.name}
                  </h3>
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
                      {track.no_plays || track.Play || '0'} plays
                    </span>
                    <span className="text-xs text-gray-400">
                      {track.no_downloads || track.Download || '0'} downloads
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
const AlbumsTab = ({ albums, loading, onAlbumClick }: {
  albums: AlbumType[];
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
        <h2 className="text-2xl font-bold text-white">Your Albums ({albums.length})</h2>
        <button
          onClick={() => window.location.href = '/artist/albums/create'}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Album
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => (
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
                {album.artist}
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
        <h2 className="text-2xl font-bold text-white">Your Playlists ({playlists.length})</h2>
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
          >
            <div 
              className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-700 relative cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
              onClick={() => window.location.href = `/artist/playlist/${playlist.id}`}
            >
              <img 
                src={playlist.cover_image || '/api/placeholder/300/300'} 
                alt={playlist.playlist_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <List className="text-white" size={32} />
              </div>
            </div>
            
            <div 
              className="cursor-pointer"
              onClick={() => window.location.href = `/artist/playlist/${playlist.id}`}
            >
              <h3 className="font-medium text-white truncate mb-1 hover:text-purple-300 transition-colors">
                {playlist.playlist_name}
              </h3>
              <p className="text-sm text-gray-400 truncate mb-2 hover:text-gray-300 transition-colors">
                {playlist.description || 'No description'}
              </p>
            </div>
            
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

// Liked Component
const LikedTab = ({ likedItems, loading }: {
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

// Available Tabs
const TABS = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'albums', name: 'Albums', icon: Album },
  { id: 'tracks', name: 'Tracks', icon: Music },
  { id: 'playlist', name: 'Playlist', icon: List },
  { id: 'liked', name: 'Liked', icon: Heart },
  { id: 'following', name: 'Following', icon: Users }
];

// Main Component
const ArtistRecordsPage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [member, setMember] = useState<UserType | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hash, setHash ] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);


  // Audio player state
  const [currentPlaying, setCurrentPlaying] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    // ✅ Only run in the browser
    if (typeof window === "undefined") return;

    const getHash = () => window.location.hash.substring(1);
    setHash(getHash());

    const handleHashChange = () => setHash(getHash());
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };

 setActiveTab(hash||'profile');

  }, []);

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
        case 'profile':
                formData.append('table_name', 'members');
            formData.append('id',(session as any)?.user?.ID||"" );

//          endpoint = 'https://singnify.com/api/v2/php/get-user-profile.php';
          endpoint ="";// 'https://singnify.com/api/v2/php/get-record.php';

          break;
        case 'tracks':
          endpoint = 'https://singnify.com/api/v2/php/get-user-tracks.php';
          break;
        case 'albums':
          endpoint = 'https://singnify.com/api/v2/php/get-user-albums.php';
          break;
        case 'playlist':
          endpoint = 'https://singnify.com/api/v2/php/get-user-playlists.php';
          break;
        case 'liked':
          endpoint = 'https://singnify.com/api/v2/php/get-user-likes.php';
          break;
        case 'following':
          endpoint = 'https://singnify.com/api/v2/php/get-user-following.php';
          break;
        default:
          endpoint = 'https://singnify.com/api/v2/php/get-user-profile.php';
      }

if(endpoint=="")return;

      const response = await fetch(`${endpoint}?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "200" && data.message === "success") {
        setMember(data.user || data.member);
        
        switch (tab) {
          case 'profile':
            // Profile data is already in member
            break;
          case 'tracks':
            setTracks(data.result || []);
            break;
          case 'albums':
            setAlbums(data.albums || data.result || []);
            break;
          case 'playlist':
            setPlaylists(data.playlists || data.result || []);
            break;
          case 'liked':
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
      console.error(`Error fetching ${tab} data:`, err);
      setError(err.message);
      
      // Set fallback sample data
   //   setFallbackData(tab);
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = (tab: string) => {
    switch (tab) {
      case 'profile':
        setMember({
          ID: "4",
          Username: "nickzom",
          FirstName: "Nicholas",
          LastName: "Idoko",
          Picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face",
          StageName: "Nicholas Idoko",
          Country: "Nigeria",
          Membership: "premium",
          IsVerified: "1",
          Token: "2d2221021f85499a48b3684a6916136429d4bc0b",
          EmailAddress: "cidokonicholas@gmail.com",
          Phone: "+23407039247359",
          About: "I am the CEO of my company",
          Gender: "Male"
        });
        break;
      case 'tracks':
        setTracks([
          {
            id: "1",
            name: "Middle Child",
          artist_name: "J Cole",
            genre: "Hip-Hop",
            duration: "214",
            no_plays: "3",
            no_downloads: "0"
          },
          {
            id: "2",
            name: "Summer Vibes",
   artist_name: "Nicholas Idoko",
            genre: "R&B",
            duration: "180",
            no_plays: "15",
            no_downloads: "2"
          }
        ]);
        break;
      case 'albums':
        setAlbums([
          {
            id: "1",
            album_name: "Midnight Sessions",
            artist: "Nicholas Idoko",
            genre: "R&B",
            release_date: "2024-01-15",
            track_count: "12"
          }
        ]);
        break;
      case 'playlist':
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
      case 'liked':
        setLikedItems([]);
        break;
      case 'following':
        setFollowing([]);
        break;
    }
  };

  const handleUpdateProfile = async (profileData: any) => {
    if (!session) return;

    const token = (session as any).accessToken || (session as any)?.user?.Token || '';
    
    try {
      const formData = new FormData();
      formData.append('token', token);
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key]);
      });

      const response = await fetch('https://singnify.com/api/v2/php/update-profile.php?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.status === "200") {
        setMember(prev => prev ? { ...prev, ...profileData } : null);
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentPlaying(track);
    setIsPlaying(true);
    // Implement actual audio playback logic here
    console.log('Playing track:', track);
  };

  const handleAlbumClick = (albumId: string, album: AlbumType) => {
    window.location.href = `/artist/album/${albumId}`;
  };

  // Fetch data when tab changes or session loads
  useEffect(() => {
    if (session) {
      fetchUserData(activeTab);
    } else if (session === null) {
      setLoading(false);
      setError("Authentication required");
    }
  }, [session, activeTab]);

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
          <User className="mx-auto mb-4 text-purple-400" size={64} />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please sign in to view your artist profile.</p>
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
      case 'profile':
        return <ProfileTab member={member} onUpdateProfile={handleUpdateProfile} />;
      case 'tracks':
        return (
          <TracksTab 
            tracks={tracks}
            loading={loading}
            onPlay={handlePlayTrack}
            currentPlaying={currentPlaying}
            isPlaying={isPlaying}
          />
        );
      case 'albums':
        return <AlbumsTab albums={albums} loading={loading} onAlbumClick={handleAlbumClick} />;
      case 'playlist':
        return <PlaylistsTab playlists={playlists} loading={loading} />;
      case 'liked':
        return <LikedTab likedItems={likedItems} loading={loading} />;
      case 'following':
        return <FollowingTab following={following} loading={loading} />;
      default:
        return <ProfileTab member={member} onUpdateProfile={handleUpdateProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-8">
      {/* Success Banner */}
      {successMessage && (
        <div className="bg-green-900 border-l-4 border-green-500 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <p className="text-green-100">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-green-300 hover:text-green-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
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
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              <img 
                src={member?.Picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face'} 
                alt={member?.StageName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl md:text-4xl font-bold">
                  {member?.StageName}
                </h1>
                {member?.IsVerified === "1" && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-300">@{member?.Username}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-400">
                <span>{tracks.length} Tracks</span>
                <span>{albums.length} Albums</span>
                <span>{following.length} Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400 bg-gray-700'
                      : 'border-transparent text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
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
    </div>
  );
};

export default ArtistRecordsPage;