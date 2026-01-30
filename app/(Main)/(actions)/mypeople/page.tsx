'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Users, Verified, Twitter, Instagram, Globe, ChevronRight, Award } from "lucide-react";

const MusicPeople = () => {
  const featuredArtists = [
    {
      id: 1,
      name: "Emma Rodriguez",
      role: "Rising Star",
      genre: "Pop/R&B",
      verified: true,
      followers: "2.5M",
      image: "/api/placeholder/200/200",
      socials: {
        twitter: "@emmarod",
        instagram: "@emmamusic"
      }
    },
    {
      id: 2,
      name: "Marcus Chen",
      role: "Producer",
      genre: "Electronic/Hip-Hop",
      verified: true,
      followers: "1.8M",
      image: "/api/placeholder/200/200",
      socials: {
        twitter: "@marcusbeats",
        instagram: "@chenmusic"
      }
    },
    {
      id: 3,
      name: "Sarah Black",
      role: "Songwriter",
      genre: "Alternative/Rock",
      verified: false,
      followers: "890K",
      image: "/api/placeholder/200/200",
      socials: {
        twitter: "@sarahblack",
        instagram: "@sarahbmusic"
      }
    }
  ];

  const musicIndustryPros = [
    {
      id: 1,
      name: "David Miller",
      title: "Label Executive",
      company: "Universal Music",
      image: "/api/placeholder/120/120",
      achievements: "Grammy Award Winner"
    },
    {
      id: 2,
      name: "Lisa Wang",
      title: "Music Director",
      company: "Spotify",
      image: "/api/placeholder/120/120",
      achievements: "Billboard Power 100"
    },
    {
      id: 3,
      name: "James Thompson",
      title: "Sound Engineer",
      company: "Abbey Road Studios",
      image: "/api/placeholder/120/120",
      achievements: "Multi-Platinum Engineer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Singnify Global Music People</h1>
        <p className="text-gray-300">Spotlight on the Voices Behind the Music</p>
      </div>

      {/* Featured Artists */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Featured Artists
          </h2>
          <button className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArtists.map(artist => (
            <Card key={artist.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{artist.name}</CardTitle>
                      {artist.verified && <Verified className="w-4 h-4 text-blue-400" />}
                    </div>
                    <CardDescription className="text-gray-400">{artist.role}</CardDescription>
                    <div className="text-sm text-gray-300">{artist.genre}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{artist.followers} followers</span>
                </div>
                <div className="flex gap-3">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Industry Professionals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6" />
            Industry Professionals
          </h2>
          <button className="text-sm text-gray-300 hover:text-white">Show all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {musicIndustryPros.map(pro => (
            <Card key={pro.id} className="bg-zinc-800/50 hover:bg-zinc-800/80 transition duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={pro.image} 
                    alt={pro.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{pro.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-400">
                      {pro.title}
                    </CardDescription>
                    <div className="text-xs text-gray-500">{pro.company}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-purple-400 font-medium">
                  {pro.achievements}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPeople;