'use client';
import { useState, useEffect } from 'react';
import { usePlayer } from '@/app/context/PlayerContext';
//import { useTheme } from '@/app/context/ThemeContext';
//import { useAuth } from '@/app/context/AuthContext';
import { Track, PlayerActionType } from '@/app/lib/types';
import { trackService, sampleTracks } from '@/app/lib/api';
import { 
  Play, 
  Pause, 
  Heart,
  Plus,
  Share2,
  Music,
  Filter,
  Clock
} from 'lucide-react';
import { MusicCard } from './MusicCard';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from "next-auth/react";

import { UserType } from '@/app/lib/types';

const genres = [
  'All', 'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 
  'Classical', 'R&B', 'Country'
];

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Alphabetical', value: 'alpha' },
];

export default function DiscoverPage() {


 // import { useSession } from "next-auth/react";

    const { data: session } = useSession()
   // const { user } = useAuth();
     const user:UserType|undefined = session?.user;
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const { state, dispatch } = usePlayer();
  //const { theme } = useTheme();
  //const { user } = useAuth();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // In development, use sample data
         const data = await trackService.getAllTracks();
         console.log('data:', data);    
        setTracks(data);
        dispatch({ type: 'LOAD_PLAYLIST', payload: data });

      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();


  }, []);

  const playTrack = (track: Track) => {
    if (state.currentTrack?.id === track.id) {
      dispatch({ type: 'TOGGLE_PLAY' });
    } else {
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'PLAY' });
      trackService.updatePlayCount(track.id);
    }
  };

  const addToQueue = (track: Track) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: track });
  };

  const toggleLike = async (trackId:any) => {
    if (!user) return;
    try {
      await trackService.toggleLike(trackId);
      // Update local state
      setTracks(tracks.map(track => 
        track.id === Number(trackId) 
          ? { ...track, isLiked: !track.isLiked }
          : track
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const filteredTracks = tracks
  .filter(track => 
    (selectedGenre === 'all' || track.genre.toLowerCase() === selectedGenre) &&
    (searchQuery === '' || 
      track?.track_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track?.artist?.name && track.artist.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  )
  .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.plays - a.plays;
        case 'recent':
          return new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime();
          case 'alpha':
          return a.track_name.localeCompare(b.track_name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover</h1>
        <p className="text-secondary">Find your next favorite track</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search tracks or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
          <Music className="absolute left-3 top-3 h-5 w-5 text-secondary" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Sort By
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Genre Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre.toLowerCase())}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedGenre === genre.toLowerCase()
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/10 hover:bg-secondary/20'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Track Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTracks.map((track) => (
       
       <MusicCard
       key={track.id}
       track={track}
       isPlaying={state.currentTrack?.id === track.id && state.isPlaying}
       onPlay={playTrack}
       onAddToQueue={addToQueue}
       onToggleLike={toggleLike}
     />
        ))}
      </div>
    </div>
  );
}