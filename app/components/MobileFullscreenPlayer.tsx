import React from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Shuffle, Repeat, List, X
} from 'lucide-react';
import { usePlayer } from '@/app/context/PlayerContext';

const MobileFullscreenPlayer = () => {
  const { state, dispatch } = usePlayer();
  const { 
    queue, 
    currentIndex, 
    isPlaying, 
    repeatMode, 
    isShuffle, 
    currentTrack 
  } = state;

  const togglePlay = () => dispatch({ type: isPlaying ? "TOGGLE_PLAY" : "PLAY" });
  const nextTrack = () => dispatch({ type: 'NEXT_TRACK' });
  const prevTrack = () => dispatch({ type: 'PREVIOUS_TRACK' });
  const toggleShuffle = () => dispatch({ type: 'TOGGLE_SHUFFLE' });
  const toggleRepeat = () => dispatch({
    type: 'SET_REPEAT_MODE',
    payload: repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
  });

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      {/* Track Info */}
      <div className="relative flex-grow flex flex-col justify-center items-center p-8">
        <img 
          src={currentTrack?.image} 
          alt={currentTrack?.track_name} 
          className="w-64 h-64 rounded-2xl shadow-2xl mb-8 object-cover" 
        />
        
        <div className="text-center">
          <h2 className="text-2xl font-bold">{currentTrack?.track_name}</h2>
          <p className="text-lg text-gray-300">{currentTrack?.artist?.name}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="bg-purple-900/30 p-8 rounded-t-3xl">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={toggleShuffle} 
            className={`p-2 ${isShuffle ? 'text-purple-400' : 'text-white/50'}`}
          >
            <Shuffle />
          </button>
          
          <div className="flex items-center space-x-8">
            <button onClick={prevTrack} className="p-2">
              <SkipBack size={32} />
            </button>
            
            <button 
              onClick={togglePlay} 
              className="bg-purple-900 p-4 rounded-full"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            
            <button onClick={nextTrack} className="p-2">
              <SkipForward size={32} />
            </button>
          </div>
          
          <button 
            onClick={toggleRepeat} 
            className={`p-2 ${repeatMode !== 'off' ? 'text-purple-400' : 'text-white/50'}`}
          >
            <Repeat />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFullscreenPlayer;