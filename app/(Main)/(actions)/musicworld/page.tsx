'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, Newspaper, Mic, Music, Radio, Headphones, Award, ChevronRight, Clock } from "lucide-react";

const SingnifyBlogHome = () => {
  const latestNews = [
    {
      id: 1,
      title: "Taylor Swift Breaks Streaming Records",
      category: "Latest News",
      image: "/api/placeholder/300/200",
      timeToRead: "5 min"
    },
    {
      id: 2,
      title: "Next Generation Music Production Software",
      category: "Tech",
      image: "/api/placeholder/300/200",
      timeToRead: "8 min"
    },
    {
      id: 3,
      title: "Music Industry Latest Updates",
      category: "Industry",
      image: "/api/placeholder/300/200",
      timeToRead: "6 min"
    }
  ];

  const trendingPodcasts = [
    {
      id: 1,
      title: "Behind the Music",
      host: "Sarah Johnson",
      duration: "45 min",
      image: "/api/placeholder/120/120"
    },
    {
      id: 2,
      title: "Studio Sessions",
      host: "Mike Peters",
      duration: "60 min",
      image: "/api/placeholder/120/120"
    },
    {
      id: 3,
      title: "Music Tech Talk",
      host: "Alex Chen",
      duration: "30 min",
      image: "/api/placeholder/120/120"
    }
  ];

  const musicCharts = [
    {
      id: 1,
      title: "Global Top 10",
      description: "This week's most played tracks",
      image: "/api/placeholder/120/120"
    },
    {
      id: 2,
      title: "Rising Artists",
      description: "Emerging talents to watch",
      image: "/api/placeholder/120/120"
    },
    {
      id: 3,
      title: "Viral Hits",
      description: "Songs trending on social media",
      image: "/api/placeholder/120/120"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      {/* Header Banner */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Singnify Global Music World</h1>
        <p className="text-gray-300">Your Daily Dose of Music News, Tech, and Culture</p>
      </div>

      {/* Breaking News Ticker */}
      <Card className="bg-gray-800 mb-6">
        <CardContent className="p-2 flex items-center">
          <span className="font-bold mr-2">BREAKING:</span>
          <div className="animate-marquee whitespace-nowrap">
            Latest music industry updates • New album releases • Concert announcements
          </div>
        </CardContent>
      </Card>

      {/* Featured Stories Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Newspaper className="w-6 h-6" />
            Latest Stories
          </h2>
          <button className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestNews.map(story => (
            <Card key={story.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200">
              <CardContent className="p-4">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-purple-600 rounded-full">
                    {story.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {story.timeToRead}
                  </span>
                </div>
                <CardTitle className="text-lg mb-2">{story.title}</CardTitle>
                <button className="text-sm text-purple-400 hover:text-purple-300">
                  Read More →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Podcasts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Mic className="w-6 h-6" />
            Trending Podcasts
          </h2>
          <button className="text-sm text-gray-300 hover:text-white">Show all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingPodcasts.map(podcast => (
            <Card key={podcast.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200 group">
              <CardContent className="p-4 flex gap-3">
                <div className="relative flex-shrink-0">
                  <img 
                    src={podcast.image} 
                    alt={podcast.title}
                    className="w-20 h-20 rounded"
                  />
                  <button className="absolute bottom-1 right-1 p-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3 h-3" fill="white" />
                  </button>
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold mb-1">{podcast.title}</CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    {podcast.host}
                  </CardDescription>
                  <span className="text-xs text-gray-500">{podcast.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Music Charts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6" />
            Music Charts
          </h2>
          <button className="text-sm text-gray-300 hover:text-white">View all charts</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {musicCharts.map(chart => (
            <Card key={chart.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200">
              <CardContent className="p-4">
                <img 
                  src={chart.image} 
                  alt={chart.title}
                  className="w-full aspect-square object-cover rounded mb-3"
                />
                <CardTitle className="text-lg mb-1">{chart.title}</CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  {chart.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingnifyBlogHome;