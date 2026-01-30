"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Heart, Share2, Radio } from "lucide-react";

// Mock data for community radios
const communityRadios = [
  {
    id: 1,
    name: "Jazz Vibes Radio",
    currentTrack: "Miles Davis - So What",
    listeners: 1234,
    genre: "Jazz",
    image: "/api/placeholder/400/200",
  },
  {
    id: 2,
    name: "Electronic Beats",
    currentTrack: "Daft Punk - Get Lucky",
    listeners: 2156,
    genre: "Electronic",
    image: "/api/placeholder/400/200",
  },
  {
    id: 3,
    name: "Rock Classics",
    currentTrack: "Led Zeppelin - Stairway to Heaven",
    listeners: 1789,
    genre: "Rock",
    image: "/api/placeholder/400/200",
  },
];

// Mock data for news feeds
const newsChannels = [
  { id: 1, name: "Music News" },
  { id: 2, name: "Artist Updates" },
  { id: 3, name: "Community Chat" },
  { id: 4, name: "Event Updates" },
];

// Mock data for trending artists
const trendingArtists = [
  {
    id: 1,
    name: "Taylor Swift",
    latestRelease: "Midnights",
    followers: "92M",
    image: "/api/placeholder/200/200",
  },
  {
    id: 2,
    name: "The Weeknd",
    latestRelease: "Starboy",
    followers: "52M",
    image: "/api/placeholder/200/200",
  },
  {
    id: 3,
    name: "Drake",
    latestRelease: "For All The Dogs",
    followers: "73M",
    image: "/api/placeholder/200/200",
  },
];

// Mock jobs and partners
const globalJobs = [
  {
    id: 1,
    title: "Music Licensing Specialist",
    location: "New York, USA",
    type: "Full-Time",
  },
  {
    id: 2,
    title: "Audio Engineer",
    location: "Berlin, Germany",
    type: "Part-Time",
  },
  {
    id: 3,
    title: "Streaming Analyst",
    location: "London, UK",
    type: "Remote",
  },
];

const partners = [
  { name: "Spotify", logo: "/api/placeholder/100/100" },
  { name: "Apple Music", logo: "/api/placeholder/100/100" },
  { name: "YouTube Music", logo: "/api/placeholder/100/100" },
  { name: "TikTok", logo: "/api/placeholder/100/100" },
];

// Mock news ticker items
const tickerItems = [
  "🎵 New Release: Taylor Swift announces surprise album",
  "🎤 Drake's latest tour breaks attendance records",
  "🎸 Rock legends announce reunion tour",
  "🎹 Grammy nominations announced",
  "🎧 New feature: Community radio sharing enabled",
];

export default function DistributePage() {
  const [selectedChannel, setSelectedChannel] = useState(newsChannels[0].id);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-6 rounded-lg text-center mb-8">
        <h1 className="text-4xl font-bold">Singnify Global Music Distributions</h1>
        <p className="text-lg mt-2">
          Empowering artists to reach a global audience. Partner with top
          platforms like Spotify, Apple Music, and more.
        </p>
      </div>

      {/* News Ticker */}
      <div className="bg-zinc-900 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Latest Updates</h3>
          <Select
            value={selectedChannel.toString()}
            onValueChange={(value) => setSelectedChannel(parseInt(value))}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {newsChannels.map((channel) => (
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

      {/* Featured Community Radios */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Community Radios</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {communityRadios.map((radio) => (
            <Card key={radio.id} className="min-w-[300px] bg-zinc-900">
              <CardHeader>
                <img
                  src={radio.image}
                  alt={radio.name}
                  className="rounded-lg w-full h-40 object-cover"
                />
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
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Artists */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Trending Artists</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {trendingArtists.map((artist) => (
            <Card key={artist.id} className="min-w-[200px] bg-zinc-900">
              <CardHeader>
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="rounded-full w-20 h-20 mx-auto mt-4"
                />
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle>{artist.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {artist.latestRelease}
                </CardDescription>
                <p className="text-sm text-gray-400">{artist.followers} followers</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Global Jobs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Explore Global Opportunities</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {globalJobs.map((job) => (
            <Card key={job.id} className="bg-zinc-900">
              <CardContent>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.location}</CardDescription>
                <p className="text-sm text-gray-400">{job.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Our Partners</h2>
        <div className="flex gap-4">
          {partners.map((partner) => (
            <div key={partner.name} className="text-center">
              <img
                src={partner.logo}
                alt={partner.name}
                className="rounded-lg w-20 h-20 mx-auto"
              />
              <p className="text-sm mt-2">{partner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
