'use client'
// @/app/(actions)/connect/page
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Heart, Share2, Radio } from "lucide-react";




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

export const NewsTrack = () => {
    const [selectedChannel, setSelectedChannel] = useState(newsChannels[0].id);
      const [currentRadioIndex, setCurrentRadioIndex] = useState(0);
    
  return (
    <div>{/* News Ticker */}
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
    </div></div>
  )
}
