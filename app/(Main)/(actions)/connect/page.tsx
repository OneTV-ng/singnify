'use client'
// @/app/(actions)/connect/page
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Heart, Share2, Radio } from "lucide-react";

// Mock data for community radios
const communityRadios = [
  {
    id: 1,
    name: "Jazz Vibes Radio",
    currentTrack: "Miles Davis - So What",
    listeners: 1234,
    genre: "Jazz",
    image: "/api/placeholder/400/200"
  },
  {
    id: 2,
    name: "Electronic Beats",
    currentTrack: "Daft Punk - Get Lucky",
    listeners: 2156,
    genre: "Electronic",
    image: "/api/placeholder/400/200"
  },
  {
    id: 3,
    name: "Rock Classics",
    currentTrack: "Led Zeppelin - Stairway to Heaven",
    listeners: 1789,
    genre: "Rock",
    image: "/api/placeholder/400/200"
  }
];

// Mock data for news feeds
const newsChannels = [
  { id: 1, name: "Music News" },
  { id: 2, name: "Artist Updates" },
  { id: 3, name: "Community Chat" },
  { id: 4, name: "Event Updates" }
];

// Mock data for trending artists
const trendingArtists = [
  {
    id: 1,
    name: "Taylor Swift",
    latestRelease: "Midnights",
    followers: "92M",
    image: "/api/placeholder/200/200"
  },
  {
    id: 2,
    name: "The Weeknd",
    latestRelease: "Starboy",
    followers: "52M",
    image: "/api/placeholder/200/200"
  },
  {
    id: 3,
    name: "Drake",
    latestRelease: "For All The Dogs",
    followers: "73M",
    image: "/api/placeholder/200/200"
  }
];

// Mock news ticker items
const tickerItems = [
  "🎵 New Release: Taylor Swift announces surprise album",
  "🎤 Drake's latest tour breaks attendance records",
  "🎸 Rock legends announce reunion tour",
  "🎹 Grammy nominations announced",
  "🎧 New feature: Community radio sharing enabled"
];

export default function CommunityConnect() {
  const [selectedChannel, setSelectedChannel] = useState(newsChannels[0].id);
  const [currentRadioIndex, setCurrentRadioIndex] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* News Ticker */}
      <div className="bg-zinc-900 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Latest Updates</h3>
          <Select value={selectedChannel.toString()} onValueChange={(value) => setSelectedChannel(parseInt(value))}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {newsChannels.map(channel => (
                <SelectItem key={channel.id} value={channel.id.toString()}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee">
            {tickerItems.join(" • ")}
          </div>
        </div>
      </div>

      {/* Community Radio Slider */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Community Radios</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {communityRadios.map((radio, index) => (
            <Card key={radio.id} className="min-w-[300px] bg-zinc-900 text-white">
              <CardHeader>
                <img src={radio.image} alt={radio.name} className="rounded-lg w-full h-40 object-cover" />
              </CardHeader>
              <CardContent>
                <CardTitle>{radio.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {radio.currentTrack}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                  <Radio className="w-4 h-4" />
                  {radio.listeners} listeners
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <button className="p-2 rounded-full bg-green-500 hover:bg-green-600">
                  <Play className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-zinc-800">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-zinc-800">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Artists */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Trending Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingArtists.map(artist => (
            <Card key={artist.id} className="bg-zinc-900 text-white">
              <CardHeader>
                <img src={artist.image} alt={artist.name} className="rounded-full w-24 h-24 mx-auto" />
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle>{artist.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest: {artist.latestRelease}
                </CardDescription>
                <div className="mt-2 text-sm text-gray-400">
                  {artist.followers} followers
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <button className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600">
                  Follow
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}