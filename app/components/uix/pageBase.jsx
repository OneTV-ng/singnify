"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Clock, User, Music, Headphones, Star, BarChart3, Download } from 'lucide-react';

// Sample track for demonstration
const sampleTrack = {
  id: "1",
  track_name: "Summer Vibes",
  label: "Alexander Jones",
  genre: "Pop",
  language: "English",
  image: "/api/placeholder/120/120",
  audio: "sample.mp3",
  duration: "3:45",
  country: "USA",
  no_plays: "2.5M"
};

export default function CompactMusicCards() {
  const [tracks] = useState(Array(15).fill(sampleTrack).map((track, i) => ({
    ...track,
    id: `${i}`,
    track_name: i % 3 === 0 ? "Summer Vibes" : i % 3 === 1 ? "Midnight Dreams" : "Ocean Waves",
    label: i % 2 === 0 ? "Alexander Jones" : "Emma Williams",
    genre: i % 4 === 0 ? "Pop" : i % 4 === 1 ? "R&B" : i % 4 === 2 ? "Hip-Hop" : "Jazz",
    duration: i % 3 === 0 ? "3:45" : i % 3 === 1 ? "2:58" : "4:12",
  })));
  
  // Card design variants - 30% smaller than the original ones
  const compactDesigns = {
    miniCard1: (track, index) => (
      <div key={`mini1-${track.id}-${index}`} 
           className="flex-shrink-0 w-44 bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-xl">
        <div className="relative">
          <img src={track.image} alt={track.track_name} className="w-full h-44 object-cover" />
          <div className="absolute bottom-0 right-0 m-2">
            <button className="bg-green-500 hover:bg-green-600 rounded-full p-2 shadow-lg transition-transform duration-200 hover:scale-110">
              <Play size={16} className="text-white" />
            </button>
          </div>
        </div>
        <div className="p-2">
          <h3 className="font-bold text-white text-sm truncate">{track.track_name}</h3>
          <p className="text-gray-400 text-xs truncate">{track.label}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-500 text-xs">{track.duration}</span>
            <span className="text-gray-500 text-xs">{track.genre}</span>
          </div>
        </div>
      </div>
    ),
    
    miniCard2: (track, index) => (
      <div key={`mini2-${track.id}-${index}`}
           className="flex-shrink-0 w-44 bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex p-2">
          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
            <img src={track.image} alt={track.track_name} className="w-full h-full object-cover" />
          </div>
          <div className="ml-2 flex-grow">
            <h3 className="font-bold text-white text-xs truncate">{track.track_name}</h3>
            <p className="text-gray-400 text-xs truncate">{track.label}</p>
          </div>
        </div>
        <div className="px-2 pb-2 flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={12} className="text-gray-500" />
            <span className="ml-1 text-gray-400 text-xs">{track.duration}</span>
          </div>
          <span className="text-xs px-1.5 py-0.5 bg-gray-800 rounded-full text-gray-400">{track.genre}</span>
        </div>
      </div>
    ),
    
    miniCard3: (track, index) => (
      <div key={`mini3-${track.id}-${index}`}
           className="flex-shrink-0 w-44 h-24 bg-gray-900 rounded-lg overflow-hidden shadow-lg flex transition-all duration-300 hover:bg-gray-800">
        <div className="w-24 h-24 flex-shrink-0 relative">
          <img src={track.image} alt={track.track_name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-green-500 hover:bg-green-600 rounded-full p-1.5">
              <Play size={14} className="text-white" />
            </button>
          </div>
        </div>
        <div className="p-2 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-bold text-white text-xs truncate">{track.track_name}</h3>
            <p className="text-gray-400 text-xs truncate">{track.label}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">{track.duration}</span>
            <Heart size={12} className="text-gray-400 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>
    ),
    
    miniCard4: (track, index) => (
      <div key={`mini4-${track.id}-${index}`}
           className="flex-shrink-0 w-44 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <img src={track.image} alt={track.track_name} className="w-full h-28 object-cover" />
          <div className="absolute top-2 right-2">
            <div className="bg-black bg-opacity-60 rounded-full px-1.5 py-0.5 text-xs text-white flex items-center">
              <Headphones size={10} className="mr-1" />
              {track.no_plays}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
            <h3 className="font-bold text-white text-xs truncate">{track.track_name}</h3>
          </div>
        </div>
        <div className="p-2 flex justify-between items-center">
          <p className="text-gray-400 text-xs truncate">{track.label}</p>
          <span className="text-green-500 text-xs">{track.genre}</span>
        </div>
      </div>
    ),
    
    miniCard5: (track, index) => (
      <div key={`mini5-${track.id}-${index}`}
           className="flex-shrink-0 w-44 rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 hover:border-green-500">
        <div className="flex items-center p-2 bg-gray-900">
          <div className="relative">
            <div className="w-12 h-12 rounded-md overflow-hidden">
              <img src={track.image} alt={track.track_name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <button className="bg-green-500 hover:bg-green-600 rounded-full p-1 shadow-lg">
                <Play size={10} className="text-white" />
              </button>
            </div>
          </div>
          <div className="ml-2 flex-grow">
            <h3 className="font-bold text-white text-xs truncate">{track.track_name}</h3>
            <p className="text-gray-400 text-xs truncate">{track.label}</p>
            <div className="flex items-center mt-1">
              <Star size={10} className="text-yellow-500" />
              <Star size={10} className="text-yellow-500" />
              <Star size={10} className="text-yellow-500" />
              <Star size={10} className="text-yellow-500" />
              <Star size={10} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    ),
  };
  
  // Function to scroll the container horizontally
  const scroll = (id, direction) => {
    const container = document.getElementById(id);
    const scrollAmount = container.clientWidth * 0.8;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="bg-gray-950 text-white p-4">
      <h1 className="text-xl font-bold mb-6 flex items-center">
        <Music className="mr-2 text-green-500" />
        Compact Music Cards (30% smaller)
      </h1>
      
      {/* Mini Card Collection 1 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Compact Cards 1</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('mini-cards-1', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('mini-cards-1', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div id="mini-cards-1" className="flex overflow-x-auto space-x-3 pb-3 hide-scrollbar">
          {tracks.slice(0, 10).map((track, i) => 
            compactDesigns.miniCard1(track, i)
          )}
        </div>
      </div>
      
      {/* Mini Card Collection 2 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Compact Cards 2</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('mini-cards-2', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('mini-cards-2', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div id="mini-cards-2" className="flex overflow-x-auto space-x-3 pb-3 hide-scrollbar">
          {tracks.slice(0, 10).map((track, i) => 
            compactDesigns.miniCard2(track, i)
          )}
        </div>
      </div>
      
      {/* Mini Card Collection 3 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Compact Cards 3</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('mini-cards-3', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('mini-cards-3', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div id="mini-cards-3" className="flex overflow-x-auto space-x-3 pb-3 hide-scrollbar">
          {tracks.slice(0, 10).map((track, i) => 
            compactDesigns.miniCard3(track, i)
          )}
        </div>
      </div>
      
      {/* Mini Card Collection 4 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Compact Cards 4</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('mini-cards-4', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('mini-cards-4', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div id="mini-cards-4" className="flex overflow-x-auto space-x-3 pb-3 hide-scrollbar">
          {tracks.slice(0, 10).map((track, i) => 
            compactDesigns.miniCard4(track, i)
          )}
        </div>
      </div>
      
      {/* Mini Card Collection 5 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Compact Cards 5</h2>
          <div className="flex space-x-2">
            <button onClick={() => scroll('mini-cards-5', 'left')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('mini-cards-5', 'right')} className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div id="mini-cards-5" className="flex overflow-x-auto space-x-3 pb-3 hide-scrollbar">
          {tracks.slice(0, 10).map((track, i) => 
            compactDesigns.miniCard5(track, i)
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