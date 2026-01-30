
// TrackPage.tsx
'use client';
import { useEffect, useState } from 'react';
import { usePlayer } from '@/app/context/PlayerContext';
import { trackService } from '@/app/lib/api';
import { Track } from '@/app/lib/types';
import { Play, Pause, Heart, Plus, Share2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TrackPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TrackPage({ params }: TrackPageProps) {
  const [track, setTrack] = useState<Track | null>(null);
  const { state, dispatch } = usePlayer();
  const router = useRouter();
  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const data = await trackService.getTrackById(resolvedParams.id);
        setTrack(data);
      } catch (error) {
        console.error('Error fetching track:', error);
      }
    };
    fetchTrack();
  }, [resolvedParams.id]);

  if (!track) {
    return <div>Loading...</div>;
  }

  const isCurrentTrack = state.currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && state.isPlaying;

  const playTrack = () => {
    if (isCurrentTrack) {
      dispatch({ type: 'TOGGLE_PLAY' });
    } else {
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'PLAY' });
      trackService.updatePlayCount(track.id);
    }
  };

  const addToQueue = () => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: track });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8 hover:text-primary"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <img
              src={track.image}
              alt={track.track_name}
              className="w-full aspect-square object-cover rounded-lg shadow-xl"
            />
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{track?.track_name||"Unknow song"}</h1>
              <p className="text-2xl text-secondary">{track?.artist?.name||'Artist Unknow'}</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={playTrack}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-6 h-6" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    Play
                  </>
                )}
              </button>

              <button
                onClick={() => trackService.toggleLike(String(track.id))}
                className={`p-3 rounded-full hover:bg-secondary/10 ${
                  track.isLiked ? 'text-red-500' : 'text-secondary'
                }`}
              >
                <Heart className="w-6 h-6" />
              </button>

              <button
                onClick={addToQueue}
                className="p-3 rounded-full hover:bg-secondary/10 text-secondary"
              >
                <Plus className="w-6 h-6" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-3 rounded-full hover:bg-secondary/10 text-secondary">
                    <Share2 className="w-6 h-6" />
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

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-secondary">{track.description || 'No description available.'}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <dl className="grid grid-cols-2 gap-2">
                  <dt className="text-secondary">Genre</dt>
                  <dd>{track.genre}</dd>
                  <dt className="text-secondary">Release Date</dt>
                  <dd>{track.releaseDate ? new Date(track.releaseDate).toLocaleDateString() : 'Unknown'}</dd>
                  <dt className="text-secondary">Duration</dt>
                  <dd>{track.duration}</dd>
                  <dt className="text-secondary">Plays</dt>
                  <dd>{track.plays.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}