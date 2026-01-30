'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, Pause, SkipForward, Heart, Share2, Flame, Music, TrendingUp, Radio, ChevronRight } from "lucide-react";

const HottestJams = () => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);

  const trendingTracks = [
    {
      id: 1,
      title: "Summer Nights",
      artist: "Emma Rodriguez",
      image: "/api/placeholder/120/120",
      duration: "3:45",
      plays: "2.5M",
      genre: "Pop"
    },
    {
      id: 2,
      title: "City Lights",
      artist: "Marcus Chen",
      image: "/api/placeholder/120/120",
      duration: "4:12",
      plays: "1.8M",
      genre: "Electronic"
    },
    {
      id: 3,
      title: "Midnight Drive",
      artist: "Sarah Black",
      image: "/api/placeholder/120/120",
      duration: "3:56",
      plays: "1.2M",
      genre: "R&B"
    }
  ];

  const newReleases = [
    {
      id: 1,
      title: "Dawn",
      artist: "The Weekenders",
      releaseDate: "Just Now",
      image: "/api/placeholder/200/200"
    },
    {
      id: 2,
      title: "Neon Dreams",
      artist: "Luna Project",
      releaseDate: "2 hours ago",
      image: "/api/placeholder/200/200"
    },
    {
      id: 3,
      title: "Sunset Boulevard",
      artist: "Urban Poets",
      releaseDate: "5 hours ago",
      image: "/api/placeholder/200/200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-800 via-fuchsia-700 to-black text-white p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Singnify Hottest Jams</h1>
        <p className="text-gray-300">Your Daily Dose of Fresh Beats</p>
      </div>

      {/* Trending Now */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6" />
            Trending Now
          </h2>
          <button className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {trendingTracks.map(track => (
            <Card 
              key={track.id} 
              className={`bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200 ${
                currentTrack === track.id ? 'border-violet-500' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <img 
                      src={track.image} 
                      alt={track.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <button 
                      onClick={() => setCurrentTrack(currentTrack === track.id ? null : track.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                    >
                      {currentTrack === track.id ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{track.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-400">
                      {track.artist}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">{track.duration}</span>
                      <span className="text-xs text-gray-500">{track.plays} plays</span>
                      <span className="text-xs text-fuchsia-400">{track.genre}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-fuchsia-400">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-fuchsia-400">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* New Releases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="w-6 h-6" />
            New Releases
          </h2>
          <button className="text-sm text-gray-300 hover:text-white">View all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newReleases.map(release => (
            <Card key={release.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200 group">
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <img 
                    src={release.image} 
                    alt={release.title}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <button className="absolute bottom-2 right-2 p-3 rounded-full bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-600">
                    <Play className="w-5 h-5" fill="white" />
                  </button>
                </div>
                <CardTitle className="text-lg mb-1">{release.title}</CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  {release.artist}
                </CardDescription>
                <div className="mt-2 text-xs text-fuchsia-400">
                  {release.releaseDate}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HottestJams;