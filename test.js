'use client'
import React, { useState, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize2,
  Minimize2,
  Home,
  Search,
  Library,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
//import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const fetchTracks = async () => {
    try {
      const response = await fetch("https://a51.1tv.ng/src/api/");
      const data = await response.json();
      setTracks(data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const updatePlayCount = async (trackId) => {
    try {
      await fetch("https://a51.1tv.ng/src/api/?path=play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trackId }),
      });
    } catch (error) {
      console.error("Error updating play count:", error);
    }
  };

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    updatePlayCount(track.id);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressClick = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount =
        direction === "left" ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <div className="min-h-screen pb-24">
          <main className="px-4 py-6">
            <h1 className="text-3xl font-bold mb-8">Discover</h1>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Top Played</h2>
              <div className="space-y-4">
                {tracks
                  .sort((a, b) => b.no_plays - a.no_plays)
                  .slice(0, 5)
                  .map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <span className="text-2xl font-bold text-gray-400 w-8">
                        {index + 1}
                      </span>
                      <img
                        src={track.image}
                        alt={track.track_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{track.track_name}</h3>
                        <p className="text-sm text-gray-400">{track.actor}</p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {track.no_plays.toLocaleString()} plays
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          </main>

          {currentTrack && (
            <div
              className={`fixed bottom-0 left-0 right-0 bg-gray-800 transition-all duration-300 ${
                isPlayerExpanded ? "h-full" : "h-20"
              }`}
            >
              <audio
                ref={audioRef}
                src={currentTrack.audio}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
              <div className="flex items-center h-full p-4">
                <div className={`flex ${isPlayerExpanded ? "flex-col" : ""} w-full`}>
                  <h3 className="font-semibold">{currentTrack.track_name}</h3>
                  <button
                    className="p-3 bg-green-500 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </button>
                  <button onClick={() => setIsPlayerExpanded(!isPlayerExpanded)}>
                    {isPlayerExpanded ? <Minimize2 /> : <Maximize2 />}
                  </button>
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
            <div className="flex justify-around py-4">
              <button className="flex flex-col items-center">
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
              </button>
              <button className="flex flex-col items-center">
                <Search className="w-6 h-6" />
                <span className="text-xs mt-1">Search</span>
              </button>
              <button className="flex flex-col items-center">
                <Library className="w-6 h-6" />
                <span className="text-xs mt-1">Library</span>
              </button>
              <button className="flex flex-col items-center">
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Profile</span>
              </button>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
