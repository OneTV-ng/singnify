//"@/app/components/uix/musicCard.tsx"
import { NTrack, Track } from '@/app/lib/types';
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Clock, User, Music, Headphones, Star, BarChart3, Download } from 'lucide-react';
import {getBigData} from "@/app/lib/bigData";

  
export const musicData :NTrack[]= await  getBigData('result.2');

//export const musicData =   getBigData('result.2') as unknown as  NTrack[];

export  const MusicCard = {
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
  ,
    miniCard1: (track:NTrack, index:any) => (
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
    
    miniCard2: (track:NTrack, index:any) => (
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
    
    miniCard3: (track:NTrack, index:any) => (
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
    
    miniCard4: (track:NTrack, index:any) => (
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
    
    miniCard5: (track:NTrack, index:any) => (
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
scroll : (id:string, direction:string) => {
    const container = document.getElementById(id);
    const scrollAmount =(container)? container.clientWidth * 0.8:0;
    if (direction === 'left') {
      container?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  },
  

  };

export const musicDat= musicData;