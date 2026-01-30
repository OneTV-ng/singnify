import React from 'react';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react';

const MusicPlayer = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="/album-cover.jpg" alt="Album Cover" className="w-16 h-16 rounded-lg mr-4" />
          <div>
            <h3 className="text-white font-bold">Midnight Music</h3>
            <p className="text-gray-400">Elise Olde</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <SkipBackIcon size={24} />
          </button>
          <button className="text-white bg-purple-500 rounded-full p-2 hover:bg-purple-600">
            <PlayIcon size={24} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <SkipForwardIcon size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;