"use client";
import React, { useState, useRef, useEffect } from 'react';

import { Play, Heart, Share2, ChevronLeft, ChevronRight, Pause, Volume2, VolumeX, Search, Menu, User, Home, TrendingUp, Music, Video, List, Loader2 } from 'lucide-react';
import { usePlayer } from '@/app/context/PlayerContext';
import { Track, PlayerActionType } from '@/app/lib/types';
import { fetchDiscoveryCachedActionNoToken } from '@/services/singnifyApi.actions';

/**
 * Convert API track data to Track format for player
 */
const convertToTracks = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(item => ({
    id: item.id,
    track_name: item.track_name,
    artist: {
      id: item.id,
      name: item.label || item.artist_name || 'Unknown Artist',
    },
    url: item.audio,
    genre: item.genre || '',
    duration: item.duration || '0:00',
    image: item.image || item.thumb_image || '/default-album.png',
    plays: item.no_plays || 0,
    releaseDate: '',
    isLiked: false,
    label: item.label || '',
    audio: item.audio,
  }));
};

/**
 * Transform API track to track object
 */
const onToTrack = (item) => {
  if (!item) return null;
  return {
    ...item,
    id: item.id,
    track_name: item.track_name,
    artist: {
      id: item.id,
      name: item.label || item.artist_name || 'Unknown Artist',
    },
    url: item.audio,
    genre: item.genre || '',
    duration: item.duration || '0:00',
    image: item.image || item.thumb_image || '/default-album.png',
    plays: item.no_plays || 0,
    releaseDate: '',
    isLiked: false,
    label: item.label || '',
    audio: item.audio,
  };
};



const MusicApp = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const { state, dispatch } = usePlayer();
  const [playload, setPlayload] = useState([]);
  const [newData, setNewData] = useState([]);
  const [n2Data, setN2Data] = useState([]);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch fresh discover data from server on component mount
  useEffect(() => {
    const loadDiscoverData = async () => {
      try {
        setLoading(true);
        console.log('📡 Loading discover data from server...');

        // Fetch fresh discover data with caching
        const discoverData = await fetchDiscoveryCachedActionNoToken();

        console.log('✅ Discover data received:', discoverData);

        // Extract featured picks (introductions)
        const featuredPicks = Array.isArray(discoverData?.introductions) ? discoverData.introductions : [];

        // Extract trending tracks from result.1 (or first category)
        const trendingTracks = discoverData?.result ?
          Object.values(discoverData.result).flat().slice(0, 20) : [];

        setNewData(featuredPicks.slice(0, 10)); // Featured picks
        setN2Data(trendingTracks); // Trending/featured tracks

        console.log('✅ Discover data initialized:', {
          featuredPicks: featuredPicks.length,
          trendingTracks: trendingTracks.length
        });
      } catch (error) {
        console.error('❌ Error loading discover data:', error);
        // Set to empty arrays on error
        setNewData([]);
        setN2Data([]);
      } finally {
        setLoading(false);
      }
    };

    loadDiscoverData();
  }, []);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // In development, use sample data
      //   const data = await trackService.getAllTracks();
     console.log('data:',playload);   
     
     if (tracks!==playload){


        setTracks(playload);

     
        dispatch({ type: 'LOAD_PLAYLIST', payload: convertToTracks(tracks)});

}
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchTracks();


  }, [playload]);

  const playTrack = (ntrack) => {
    const track =onToTrack (ntrack);

    console.log(track);
    if (state.currentTrack?.id === track.id) {
      dispatch({ type: 'TOGGLE_PLAY' });
    } else {
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'PLAY' });
     // trackService.updatePlayCount(track.id);
    }
  };


  const addToQueue = (track) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: track });
  };

  const toggleLike = async (trackId) => {
    if (!user) return;
    try {
   //   await trackService.toggleLike(trackId);
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

  // Mock data for different categories
const platformColors = {
  '7 Digital': 'from-blue-500 to-indigo-600',
  'All Digital Platforms': 'from-gray-700 to-gray-900',
  'Amazon Music': 'from-orange-400 to-yellow-500',
  'Boomplay': 'from-green-500 to-teal-600',
  'Deezer': 'from-pink-500 to-purple-600',
  'Fizy': 'from-red-600 to-pink-700',
  'Google Music': 'from-red-500 to-blue-500',
  'ITunes': 'from-gray-500 to-gray-700',
  'Mixcloud': 'from-purple-500 to-indigo-700',
  'Napster': 'from-green-600 to-lime-700',
  'Shazam': 'from-cyan-500 to-blue-600',
  'Singnify': 'from-rose-500 to-purple-500',
  'Slacker': 'from-orange-500 to-amber-600',
  'TIDAL': 'from-blue-700 to-gray-800',
  'YouTube': 'from-red-600 to-red-800'
};

const platform_keys = [
  '7 Digital',
  'All Digital Platforms',
  'Amazon Music',
  'Boomplay',
  'Deezer',
  'Fizy',
  'Google Music',
  'ITunes',
  'Mixcloud',
  'Napster',
  'Shazam',
  'Singnify',
  'Slacker',
  'TIDAL',
  'YouTube'
];

// console.log

// These are initialized inside the MusicApp component to avoid build-time errors
// const masterTSong =[];
// const newPlatforms = ...

// console.log("we have songs of ====>.",masterTSong.length);

// --- Color Key Map ---

// These are initialized inside the MusicApp component to avoid build-time errors
//  const categories = [
//     {
//       title: "Trending Now",
//       color: "from-purple-600 to-pink-600",
//       items: newData
//     }]
//     ;




  const PlatformSlider = ({ category }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
      const container = scrollRef.current;
      const scrollAmount = 300;
      if (container) {
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="mb-8 ">
        <div className="flex items-center justify-between mb-0">
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
            {category.title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-2 h-2 text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-2 h-2 text-white" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {category.items.map((item) => (


<div  key={item.id}
           className="flex-shrink-0 w-44 h-24 bg-gray-900 rounded-lg overflow-hidden shadow-lg flex transition-all duration-300 hover:bg-gray-800">
        <div className="w-24 h-24 flex-shrink-0 relative">
          <img src={item.image} alt={item.track_name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
                  onClick={() => {
               setPlayload(category.items);
               setLoading(true);
setTimeout(() => {
  playTrack(item);
}, 1000);
                      
                   // setCurrentTrack(item);
                  //  setIsPlaying(!isPlaying);
                  }}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${currentTrack?.id === item.id && isPlaying ? 'opacity-100' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </button>
          </div>
        </div>
        <div className="p-2 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-bold text-white text-xs truncate">{item.track_name}</h3>
            <p className="text-gray-400 text-xs truncate">{item.label}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">{item.duration}</span>
            <Heart size={12} className="text-gray-400 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>


          ))}
        </div>
      </div>
    );
  };








  const Z0PlatformSlider = ({ category }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
      const container = scrollRef.current;
      const scrollAmount = 300;
      if (container) {
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="mb-8"  onClick={()=>{ setPlayload(category.items)}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
            {category.title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {category.items.map((item) => (


<div  key={item.id}
           className="flex-shrink-0 w-44 h-24 bg-gray-900 rounded-lg overflow-hidden shadow-lg flex transition-all duration-300 hover:bg-gray-800">
        <div className="w-24 h-24 flex-shrink-0 relative">
          <img src={item.image} alt={item.track_name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
                  onClick={() => {
                    setCurrentTrack(item);
                    setIsPlaying(!isPlaying);
                  }}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${currentTrack?.id === item.id && isPlaying ? 'opacity-100' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </button>
          </div>
        </div>
        <div className="p-2 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-bold text-white text-xs truncate">{item.track_name}</h3>
            <p className="text-gray-400 text-xs truncate">{item.label}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">{item.duration}</span>
            <Heart size={12} className="text-gray-400 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>


          ))}
        </div>
      </div>
    );
  };

  const Z1PlatformSlider = ({ category }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-4"> {/* reduced bottom margin */}
      <div className="flex items-center justify-between mb-2"> {/* tighter gap */}
        <h2 className={`text-xl font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
          {category.title}
        </h2>
        <div className="flex gap-1"> {/* tighter button gap */}
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2" // reduced horizontal gap and bottom padding
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {category.items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-40 h-24 bg-gray-900 rounded-md overflow-hidden shadow-md flex hover:bg-gray-800 transition-all duration-300"
          >
            <div className="w-20 h-24 flex-shrink-0 relative"> {/* tighter image column */}
              <img src={item.image} alt={item.track_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => {
                    setCurrentTrack(item);
                    setIsPlaying(!isPlaying);
                  }}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${currentTrack?.id === item.id && isPlaying ? 'opacity-100' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <Play className="w-5 h-5 text-white" />
                  </div>
                </button>
              </div>
            </div>
            <div className="p-1.5 flex flex-col justify-between flex-grow"> {/* reduced padding */}
              <div>
                <h3 className="font-bold text-white text-xs truncate">{item.track_name}</h3>
                <p className="text-gray-400 text-xs truncate">{item.label}</p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-500 text-xs">{item.duration}</span>
                <Heart size={12} className="text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Z3PlatformSlider = ({ category }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-3"> {/* tighter bottom margin */}
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
          {category.title}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {category.items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-40 h-16 bg-gray-900 rounded-md overflow-hidden shadow-md flex transition-all duration-300 hover:bg-gray-800"
          >
            <div className="w-16 h-16 flex-shrink-0 relative">
              <img src={item.image} alt={item.track_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => {
                    setCurrentTrack(item);
                    setIsPlaying(!isPlaying);
                  }}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${currentTrack?.id === item.id && isPlaying ? 'opacity-100' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <Play className="w-4 h-4 text-white ml-0.5" />
                    bg-background text-color  </div>
                </button>
              </div>
            </div>
            <div className="p-1 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="font-bold text-white text-[10px] truncate">{item.track_name}</h3>
                <p className="text-gray-400 text-[10px] truncate">{item.label}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px]">{item.duration}</span>
                <Heart size={10} className="text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



  //console.log( categories);
  const CategorySlider = ({ category }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
      const container = scrollRef.current;
      const scrollAmount = 300;
      if (container) {
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
            {category.title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {category.items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-64 bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors group cursor-pointer"
            >
              <div className="relative mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setCurrentTrack(item);
                    setIsPlaying(!isPlaying);
                  }}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${currentTrack?.id === item.id && isPlaying ? 'opacity-100' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </button>
              </div>
              
              <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{item.artist}</p>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${category.color} text-white hover:opacity-90 transition-opacity`}>
                  Listen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-color">
 

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 z-34 flex items-center">
         <BackgroundVideo 
  src="/src/singnify.mp4" 
  poster="/src/intro.jpg" 
  overlay={true}
  overlayOpacity={0.4}
  overlayColor={'black'}  
  showControls={true}
  autoPlay={true}
  muted={true}
  className="absolute inset-0 w-full h-full object-cover">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-1">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Be Discovered, Globaly!
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            Get Explored by millions, be discovered, and create your perfect Promo. 
            Your music journey starts here.
          </p>
          
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:opacity-90 transition-opacity">
            Start Listening
          </button>
        </div>
        </BackgroundVideo>
     
      </section>


      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-16 bg-black bg-opacity-90 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 py-4 overflow-x-auto">
            {['Home', 'Trending', 'New Releases', 'Charts', 'Genres', 'Artists', 'Playlists', 'Videos'].map((item) => (
              <button
                key={item}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                {item === 'Home' && <Home className="w-4 h-4" />}
                {item === 'Trending' && <TrendingUp className="w-4 h-4" />}
                {item === 'Videos' && <Video className="w-4 h-4" />}
                {item === 'Playlists' && <List className="w-4 h-4" />}
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 py-2">
        {/* Categories and platform sliders disabled - commented out to fix build
        {categories.map((category, index) => (
          <CategorySlider key={index} category={category} />
        ))}

        {newPlatforms.map((category, index) => (
          <PlatformSlider key={"a2"+index} category={category} />
        ))}
        */}
        <div className="text-center py-12 text-gray-400">
          <p>Home page content initialization in progress...</p>
        </div>
      </main>



      {/* Current Playing Track */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={currentTrack.image}
                alt={currentTrack.track_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="text-white font-medium">{currentTrack.track_name}</h4>
                <p className="text-gray-400 text-sm">{currentTrack.label}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Play className="w-5 h-5 text-black ml-1" />
              </button>
              <button className="text-gray-400 hover:text-blue-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
const BackgroundVideo = ({ 
  src, 
  youtubeId, 
  poster,
  overlay = true,
  overlayOpacity = 0.4,
  overlayColor = 'black',
  showControls = false,
  autoPlay = true,
  muted = true,
  className = '',
  children 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && autoPlay) {
      video.play().catch(console.error);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : url;
  };

  const getYouTubeEmbedUrl = (id) => {
    const videoId = extractYouTubeId(id);
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
  };

  return (
    <div className={`relative w-full h-full bg-background text-color overflow-hidden ${className}`}>
      {/* Video Element */}
      {youtubeId ? (
        <iframe
          src={getYouTubeEmbedUrl(youtubeId)}
          className="absolute top-0 left-0 w-full h-full object-cover scale-150 -translate-y-12"
          style={{ minWidth: '100%', minHeight: '100%' }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop
          playsInline
          poster={poster}
          onLoadedData={() => setIsLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 z-10"
          style={{ 
            backgroundColor: overlayColor,
            opacity: overlayOpacity 
          }}
        />
      )}

      {/* Controls */}
      {showControls && !youtubeId && (
        <div className="absolute bottom-4 right-4 z-30 flex space-x-2">
          <button
            onClick={togglePlay}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all duration-200"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-1" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all duration-200"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-18 h-full flex items-center justify-center">
        {children}
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900"  style={{ backgroundImage: "url('/src/intro.jpg')" }}>
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
export default MusicApp;