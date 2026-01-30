"use client";
import { useState } from 'react';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type Artist = {
  id: number;
  name: string;
  image: string;
  monthlyListeners?: number;
};

const MusicCard01 = ({ artist }: { artist: Artist }) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <motion.div
      className="relative group flex-shrink-0 w-48"
      onHoverStart={() => setShowControls(true)}
      onHoverEnd={() => setShowControls(false)}
    >
      <div className="relative w-48 h-48 mx-auto rounded-md overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <button className="bg-indigo-600 p-4 rounded-full hover:bg-indigo-700">
                <Play className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <h3 className="mt-4 text-center font-semibold">{artist.name}</h3>
      <p className="text-sm text-center text-gray-500">
        {artist.monthlyListeners !== undefined
          ? `${artist.monthlyListeners.toLocaleString()} monthly listeners`
          : "No data available"}
      </p>
    </motion.div>
  );
};

export default MusicCard01;
