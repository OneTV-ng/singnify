'use client'
// /@/app/(actions)/discover/page
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Heart, MessageCircle, Globe, Music, Hash, ListMusic, Plus } from "lucide-react";

// Mock data for playlists
const featuredPlaylists = [
  {
    id: 1,
    title: "Top Hits 2024",
    curator: "Global Charts",
    tracks: 50,
    followers: "2.5M",
    image: "images/discover00.jpg"
  },
  {
    id: 2,
    title: "Chill Vibes",
    curator: "Mood Masters",
    tracks: 75,
    followers: "1.2M",
    image: "images/discover11.jpg"
  },
  {
    id: 3,
    title: "Workout Beats",
    curator: "Fitness Focus",
    tracks: 100,
    followers: "900K",
    image: "images/discover02.jpg"
  }
];

const personalPlaylists = [
  {
    id: 1,
    title: "My Favorites",
    lastUpdated: "2 days ago",
    tracks: 128,
    image: "images/discover03.jpg"
  },
  {
    id: 2,
    title: "Road Trip Mix",
    lastUpdated: "1 week ago",
    tracks: 45,
    image: "images/discover06.jpg"
  },
  {
    id: 3,
    title: "Study Session",
    lastUpdated: "3 days ago",
    tracks: 82,
    image: "images/discover07.jpg"
  }
];

// Mock data for trending songs (with adjusted image size)
const trendingSongs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    genre: "Pop",
    language: "English",
    plays: "2.5M",
    image: "images/discover11.jpg"
  },
  {
    id: 2,
    title: "Seoul Nights",
    artist: "K-Wave",
    genre: "K-Pop",
    language: "Korean",
    plays: "1.8M",
    image: "images/discover12.jpg"
  },
  {
    id: 3,
    title: "Desert Rose",
    artist: "Arabian Knights",
    genre: "Folk",
    language: "Arabic",
    plays: "900K",
    image: "images/discover13.jpg"
  }
];

export default function MusicDiscovery() {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Playlists Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredPlaylists.map(playlist => (
            <Card key={playlist.id} className="bg-zinc-900 flex">
              <img 
                src={playlist.image} 
                alt={playlist.title} 
                className="w-20 h-36 object-cover"
              />
              <CardContent className="flex-1 p-4">
                <CardTitle className="text-lg">{playlist.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  By {playlist.curator}
                </CardDescription>
                <div className="mt-2 text-sm text-gray-400">
                  {playlist.tracks} tracks • {playlist.followers} followers
                </div>
                <button className="mt-2 p-2 rounded-full bg-green-500 hover:bg-green-600">
                  <Play className="w-5 h-5" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {personalPlaylists.map(playlist => (
            <Card key={playlist.id} className="bg-zinc-900 flex">
              <img 
                src={playlist.image} 
                alt={playlist.title} 
                className="w-20 h-36 object-cover"
              />
              <CardContent className="flex-1 p-4">
                <CardTitle className="text-lg">{playlist.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  Updated {playlist.lastUpdated}
                </CardDescription>
                <div className="mt-2 text-sm text-gray-400">
                  {playlist.tracks} tracks
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="p-2 rounded-full bg-green-500 hover:bg-green-600">
                    <Play className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-zinc-800">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Discover Section */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Discover New Music</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Select Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="korean">Korean</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingSongs.map(song => (
            <Card key={song.id} className="bg-zinc-800 flex">
              <img 
                src={song.image} 
                alt={song.title} 
                className="w-20 h-36 object-cover"
              />
              <CardContent className="flex-1 p-4">
                <CardTitle className="text-lg">{song.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {song.artist}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-zinc-700 rounded-full text-xs">
                    {song.genre}
                  </span>
                  <span className="px-2 py-1 bg-zinc-700 rounded-full text-xs">
                    {song.plays} plays
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="p-2 rounded-full bg-green-500 hover:bg-green-600">
                    <Play className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-zinc-700">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-zinc-700">
                    <ListMusic className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}