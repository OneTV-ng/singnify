"use client"
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Clock, Search } from 'lucide-react';

// Define the track interface
interface Track {
  id: string;
  track_name: string;
  label: string;
  image: string;
  audio: string;
  genre: string;
}

// Define the API response interface
interface MusicResponse {
  status: string;
  message: string;
  result: {
    'Recently Uploaded': Track[];
  };
}

// API service for fetching music data
const fetchMusicData = async (): Promise<MusicResponse> => {
  try {
    const formData = new FormData();
    formData.append('token', '29d56683b0e8211939ec45f6e17c26bfcee561db');
    formData.append('type', 'most recent');

    const response = await fetch('https://singnify.com/api/v2/php/discover.php?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data as MusicResponse;
  } catch (error) {
    console.error('Error fetching music data:', error);
    return { status: '400', message: 'error', result: { 'Recently Uploaded': [] } };
  }
};

// Format duration from "MM:SS" to seconds
const formatDurationToSeconds = (duration: string) => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return (minutes * 60) + seconds;
};

// Format seconds to "MM:SS"
const formatSecondsToTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' + sec : sec}`;
};

interface AudioPlayerProps {
  currentTrack: Track;
  onClose: () => void;
}

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
}

// Audio Player component
const AudioPlayer = ({ currentTrack, onClose }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (currentTrack) {
      // Reset state when track changes
      setCurrentTime(0);
      setIsPlaying(false);
      
      // Load new audio
      if (audioRef.current) {
        audioRef.current.src = currentTrack.audio;
        audioRef.current.load();
        
        // Auto play when ready
        audioRef.current.oncanplaythrough = () => {
          if (audioRef.current) {
            setIsPlaying(true);
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
          }
        };
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentTrack]);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  if (!currentTrack) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center w-1/4">
          <div className="w-14 h-14 relative overflow-hidden rounded-md mr-3">
            <Image 
              src={currentTrack.image} 
              alt={currentTrack.track_name}
              fill
              style={{ objectFit: "cover" }}
              placeholder="blur"
              blurDataURL="/api/placeholder/80/80"
            />
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-medium truncate">{currentTrack.track_name}</h4>
            <p className="text-xs text-gray-400">{currentTrack.label}</p>
          </div>
          <button className="ml-4 text-gray-400 hover:text-white">
            <Heart size={18} />
          </button>
        </div>
        
        {/* Player Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center mb-2">
            <button className="mx-2 text-gray-400 hover:text-white">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="mx-2 bg-white text-black rounded-full p-2 hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="mx-2 text-gray-400 hover:text-white">
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="flex items-center w-full">
            <span className="text-xs text-gray-400 mr-2">
              {formatSecondsToTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSliderChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-400 ml-2">
              {formatSecondsToTime(duration || 0)}
            </span>
          </div>
        </div>
        
        {/* Volume Control */}
        <div className="flex items-center w-1/4 justify-end">
          <Volume2 size={18} className="text-gray-400 mr-2" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <audio 
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};

// Track Card component
const TrackCard = ({ track, onPlay }: TrackCardProps) => {
  return (
    <div 
      className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-700 transition duration-300 cursor-pointer group"
      onClick={() => onPlay(track)}
    >
      <div className="relative w-full pb-[100%]">
        <Image 
          src={track.image} 
          alt={track.track_name}
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="/api/placeholder/120/120"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button className="bg-green-500 rounded-full p-3 text-white transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
            <Play size={24} fill="white" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate mb-1">{track.track_name}</h3>
        <p className="text-sm text-gray-400 truncate">{track.label}</p>
      </div>
    </div>
  );
};

// Page component
export default function Home() {
  const [musicData, setMusicData] = useState<MusicResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [genreFilter, setGenreFilter] = useState('All');
  
  // Fetch music data on component mount
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchMusicData();
        setMusicData(data);
      } catch (err) {
        setError('Failed to fetch music data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    getData();
  }, []);
  
  // Extract all unique genres
  const genres = musicData?.result?.['Recently Uploaded']
    ? ['All', ...new Set(musicData.result['Recently Uploaded'].map(track => track.genre))]
    : ['All'];
  
  // Filter tracks by genre
  const filteredTracks = musicData?.result?.['Recently Uploaded']
    ? genreFilter === 'All'
      ? musicData.result['Recently Uploaded']
      : musicData.result['Recently Uploaded'].filter(track => track.genre === genreFilter)
    : [];
  
  // Handle track play
  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Head>
        <title>Singnify - Music Streaming</title>
        <meta name="description" content="Discover and stream music from Singnify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black h-screen fixed left-0 top-0 p-6 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Singnify</h1>
          </div>
          
          <nav className="mb-6">
            <ul>
              <li className="mb-2">
                <a href="#" className="flex items-center text-white hover:text-green-500 font-medium">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33z" />
                  </svg>
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center text-gray-400 hover:text-white">
                  <Search className="w-6 h-6 mr-3" />
                  Search
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-white">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3zm5-10v2h8v-2H8z" />
                  </svg>
                  Your Library
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="mt-4">
            <h2 className="text-sm uppercase font-bold text-gray-400 mb-4">Playlists</h2>
            <ul>
              <li className="mb-3">
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Create Playlist
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Liked Songs
                </a>
              </li>
            </ul>
          </div>
          
          <div className="mt-auto pt-4 border-t border-zinc-800">
            <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              Your Account
            </a>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="ml-64 w-[calc(100%-16rem)] p-8 pb-28">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex gap-4">
              <button className="bg-black bg-opacity-40 rounded-full p-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                  <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
                </svg>
              </button>
              <button className="bg-black bg-opacity-40 rounded-full p-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                  <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center">
              <button className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium hover:scale-105 transition mr-4">
                Sign Up
              </button>
              <button className="bg-white text-black px-8 py-2 rounded-full font-medium hover:scale-105 transition">
                Log In
              </button>
            </div>
          </header>
          
          {/* Hero Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Welcome to Singnify</h1>
            <p className="text-gray-300">Discover new music from around the world</p>
          </section>
          
          {/* Filter Section */}
          <section className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-4">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setGenreFilter(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap 
                    ${genreFilter === genre 
                      ? 'bg-green-500 text-white' 
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </section>
          
          {/* Music Grid */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Recently Uploaded</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900 text-white p-4 rounded-md">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredTracks.map(track => (
                  <TrackCard 
                    key={track.id} 
                    track={track} 
                    onPlay={handlePlayTrack} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      
      {/* Player */}
      {currentTrack && (
        <AudioPlayer 
          currentTrack={currentTrack} 
          onClose={() => setCurrentTrack(null)} 
        />
      )}
    </div>
  );
}