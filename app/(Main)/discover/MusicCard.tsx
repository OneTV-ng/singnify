'use client';
import { useState } from 'react';
import { Play, Pause, Heart, Plus, Share2, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Track } from '@/app/lib/types';
import { useRouter } from 'next/navigation';

interface MusicCardProps {
  track: Track;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
}

export function MusicCard({
  track,
  isPlaying,
  onPlay,
  onAddToQueue,
  onToggleLike,
}: MusicCardProps) {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const handleImageClick = () => {
    router.push(`/track/${track.id}`);
  };

  return (
    <div 
      className="group bg-gradient-to-br from-slate-800/90 to-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-700/50 p-3"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Album Art Container */}
      <div 
        className="relative cursor-pointer mb-3"
        style={{ paddingBottom: "75%" }}
        onClick={handleImageClick}
      >
        <img
          src={track.image}
          alt={track.track_name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg shadow-md"
        />
        
        {/* Play/Pause Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 rounded-lg backdrop-blur-sm ${isHovering || isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(track);
            }}
            className="p-3 rounded-full bg-primary shadow-lg hover:bg-primary/90 text-white transform transition-all duration-300 hover:scale-110"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
        </div>
        
        {/* "Now Playing" Indicator */}
        {isPlaying && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-medium py-1 px-2.5 rounded-full shadow-md tracking-wide">
            Now Playing
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="px-1 pt-1">
        <h3 className="font-semibold text-base tracking-tight truncate text-white leading-tight hover:text-primary transition-colors">
          {track?.track_name}
        </h3>
        <p className="text-sm text-slate-300/90 truncate leading-tight mt-1 font-medium">
          {track?.artist?.name}
        </p>
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between mt-3">
          <span   className="text-xs hidden text-slate-400 flex items-center gap-1.5 leading-none font-medium tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            {track.duration}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLike(String(track.id))}
              className={`p-1.5 rounded-full hover:bg-slate-700/60 transition-colors ${
                track.isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={track.isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();  
                onAddToQueue(track);
              }}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
              aria-label="Add to queue"
            >
              <Plus className="w-4 h-4" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
                  aria-label="Share options"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[140px] text-sm rounded-lg border border-slate-700/70 shadow-xl bg-slate-800">
                <DropdownMenuItem 
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/track/${track.id}`)}
                  className="cursor-pointer text-sm py-2 px-3 font-medium hover:text-primary focus:text-primary"
                >
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-sm py-2 px-3 font-medium hover:text-primary focus:text-primary">
                  Share to Facebook
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-sm py-2 px-3 font-medium hover:text-primary focus:text-primary">
                  Share to Twitter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}