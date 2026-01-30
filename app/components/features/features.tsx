import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Music, User, ListMusic } from 'lucide-react';

// Type definitions
interface Artist {
  id: number;
  name: string;
  imageUrl: string;
  followers: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  duration: string;
}

interface TrendingSong extends Song {
  trend: 'up' | 'down' | 'same';
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  songCount: number;
}

interface SliderWrapperProps {
  title: string;
  children: React.ReactNode;
  itemCount: number;
}

interface ArtistCardProps {
  artist: Artist;
}

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  onPlayToggle: (id: number) => void;
}

interface TrendingSongCardProps {
  song: TrendingSong;
}

interface PlaylistCardProps {
  playlist: Playlist;
}

// Sample data for each content type
const sampleArtists: Artist[] = [
  { id: 1, name: 'Taylor Swift', imageUrl: '/api/placeholder/200/200', followers: '82M' },
  { id: 2, name: 'The Weeknd', imageUrl: '/api/placeholder/200/200', followers: '76M' },
  { id: 3, name: 'Drake', imageUrl: '/api/placeholder/200/200', followers: '72M' },
  { id: 4, name: 'Bad Bunny', imageUrl: '/api/placeholder/200/200', followers: '68M' },
  { id: 5, name: 'Billie Eilish', imageUrl: '/api/placeholder/200/200', followers: '64M' },
  { id: 6, name: 'Ariana Grande', imageUrl: '/api/placeholder/200/200', followers: '62M' },
  { id: 7, name: 'Dua Lipa', imageUrl: '/api/placeholder/200/200', followers: '58M' },
  { id: 8, name: 'Post Malone', imageUrl: '/api/placeholder/200/200', followers: '56M' },
];

const sampleSongs: Song[] = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', imageUrl: '/api/placeholder/200/200', duration: '3:20' },
  { id: 2, title: 'Dance The Night', artist: 'Dua Lipa', imageUrl: '/api/placeholder/200/200', duration: '3:15' },
  { id: 3, title: 'Cruel Summer', artist: 'Taylor Swift', imageUrl: '/api/placeholder/200/200', duration: '2:58' },
  { id: 4, title: 'Flowers', artist: 'Miley Cyrus', imageUrl: '/api/placeholder/200/200', duration: '3:21' },
  { id: 5, title: 'As It Was', artist: 'Harry Styles', imageUrl: '/api/placeholder/200/200', duration: '2:47' },
  { id: 6, title: 'Die For You', artist: 'The Weeknd', imageUrl: '/api/placeholder/200/200', duration: '4:20' },
  { id: 7, title: 'Heat Waves', artist: 'Glass Animals', imageUrl: '/api/placeholder/200/200', duration: '3:59' },
  { id: 8, title: 'STAY', artist: 'The Kid LAROI, Justin Bieber', imageUrl: '/api/placeholder/200/200', duration: '2:21' },
];

const sampleTrendingSongs: TrendingSong[] = [
  { id: 1, title: 'Paint The Town Red', artist: 'Doja Cat', imageUrl: '/api/placeholder/200/200', duration: '3:50', trend: 'up' },
  { id: 2, title: 'Fortnight', artist: 'Taylor Swift', imageUrl: '/api/placeholder/200/200', duration: '4:15', trend: 'up' },
  { id: 3, title: 'Espresso', artist: 'Sabrina Carpenter', imageUrl: '/api/placeholder/200/200', duration: '3:20', trend: 'up' },
  { id: 4, title: 'Snooze', artist: 'SZA', imageUrl: '/api/placeholder/200/200', duration: '3:22', trend: 'down' },
  { id: 5, title: 'Late Night Talking', artist: 'Harry Styles', imageUrl: '/api/placeholder/200/200', duration: '3:08', trend: 'up' },
  { id: 6, title: 'Shivers', artist: 'Ed Sheeran', imageUrl: '/api/placeholder/200/200', duration: '3:27', trend: 'down' },
  { id: 7, title: 'Vampire', artist: 'Olivia Rodrigo', imageUrl: '/api/placeholder/200/200', duration: '3:40', trend: 'up' },
  { id: 8, title: 'Levitating', artist: 'Dua Lipa', imageUrl: '/api/placeholder/200/200', duration: '3:23', trend: 'same' },
];

const samplePlaylists: Playlist[] = [
  { id: 1, name: 'Today\'s Top Hits', description: 'The biggest hits right now', imageUrl: '/api/placeholder/200/200', songCount: 50 },
  { id: 2, name: 'Chill Vibes', description: 'Relaxing beats to unwind', imageUrl: '/api/placeholder/200/200', songCount: 45 },
  { id: 3, name: 'Workout Motivation', description: 'Energy boosting tracks', imageUrl: '/api/placeholder/200/200', songCount: 60 },
  { id: 4, name: 'Road Trip Classics', description: 'Perfect for long drives', imageUrl: '/api/placeholder/200/200', songCount: 38 },
  { id: 5, name: 'Focus Flow', description: 'Concentration enhancing music', imageUrl: '/api/placeholder/200/200', songCount: 42 },
  { id: 6, name: 'Throwback Thursday', description: 'Hits from the past decades', imageUrl: '/api/placeholder/200/200', songCount: 55 },
  { id: 7, name: 'Indie Discoveries', description: 'Fresh indie music', imageUrl: '/api/placeholder/200/200', songCount: 30 },
  { id: 8, name: 'Sleep Sounds', description: 'Calm tracks to help you sleep', imageUrl: '/api/placeholder/200/200', songCount: 25 },
];

// Slider wrapper component to handle navigation and scrolling
const SliderWrapper: React.FC<SliderWrapperProps> = ({ title, children, itemCount }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const scroll = (direction: 'left' | 'right'): void => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (): void => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <div className="flex space-x-1">
          <button 
            onClick={() => scroll('left')} 
            className={`p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition ${!showLeftArrow ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!showLeftArrow}
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className={`p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition ${!showRightArrow ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!showRightArrow}
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>
      <div 
        ref={sliderRef} 
        className="flex overflow-x-auto scrollbar-hide pb-2 gap-2" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </div>
  );
};

// Individual content type components
const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <div className="flex-shrink-0 w-20 md:w-24 group cursor-pointer">
      <div className="relative">
        <div className="w-full aspect-square rounded-full overflow-hidden bg-gray-800">
          <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-green-500 rounded-full p-1 shadow-lg">
            <Play size={12} className="text-black" />
          </button>
        </div>
      </div>
      <div className="mt-1 text-center">
        <h3 className="font-semibold text-white text-xs truncate">{artist.name}</h3>
        <p className="text-xs text-gray-400">Artist • {artist.followers}</p>
      </div>
    </div>
  );
};

const SongCard: React.FC<SongCardProps> = ({ song, isPlaying, onPlayToggle }) => {
  const [hover, setHover] = useState<boolean>(false);
  
  return (
    <div 
      className="flex-shrink-0 w-24 md:w-28 bg-gray-800 rounded-md p-2 cursor-pointer group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative">
        <img src={song.imageUrl} alt={song.title} className="w-full aspect-square rounded-md" />
        <div className={`absolute bottom-1 right-1 ${hover ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <button 
            className="bg-green-500 rounded-full p-1 shadow-lg"
            onClick={() => onPlayToggle(song.id)}
          >
            {isPlaying ? <Pause size={12} className="text-black" /> : <Play size={12} className="text-black" />}
          </button>
        </div>
      </div>
      <div className="mt-1">
        <h3 className="font-semibold text-white text-xs truncate">{song.title}</h3>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>
    </div>
  );
};

const TrendingSongCard: React.FC<TrendingSongCardProps> = ({ song }) => {
  const [hover, setHover] = useState<boolean>(false);
  
  return (
    <div 
      className="flex-shrink-0 w-full md:w-36 bg-gray-800 rounded-md overflow-hidden flex items-center cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img src={song.imageUrl} alt={song.title} className="w-8 h-8 object-cover" />
      <div className="flex-1 p-1">
        <h3 className="font-semibold text-white text-xs truncate">{song.title}</h3>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>
      <div className="pr-1">
        <div className={`${hover ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <button className="bg-green-500 rounded-full p-1 shadow-lg">
            <Play size={8} className="text-black" />
          </button>
        </div>
        <div className={`${!hover ? 'opacity-100' : 'opacity-0'} transition-opacity text-xs font-medium ${
          song.trend === 'up' ? 'text-green-500' : song.trend === 'down' ? 'text-red-500' : 'text-gray-400'
        }`}>
          {song.trend === 'up' ? '↑' : song.trend === 'down' ? '↓' : '•'}
        </div>
      </div>
    </div>
  );
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <div className="flex-shrink-0 w-24 md:w-28 bg-gray-800 rounded-md p-2 cursor-pointer group">
      <div className="relative">
        <img src={playlist.imageUrl} alt={playlist.name} className="w-full aspect-square rounded-md shadow-md" />
        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-green-500 rounded-full p-1 shadow-lg">
            <Play size={12} className="text-black" />
          </button>
        </div>
      </div>
      <div className="mt-1">
        <h3 className="font-semibold text-white text-xs truncate">{playlist.name}</h3>
        <p className="text-xs text-gray-400 truncate">{playlist.description}</p>
        <p className="text-xs text-gray-500">{playlist.songCount} songs</p>
      </div>
    </div>
  );
};

const SpotifySliders: React.FC = () => {
  const [playingSong, setPlayingSong] = useState<number | null>(null);
  
  const handlePlayToggle = (id: number): void => {
    setPlayingSong(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-black py-4 px-2 md:px-4">
      <h1 className="text-xl font-bold text-white mb-4">Your Music</h1>

      {/* Artists Slider */}
      <SliderWrapper title="Top Artists" itemCount={sampleArtists.length}>
        {sampleArtists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </SliderWrapper>

      {/* Songs Slider */}
      <SliderWrapper title="Recommended Songs" itemCount={sampleSongs.length}>
        {sampleSongs.map(song => (
          <SongCard 
            key={song.id} 
            song={song} 
            isPlaying={playingSong === song.id}
            onPlayToggle={handlePlayToggle}
          />
        ))}
      </SliderWrapper>

      {/* Trending Songs Slider */}
      <SliderWrapper title="Trending Now" itemCount={sampleTrendingSongs.length}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full">
          {sampleTrendingSongs.map(song => (
            <TrendingSongCard key={song.id} song={song} />
          ))}
        </div>
      </SliderWrapper>

      {/* Playlists Slider */}
      <SliderWrapper title="Featured Playlists" itemCount={samplePlaylists.length}>
        {samplePlaylists.map(playlist => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </SliderWrapper>
    </div>
  );
};

export default SpotifySliders;