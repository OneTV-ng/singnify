'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, Clock, Heart, MoreHorizontal, ChevronRight } from "lucide-react";
import { NewsTrack } from '@/app/components/widgets/NewsTrack';

const HomePage = () => {
  const dailyMixes = [
    {
      id: 1,
      title: "Daily Mix 1",
      artists: ["John Lennon", "Paul McCartney", "The Beatles"],
      image: "/api/placeholder/120/120",
      color: "bg-cyan-500"
    },
    {
      id: 2,
      title: "Daily Mix 2",
      artists: ["Taylor Swift", "Sabrina Carpenter"],
      image: "/api/placeholder/120/120",
      color: "bg-yellow-500"
    },
    {
      id: 3,
      title: "Daily Mix 3",
      artists: ["Harry Styles", "Ed Sheeran"],
      image: "/api/placeholder/120/120",
      color: "bg-red-500"
    },
    {
      id: 4,
      title: "Daily Mix 4",
      artists: ["M.I. Abaga", "Orise Femi"],
      image: "/api/placeholder/120/120",
      color: "bg-pink-500"
    }
  ];

  const featuredPlaylists = [
    {
      id: 1,
      title: "Christmas Hits",
      description: "Your favorite holiday songs",
      image: "/api/placeholder/120/120"
    },
    {
      id: 2,
      title: "Mood Booster",
      description: "Get happy with today's dose of feel-good songs!",
      image: "/api/placeholder/120/120"
    },
    {
      id: 3,
      title: "M.I. Abaga Radio",
      description: "With Orise Femi, Wizkid and more",
      image: "/api/placeholder/120/120"
    },
    {
      id: 4,
      title: "Netflix Holidays",
      description: "The sound of the season",
      image: "/api/placeholder/120/120"
    }
  ];

  const recentlyPlayed = [
    {
      id: 1,
      title: "Christmas Hits",
      type: "Playlist",
      image: "/api/placeholder/60/60"
    },
    {
      id: 2,
      title: "M.I. Abaga Radio",
      type: "Radio",
      image: "/api/placeholder/60/60"
    },
    {
      id: 3,
      title: "Mood Booster",
      type: "Playlist",
      image: "/api/placeholder/60/60"
    },
    {
      id: 4,
      title: "Liked Songs",
      type: "Playlist",
      image: "/api/placeholder/60/60"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900 text-white p-4">
      <NewsTrack />

      {/* Featured Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Featured</h2>
          <button className="text-xs text-gray-400 hover:text-white">Show all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {featuredPlaylists.map(playlist => (
            <Card key={playlist.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200">
              <CardContent className="p-3">
                <img 
                  src={playlist.image} 
                  alt={playlist.title}
                  className="w-full aspect-square object-cover rounded mb-2"
                />
                <CardTitle className="text-sm font-semibold truncate">{playlist.title}</CardTitle>
                <CardDescription className="text-xs text-gray-400 line-clamp-1">
                  {playlist.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Made For You Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Made For You</h2>
          <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            Show all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {dailyMixes.map(mix => (
            <Card key={mix.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200 group relative">
              <CardContent className="p-3">
                <div className="relative">
                  <img 
                    src={mix.image} 
                    alt={mix.title}
                    className="w-full aspect-square object-cover rounded mb-2"
                  />
                  <button className="absolute bottom-1 right-1 p-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Play className="w-4 h-4" fill="white" />
                  </button>
                </div>
                <CardTitle className="text-sm font-semibold truncate">{mix.title}</CardTitle>
                <CardDescription className="text-xs text-gray-400 line-clamp-1">
                  {mix.artists.join(", ")}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recently Played Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Recently Played</h2>
          <button className="text-xs text-gray-400 hover:text-white">Show all</button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3">
          {recentlyPlayed.map(item => (
            <Card key={item.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200">
              <CardContent className="p-2">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full aspect-square object-cover rounded mb-2"
                />
                <div className="text-xs font-semibold truncate">{item.title}</div>
                <div className="text-xs text-gray-400">{item.type}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;