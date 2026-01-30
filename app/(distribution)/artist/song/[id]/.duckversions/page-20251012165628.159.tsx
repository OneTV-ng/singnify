"use client";
// @/app/artist/song/[id]/page.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useParams, useRouter } from 'next/navigation';
import {
  Play, Pause, Music, Image, Edit, Save, X, ArrowLeft, Download, Share, Heart, 
  Eye, Calendar, Globe, Flag, AlertTriangle, User, FileText, Star, Check, 
  Upload, Loader2, Link, Users, Info, Volume2, SkipBack, SkipForward
} from 'lucide-react';

import ImageUploadComponent from '@/app/components/singnify/ImageUploadComponent';
import TrackUploadComponent from '@/app/components/singnify/TrackUplaodComponent';

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
  Token?: string;
}

interface Track {
  id: string | number;
  music_id?: string | number;
  track_name: string;
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
  country?: string;
  record_label?: string;
  is_explicit?: boolean;
  is_cover?: boolean;
  description?: string;
  lyrics?: string;
  feature?: string;
  compose?: string;
  spotify_url?: string;
  itunes_url?: string;
  video_url?: string;
  created_at?: string;
  updated_at?: string;
  biography?: string;
  choice?: 'solo' | 'collaboration';
  someone_full_name?: string;
  someone_name?: string;
  someone_phone?: string;
  someone_email?: string;
  
  // Additional fields for editing
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  contact_phone?: string;
  com_lname1?: string;
  com_mname1?: string;
  com_fname1?: string;
  com_lname2?: string;
  com_mname2?: string;
  com_fname2?: string;
  com_lname3?: string;
  com_mname3?: string;
  com_fname3?: string;
  lyrics_file?: File | null;
  music_upload_date?: string;
}

interface EditFormData extends Track {
  token: string;
  name: string;
  is_edit: string;
  track_id: string;
}

// API Configuration
const API_CONFIG = {
  getUserTracksEndpoint: 'https://singnify.com/api/v2/php/get-user-tracks.php',
  saveAudioEndpoint: 'https://singnify.com/api/v2/php/save-audio.php',
  apiKey: '7c6a180b36896a0a8c02787eeafb0e4c',
  getRecord: 'https://singnify.com/api/v2/php/get-record.php',
};

const SongDetailPage: React.FC = () => {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const songId = params?.id as string;
  
  const [track, setTrack] = useState<Track | null>(null);
  const [member, setMember] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
type TabType = 'songs' | 'albums' | 'about'|'playlist'|'likes'|'press';


   // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('songs');
  // Edit form state
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);

  // Form data for all fields
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


  // Hash-based tab detection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['songs', 'albums', 'about', 'playlist', 'likes', 'press'].includes(hash)) {
        setActiveTab(hash as TabType);
      } else {
        // Default to songs if no hash or invalid hash
        setActiveTab('songs');
      }
    };

    // Set initial tab from URL hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update URL hash when tab changes
  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError('Failed to play audio');
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

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Fetch track data
  const fetchTrack = async () => {
    if (!session || !songId) {
      setError("No session or song ID available");
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


      const response = await fetch(`${API_CONFIG.getUserTracksEndpoint}?API_KEY=${API_CONFIG.apiKey}`, {
        method: 'POST',
        body: formData,
      });




      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();


      formData.append('id', songId );
      formData.append('table_name', 'tracks' );

      const respont = await fetch(`${API_CONFIG.getRecord}?API_KEY=${API_CONFIG.apiKey}`, {
        method: 'POST',
        body: formData,
      });


      

      if (!respont.ok) {
        throw new Error(`HTTP error! status: ${respont.status}`);
      }
      const tData = await respont.json();
console.log(tData);




      if (tData.status === "200" && tData.message === "success") {
        setMember(data.member);
        const tracks = data.result || [];
        
        // Find the specific track by ID
        const foundTrack = tracks.find((t: Track) => {
          const trackId = t.id || t.music_id;
          return trackId?.toString() === songId;
        });
        
        if (foundTrack) {
          setTrack(foundTrack);
          // Initialize edit form data
          setEditFormData({
            ...foundTrack,
            token: token,
            name:  foundTrack.track_name || foundTrack.name || '',
track_name:  foundTrack.track_name || foundTrack.name || '',
            artist_name:foundTrack.artist_name || '',


            is_edit: '1',
            track_id: (foundTrack.id || foundTrack.music_id)?.toString() || '',
            // Initialize missing fields with defaults
            choice: foundTrack.choice || 'solo',
            someone_full_name: foundTrack.someone_full_name || '',
            someone_name: foundTrack.someone_name || '',
            someone_phone: foundTrack.someone_phone || '',
            someone_email: foundTrack.someone_email || '',
            first_name: foundTrack.first_name || data.member?.FirstName || '',
            middle_name: foundTrack.middle_name || '',
            last_name: foundTrack.last_name || data.member?.LastName || '',
            contact_phone: foundTrack.contact_phone || data.member?.Phone || '',
            com_lname1: foundTrack.com_lname1 || '',
            com_mname1: foundTrack.com_mname1 || '',
            com_fname1: foundTrack.com_fname1 || '',
            com_lname2: foundTrack.com_lname2 || '',
            com_mname2: foundTrack.com_mname2 || '',
            com_fname2: foundTrack.com_fname2 || '',
            com_lname3: foundTrack.com_lname3 || '',
            com_mname3: foundTrack.com_mname3 || '',
            com_fname3: foundTrack.com_fname3 || '',
            lyrics_file: null,
            music_upload_date: foundTrack.music_upload_date || new Date().toISOString().split('T')[0],
            biography: foundTrack.biography || data.member?.About || '',
          });
        } else {
          setError("Track not found");
        }
      } else {
        throw new Error(data.message || 'Failed to fetch track');
      }
    } catch (err: any) {
      console.error('Error fetching track:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
  }, [session, songId]);

  // Audio player functions
  const handlePlay = async () => {
    if (!audioRef.current || !track?.audio) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (audioRef.current.src !== track.audio) {
          audioRef.current.src = track.audio;
        }
        await audioRef.current.play();
      }
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio');
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Edit mode functions
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    setSubmissionStatus(null);
    setErrorMessage('');
  };

  const handleInputChange = (field: keyof EditFormData, value: any) => {
    if (editFormData) {
      setEditFormData(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (field: 'lyrics_file', file: File | null) => {
    if (editFormData) {
      setEditFormData(prev => ({
        ...prev!,
        [field]: file
      }));
    }
  };

  // Submit edited track
  const submitEditedTrack = async () => {
    if (!editFormData) return;
    
    setIsSubmitting(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    // Validation
    const requiredFields = {
      'Track Name': editFormData.track_name?.trim(),
      'Artist Name': editFormData.artist_name?.trim(),
      'Genre': editFormData.genre?.trim(),
      'Language': editFormData.language?.trim(),
      'Country': editFormData.country?.trim(),
      'Label': editFormData.label?.trim(),
      'Record Label': editFormData.label?.trim(),
      'Description': editFormData.description?.trim(),
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field, _]) => field);

    if (missingFields.length > 0) {
      setSubmissionStatus('error');
      setErrorMessage(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Build FormData for submission
    const formDataToSubmit = new FormData();

    // Authentication and edit flags
    formDataToSubmit.append('token', editFormData.token);
    formDataToSubmit.append('is_edit', '1');
    formDataToSubmit.append('track_id', editFormData.track_id);

    // Required fields
    formDataToSubmit.append('artist_name', editFormData?.artist_name?.trim() || '');

formDataToSubmit.append('name', editFormData?.track_name.trim()  || '');
    formDataToSubmit.append('label', editFormData?.label?.trim() || editFormData?.record_label?.trim() || '');
    formDataToSubmit.append('genre', editFormData.genre?.trim() || '');
    formDataToSubmit.append('language', editFormData.language?.trim() || '');
    formDataToSubmit.append('duration', editFormData.duration?.trim() || '');
    formDataToSubmit.append('country', editFormData.country?.trim() || '');
    formDataToSubmit.append('choice', editFormData.choice?.trim() || 'solo');
    formDataToSubmit.append('record_label', editFormData?.record_label?.trim() ||  editFormData?.label?.trim() || '');
    formDataToSubmit.append('description', editFormData.description?.trim() || '');

    // File handling
    formDataToSubmit.append('audio', editFormData.audio || '');
    formDataToSubmit.append('image', editFormData.image || '');
    formDataToSubmit.append('is_cover', editFormData.is_cover ? '1' : '0');

    // All other fields
    formDataToSubmit.append('track_name', editFormData.track_name?.trim() || '');
    formDataToSubmit.append('someone_full_name', editFormData.someone_full_name?.trim() || '');
    formDataToSubmit.append('someone_name', editFormData.someone_name?.trim() || '');
    formDataToSubmit.append('someone_phone', editFormData.someone_phone?.trim() || '');
    formDataToSubmit.append('someone_email', editFormData.someone_email?.trim() || '');
    formDataToSubmit.append('is_admin', '0');
    formDataToSubmit.append('arg', '');
    formDataToSubmit.append('last_name', editFormData.last_name?.trim() || '');
    formDataToSubmit.append('middle_name', editFormData.middle_name?.trim() || '');
    formDataToSubmit.append('first_name', editFormData.first_name?.trim() || '');
    formDataToSubmit.append('contact_phone', editFormData.contact_phone?.trim() || '');

    // Composer fields
    formDataToSubmit.append('com_lname1', editFormData.com_lname1?.trim() || '');
    formDataToSubmit.append('com_mname1', editFormData.com_mname1?.trim() || '');
    formDataToSubmit.append('com_fname1', editFormData.com_fname1?.trim() || '');
    formDataToSubmit.append('com_lname2', editFormData.com_lname2?.trim() || '');
    formDataToSubmit.append('com_mname2', editFormData.com_mname2?.trim() || '');
    formDataToSubmit.append('com_fname2', editFormData.com_fname2?.trim() || '');
    formDataToSubmit.append('com_lname3', editFormData.com_lname3?.trim() || '');
    formDataToSubmit.append('com_mname3', editFormData.com_mname3?.trim() || '');
    formDataToSubmit.append('com_fname3', editFormData.com_fname3?.trim() || '');

    // Additional metadata fields
    formDataToSubmit.append('lyrics', editFormData.lyrics?.trim() || '');
    formDataToSubmit.append('feature', editFormData.feature?.trim() || '');
    formDataToSubmit.append('compose', editFormData.compose?.trim() || '');
    formDataToSubmit.append('is_explicit', editFormData.is_explicit ? '1' : '0');
    formDataToSubmit.append('spotify_url', editFormData.spotify_url?.trim() || '');
    formDataToSubmit.append('itunes_url', editFormData.itunes_url?.trim() || '');
    formDataToSubmit.append('video_url', editFormData.video_url?.trim() || '');
    formDataToSubmit.append('biography', editFormData.biography?.trim() || '');

    // Date handling
    if (editFormData.music_upload_date) {
      try {
        const timestamp = Math.floor(new Date(editFormData.music_upload_date).getTime() / 1000);
        formDataToSubmit.append('music_upload_date', timestamp.toString());
      } catch (e) {
        formDataToSubmit.append('music_upload_date', '0');
      }
    } else {
      formDataToSubmit.append('music_upload_date', '0');
    }

    // Lyrics file
    if (editFormData.lyrics_file && editFormData.lyrics_file.size > 0) {
      formDataToSubmit.append('lyrics_file', editFormData.lyrics_file, editFormData.lyrics_file.name);
    } else {
      formDataToSubmit.append('lyrics_file', '');
    }

    try {
      const response = await fetch(`${API_CONFIG.saveAudioEndpoint}?API_KEY=${API_CONFIG.apiKey}`, {
        method: 'POST',
        body: formDataToSubmit,
      });

      const result = await response.json();

      if (result.status === '200') {
        setSubmissionStatus('success');
        setErrorMessage('Track updated successfully!');
        setIsEditMode(false);
        // Refresh track data
        await fetchTrack();
      } else {
        setSubmissionStatus('error');
        setErrorMessage(result.message || 'Failed to update track');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading track details...</p>
        </div>
      </div>
    );
  }

  if (!track || error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Music className="mx-auto mb-4 text-red-400" size={64} />
          <h2 className="text-2xl font-bold text-white mb-4">Track Not Found</h2>
          <p className="text-gray-300 mb-6">{error || "The requested track could not be found."}</p>
          <button 
            onClick={() => router.back()}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Track Details</h1>
            <div className="flex-1"></div>
            <button 
              onClick={handleEditToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isEditMode 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isEditMode ? <X size={18} /> : <Edit size={18} />}
              {isEditMode ? 'Cancel Edit' : 'Edit Track'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {submissionStatus && (
        <div className={`p-4 ${submissionStatus === 'success' ? 'bg-green-900' : 'bg-red-900'} border-l-4 ${submissionStatus === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              {submissionStatus === 'success' ? <Check className="text-green-400 mr-2" size={20} /> : <X className="text-red-400 mr-2" size={20} />}
              <p className={`${submissionStatus === 'success' ? 'text-green-100' : 'text-red-100'} font-medium`}>
                {errorMessage}
              </p>
            </div>
            <button 
              onClick={() => setSubmissionStatus(null)}
              className={`${submissionStatus === 'success' ? 'bg-green-800 hover:bg-green-700' : 'bg-red-800 hover:bg-red-700'} px-4 py-2 rounded text-sm font-medium transition-colors`}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {isEditMode ? (
          // Edit Mode
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">Edit Track</h2>
            
            {editFormData && (
              <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Track Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={editFormData.track_name || ''}
                      onChange={(e) => handleInputChange('track_name', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Artist Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={editFormData.artist_name || ''}
                      onChange={(e) => handleInputChange('artist_name', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Genre <span className="text-red-400">*</span></label>
                    <select
                      value={editFormData.genre || ''}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="">Select genre</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre.toLowerCase()}>{genre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Language <span className="text-red-400">*</span></label>
                    <select
                      value={editFormData.language || ''}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="">Select language</option>
                      {languages.map(lang => (
                        <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Country <span className="text-red-400">*</span></label>
                    <select
                      value={editFormData.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="">Select country</option>
                      {countries.map(country => (
                        <option key={country} value={country.toLowerCase()}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Record Label <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={editFormData.label || ''}
                      onChange={(e) => handleInputChange('label', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description <span className="text-red-400">*</span></label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                {/* Media Files */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Media Files</h3>
                  
                  {/* Audio Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Music className="w-4 h-4 text-purple-400" />
                      Audio File (MP3)
                    </label>
                    <TrackUploadComponent
                      value={editFormData.audio}
                      onChange={(fileUrl, response) => {
                        handleInputChange('audio', fileUrl);
                        if (response?.duration) {
                          handleInputChange('duration', response.duration);
                        }
                      }}
                      onError={(error:any) => {
                        setErrorMessage(`Audio upload failed: ${error?.message || "Error in upload"}`);
                        setSubmissionStatus('error');
                      }}
                      onSuccess={(fileUrl, response) => {
                        setErrorMessage('');
                        setSubmissionStatus(null);
                      }}
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Image className="w-4 h-4 text-purple-400" />
                      Cover Image
                    </label>
                    <ImageUploadComponent
                      value={editFormData.image}
                      onChange={(imageUrl) => {
                        handleInputChange('image', imageUrl);
                      }}
                      onError={(error) => {
                        setErrorMessage(`Image upload failed: ${error.message}`);
                        setSubmissionStatus('error');
                      }}
                      onSuccess={(imageUrl) => {
                        setErrorMessage('');
                        setSubmissionStatus(null);
                      }}
                      accept="image/jpeg,image/png,image/gif"
                      showPreview={true}
                      className="w-full"
                    />
                  </div>

                  {/* Lyrics File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      Lyrics File (Optional)
                    </label>
                    <input
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload('lyrics_file', e.target.files?.[0] || null)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  {/* Lyrics Text */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Lyrics (Text)</label>
                    <textarea
                      value={editFormData.lyrics || ''}
                      onChange={(e) => handleInputChange('lyrics', e.target.value)}
                      rows={8}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter your lyrics here..."
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Additional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Featured Artists</label>
                      <input
                        type="text"
                        value={editFormData.feature || ''}
                        onChange={(e) => handleInputChange('feature', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="e.g., feat. Artist Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Composer</label>
                      <input
                        type="text"
                        value={editFormData.compose || ''}
                        onChange={(e) => handleInputChange('compose', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="Who composed this track?"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Spotify URL</label>
                      <input
                        type="url"
                        value={editFormData.spotify_url || ''}
                        onChange={(e) => handleInputChange('spotify_url', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="https://open.spotify.com/track/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">iTunes URL</label>
                      <input
                        type="url"
                        value={editFormData.itunes_url || ''}
                        onChange={(e) => handleInputChange('itunes_url', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="https://music.apple.com/us/album/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium Mannytext-white mb-2">Video URL</label>
                      <input
                        type="url"
                        value={editFormData.video_url || ''}
                        onChange={(e) => handleInputChange('video_url', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editFormData.is_explicit || false}
                        onChange={(e) => handleInputChange('is_explicit', e.target.checked)}
                        className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-500 rounded focus:ring-purple-500 transition-all"
                      />
                      <span className="text-white flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Explicit Content
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editFormData.is_cover || false}
                        onChange={(e) => handleInputChange('is_cover', e.target.checked)}
                        className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-500 rounded focus:ring-purple-500 transition-all"
                      />
                      <span className="text-white text-sm">Cover Song</span>
                    </label>
                  </div>
                </div>

                {/* Artist Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Artist Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">First Name</label>
                      <input
                        type="text"
                        value={editFormData.first_name || ''}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Middle Name</label>
                      <input
                        type="text"
                        value={editFormData.middle_name || ''}
                        onChange={(e) => handleInputChange('middle_name', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                      <input
                        type="text"
                        value={editFormData.last_name || ''}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={editFormData.contact_phone || ''}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Biography</label>
                    <textarea
                      value={editFormData.biography || ''}
                      onChange={(e) => handleInputChange('biography', e.target.value)}
                      rows={4}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Collaboration Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Collaboration Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Track Type</label>
                    <select
                      value={editFormData.choice || 'solo'}
                      onChange={(e) => handleInputChange('choice', e.target.value as "solo" | "collaboration")}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="solo">Solo Track</option>
                      <option value="collaboration">Collaboration Track</option>
                    </select>
                  </div>

                  {editFormData.choice === 'collaboration' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-mediumartist_name text-white mb-2">Collaborator Full Name</label>
                        <input
                          type="text"
                          value={editFormData.someone_full_name || ''}
                          onChange={(e) => handleInputChange('someone_full_name', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Collaborator Email</label>
                        <input
                          type="email"
                          value={editFormData.someone_email || ''}
                          onChange={(e) => handleInputChange('someone_email', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Collaborator Name/Alias</label>
                        <input
                          type="text"
                          value={editFormData.someone_name || ''}
                          onChange={(e) => handleInputChange('someone_name', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Collaborator Phone</label>
                        <input
                          type="tel"
                          value={editFormData.someone_phone || ''}
                          onChange={(e) => handleInputChange('someone_phone', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    onClick={handleEditToggle}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitEditedTrack}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // View Mode
          <div className="space-y-8">
            {/* Track Header */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cover Image */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 shadow-2xl">
                  <img 
                    src={track.image || '/api/placeholder/320/320'} 
                    alt={track.track_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/320/320';
                    }}
                  />
                </div>
              </div>

              {/* Track Info */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-white mb-2">{track.track_name}</h1>
                  <p className="text-xl text-gray-300 mb-4">
                    by {track.artist_name || track.label}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {track.genre && (
                      <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                        {track.genre}
                      </span>
                    )}
                    {track.language && (
                      <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {track.language}
                      </span>
                    )}
                    {track.is_explicit && (
                      <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Explicit
                      </span>
                    )}
                    {track.is_cover && (
                      <span className="bg-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                        Cover
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{track.no_plays || '0'}</div>
                      <div className="text-sm text-gray-400">Plays</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{track.no_downloads || '0'}</div>
                      <div className="text-sm text-gray-400">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{track.duration || '--:--'}</div>
                      <div className="text-sm text-gray-400">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {track.created_at ? new Date(track.created_at).getFullYear() : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-400">Year</div>
                    </div>
                  </div>
                </div>

                {/* Audio Player */}
                {track.audio && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={handlePlay}
                        className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="text-white" size={24} />
                        ) : (
                          <Play className="text-white" size={24} />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-400 w-12">{formatTime(currentTime)}</span>
                          <div className="flex-1">
                            <input
                              type="range"
                              min="0"
                              max={duration || 100}
                              value={currentTime}
                              onChange={(e) => handleSeek(parseFloat(e.target.value))}
                              className="w-full accent-purple-500 h-2"
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-12">{formatTime(duration)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Volume2 className="text-gray-400" size={16} />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-20 accent-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Download size={18} />
                    Download
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Share size={18} />
                    Share
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Heart size={18} />
                    Like
                  </button>
                </div>
              </div>
            </div>

            {/* Track Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Info size={20} className="text-purple-400" />
                    Track Information
                  </h2>
                  <div className="space-y-3 text-gray-300">
                 
                    <div className="flex justify-between">
                      <span className="text-gray-400">Record Label:</span>
                      <span>{track?.label ||track?.record_label || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Country:</span>
                      <span>{track.country || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Featured Artists:</span>
                      <span>{track.feature || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Composer:</span>
                      <span>{track.compose || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="capitalize">{track.choice || 'Solo'}</span>
                    </div>
                  </div>
                </div>

                {/* Links */}
                {(track.spotify_url || track.itunes_url || track.video_url) && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Link size={20} className="text-purple-400" />
                      External Links
                    </h2>
                    <div className="space-y-3">
                      {track.spotify_url && (
                        <a
                          href={track.spotify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">S</span>
                          </div>
                          <span>Listen on Spotify</span>
                        </a>
                      )}
                      {track.itunes_url && (
                        <a
                          href={track.itunes_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-sm">♪</span>
                          </div>
                          <span>Listen on Apple Music</span>
                        </a>
                      )}
                      {track.video_url && (
                        <a
                          href={track.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-bold text-sm">▶</span>
                          </div>
                          <span>Watch Video</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                {track.description && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-purple-400" />
                      Description
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{track.description}</p>
                  </div>
                )}

                {/* Lyrics */}
                {track.lyrics && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Music size={20} className="text-purple-400" />
                      Lyrics
                    </h2>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {track.lyrics}
                    </div>
                  </div>
                )}

                {/* Artist Bio */}
                {track.biography && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <User size={20} className="text-purple-400" />
                      Artist Biography
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{track.biography}</p>
                  </div>
                )}

                {/* Collaboration Details */}
                {track.choice === 'collaboration' && track.someone_full_name && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Users size={20} className="text-purple-400" />
                      Collaboration Details
                    </h2>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Collaborator:</span>
                        <span>{track.someone_full_name}</span>
                      </div>
                      {track.someone_name && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Stage Name:</span>
                          <span>{track.someone_name}</span>
                        </div>
                      )}
                      {track.someone_email && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span>{track.someone_email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongDetailPage;