// MusicCard.tsx
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

  const handleImageClick = () => {
    router.push(`/track/${track.id}`);
  };

  return (
    <div className="group bg-card rounded-lg p-4 hover:shadow-lg transition-all">
      <div className="relative aspect-square mb-4 cursor-pointer" onClick={handleImageClick}>
        <img
          src={track.image}
          alt={track.track_name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering image click
                onPlay(track);
              }}
              className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg truncate">{track?.track_name}</h3>
        <p className="text-secondary truncate">{track?.artist?.name}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {track.duration}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLike(String(track.id))}
              className={`p-2 rounded-full hover:bg-secondary/10 ${
                track.isLiked ? 'text-red-500' : 'text-secondary'
              }`}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => onAddToQueue(track)}
              className="p-2 rounded-full hover:bg-secondary/10 text-secondary"
            >
              <Plus className="w-5 h-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-secondary/10 text-secondary">
                  <Share2 className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(
                  `${window.location.origin}/track/${track.id}`
                )}>
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem>Share to Facebook</DropdownMenuItem>
                <DropdownMenuItem>Share to Twitter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
