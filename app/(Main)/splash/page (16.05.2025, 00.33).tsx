"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Clock, User, Music } from 'lucide-react';
import {Track} from "@/app/lib/types";
import {getBigData} from "@/app/lib/bigData";


//interface NTrack extends Track {
type NTrack ={
  f_id?: string;
  function?: string;
  type:string;
  f_table?: string;
  active?: string;
  col?: string;
  f_order?: string;
  f_chart?: string;
  name?:string;
  track_name?: string;
  label?: string;
  genre?: string;
  language?: string;
  image: string;
  audio?: string;
  time_number?: string;
  duration?: string;
  country: string;
  choice?: string;
  base?: string;
  chart?: string;
  user_id?: string;
  id?: string;
  music_id?: string;
  no_plays?: string;
  no_downloads?: string;
  is_ran?: string;
  f_time_number?: string;
  date_created?: string;
  data_id?: string;
  actor?: string;
};


type MusicTrack = {
  f_id: string;
  function: string;
  f_table: string;
  active: string;
  col: string;
  f_order: string;
  f_chart: string;
  track_name: string;
  label: string;
  genre: string;
  language: string;
  image: string;
  audio: string;
  time_number: string;
  duration: string;
  country: string;
  choice: string;
  base: string;
  chart: string;
  user_id: string;
  id: string;
  music_id: string;
  no_plays: string;
  no_downloads: string;
  is_ran: string;
  f_time_number: string;
  date_created: string;
  data_id: string;
  actor: string;
};



export default function MusicCards() {
  // Parse the data from the uploaded file
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('trending');
  
  useEffect(() => {
    // Simulate data loading
    const parseData = async () => {
      try {
        setIsLoading(true);
        
        // This would normally come from an API or the file system
       // const rawData = window.fs.readFile('paste.txt', { encoding: 'utf8' });

const data :NTrack[]= await getBigData('result.2');
        // Shuffle the data
        const shuffledData = [...data].sort(() => Math.random() - 0.5);
        setTracks(shuffledData);
        
        // Extract unique artists
        const uniqueArtists = Array.from(new Set(data.map(item => item.label)))
          .map(label => {
            const artistTrack = data.find(track => track.label === label);
            return {
              name: label,
              image: artistTrack?.image||"",
              country: artistTrack?.country||"",
              trackCount: data.filter(track => track.label === label).length
            };
          });
        
        setArtists(uniqueArtists.sort(() => Math.random() - 0.5).slice(0, 6));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading music data:", error);
        setIsLoading(false);
      }
    };
    
    parseData();
  }, []);
  
  // Card design variants
  const cardDesigns = {
    design1: (track:NTrack, index:any) => (
      <div key={`design1-${track.data_id}`} 
           className="flex-shrink-0 w-64 bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-xl">
        <div className="relative">
          <img src={track.image || "/api/placeholder/200/200"} alt={track.track_name} className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 right-0 m-2">
            <button className="bg-green-500 hover:bg-green-600 rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-110">
              <Play size={20} className="text-white" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-white truncate">{track.track_name}</h3>
          <p className="text-gray-400 text-sm truncate">{track.label}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500 text-xs">{track.duration}</span>
            <span className="text-gray-500 text-xs">{track.genre}</span>
          </div>
        </div>
      </div>
    ),
    
    design2: (track:Track, index:any) => (
      <div key={`design2-${track.id}`}
           className="flex-shrink-0 w-64 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="p-4 pb-0">
          <h3 className="font-bold text-white truncate">{track.track_name}</h3>
          <p className="text-gray-400 text-sm truncate">{track.label}</p>
        </div>
        <div className="p-4 pt-2">
          <div className="relative overflow-hidden rounded-lg">
            <img src={track.image || "/api/placeholder/200/200"} alt={track.track_name} className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110" />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="bg-green-500 hover:bg-green-600 rounded-full p-3 transform translate-y-8 hover:translate-y-0 transition-transform duration-300">
                <Play size={20} className="text-white" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              <Heart size={16} className="text-gray-400 hover:text-red-500 cursor-pointer" />
              <span className="ml-2 text-gray-500 text-xs">{track.duration}</span>
            </div>
            <span className="text-gray-500 text-sm px-2 py-1 rounded-full bg-gray-800">{track.genre}</span>
          </div>
        </div>
      </div>
    ),
    
    design3: (track:NTrack, index:any) => (
      <div key={`design3-${track.id}`}
           className="flex-shrink-0 w-64 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 transition-all duration-300 hover:bg-gray-800 hover:border-gray-700">
        <div className="flex p-3">
          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
            <img src={track.image || "/api/placeholder/200/200"} alt={track.track_name} className="w-full h-full object-cover" />
          </div>
          <div className="ml-3 flex-grow">
            <h3 className="font-bold text-white text-sm truncate">{track.track_name}</h3>
            <p className="text-gray-400 text-xs truncate">{track.label}</p>
            <div className="flex items-center mt-1">
              <span className="text-gray-500 text-xs mr-2">{track.duration}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">{track.genre}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <img src={track.image || "/api/placeholder/200/200"} alt={track.track_name} className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-end">
            <button className="m-3 bg-green-500 hover:bg-green-600 rounded-full p-2 shadow-lg transition-transform duration-200 hover:scale-110">
              <Play size={18} className="text-white" />
            </button>
          </div>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-400 text-xs">{track.country}</span>
            </div>
            <span className="text-gray-500 text-xs">{track.language?.split(' - ')[0]}</span>
          </div>
        </div>
      </div>
    ),
    
    design4: (track:Track, index:any) => (
      <div key={`design4-${track.id}`}
           className="flex-shrink-0 w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 opacity-50"></div>
          <img src={track.image || "/api/placeholder/200/200"} alt={track.track_name} className="w-full h-56 object-cover" />
          <div className="absolute top-2 right-2">
            <Heart size={18} className="text-gray-200 hover:text-red-500 cursor-pointer" />
          </div>
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent">
            <h3 className="font-bold text-white truncate">{track.track_name}</h3>
            <p className="text-gray-300 text-sm truncate">{track.label}</p>
          </div>
        </div>
        <div className="p-3 flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={14} className="text-gray-500" />
            <span className="ml-1 text-gray-400 text-xs">{track.duration}</span>
          </div>
          <button className="bg-green-500 hover:bg-green-600 rounded-full p-2 transition-transform duration-200 hover:scale-110">
            <Play size={16} className="text-white" />
          </button>
        </div>
      </div>
    ),
    
    artist1: (artist:NTrack, index:any) => (
      <div key={`artist1-${index}`}
           className="flex-shrink-0 w-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
          <img src={artist.image || "/api/placeholder/200/200"} alt={artist.name} className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-bold text-white text-xl">{artist.name}</h3>
            <p className="text-gray-300 text-sm">Artist • {artist.country}</p>
          </div>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-gray-400 text-sm">{artist.no_plays} Tracks</span>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Follow
          </button>
        </div>
      </div>
    ),
    
    artist2: (artist:NTrack, index:any) => (
      <div key={`artist2-${index}`}
           className="flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-br from-purple-900 to-gray-900 p-6 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800">
            <img src={artist.image || "/api/placeholder/200/200"} alt={artist.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="font-bold text-white text-xl mt-4 text-center">{artist.name}</h3>
          <p className="text-gray-300 text-sm">{artist.country}</p>
          <div className="mt-4 flex items-center space-x-2">
            <User size={14} className="text-gray-400" />
            <span className="text-gray-400 text-sm">{artist.no_plays} tracks</span>
          </div>
          <button className="mt-4 w-full bg-transparent border border-white text-white py-2 rounded-full hover:bg-white hover:text-gray-900 transition-colors duration-300">
            View Profile
          </button>
        </div>
      </div>
    )
  };
  
  // Horizontal scroll handlers
  const scroll = (id:string, direction:string) => {
    const container = document.getElementById(id);
    const scrollAmount =(container)? container.clientWidth * 0.8:0;
    if (direction === 'left') {
      container?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Function to get tracks by section
  const getTracksBySection = (section:string) => {
    if (section === 'trending') {
      return tracks.filter(track => parseInt(track.no_plays) > 3).slice(0, 10);
    } else if (section === 'new') {
      return tracks.slice(0, 10);
    } else if (section === 'genre') {
      const genres = ['African', 'Hip-Hop', 'R&B', 'Gospel'];
      return genres.flatMap(genre => 
        tracks.filter(track => track.genre === genre).slice(0, 3)
      );
    }
    return tracks.slice(0, 10);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Music className="mr-2 text-green-500" />
          Singnify Music
        </h1>
        <div className="hidden md:flex space-x-4">
          <button 
            className={`px-3 py-1 rounded-full ${activeSection === 'trending' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveSection('trending')}
          >
            Trending
          </button>
          <button 
            className={`px-3 py-1 rounded-full ${activeSection === 'new' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveSection('new')}
          >
            New Releases
          </button>
          <button 
            className={`px-3 py-1 rounded-full ${activeSection === 'genre' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveSection('genre')}
          >
            By Genre
          </button>
        </div>
        <div className="md:hidden">
          <select 
            className="bg-gray-800 text-white rounded-md px-2 py-1"
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
          >
            <option value="trending">Trending</option>
            <option value="new">New Releases</option>
            <option value="genre">By Genre</option>
          </select>
        </div>
      </nav>
      
      {/* Modern Cards Collection */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modern Collection</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('modern-cards', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('modern-cards', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div id="modern-cards" className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar">
          {getTracksBySection(activeSection).slice(0, 10).map((track, i) => 
            cardDesigns.design1(track, i)
          )}
        </div>
      </div>
      
      {/* Minimal Cards Collection */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Minimal Aesthetic</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('minimal-cards', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('minimal-cards', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div id="minimal-cards" className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar">
          {getTracksBySection(activeSection).slice(0, 10).map((track, i) => 
            cardDesigns.design2(track, i)
          )}
        </div>
      </div>
      
      {/* Compact Cards Collection */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Compact Layout</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('compact-cards', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('compact-cards', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div id="compact-cards" className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar">
          {getTracksBySection(activeSection).slice(0, 10).map((track, i) => 
            cardDesigns.design3(track, i)
          )}
        </div>
      </div>
      
      {/* Gradient Cards Collection */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gradient Style</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('gradient-cards', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('gradient-cards', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div id="gradient-cards" className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar">
          {getTracksBySection(activeSection).slice(0, 10).map((track, i) => 
            cardDesigns.design4(track, i)
          )}
        </div>
      </div>
      
      {/* Artists Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Popular Artists</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('artists-cards', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('artists-cards', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div id="artists-cards" className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar">
          {artists.slice(0, 3).map((artist, i) => 
            cardDesigns.artist1(artist, i)
          )}
          {artists.slice(3, 6).map((artist, i) => 
            cardDesigns.artist2(artist, i + 3)
          )}
        </div>
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}