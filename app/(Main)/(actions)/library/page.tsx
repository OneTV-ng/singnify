'use client'
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Music2, Album, ListMusic, Clock, Heart, MoreHorizontal, Play, Plus } from "lucide-react";

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Mock data for library items
  const recentSongs = [
    { id: 1, title: "AI Revolution", artist: "Tech Beats", duration: "3:45", plays: 1234, lastPlayed: "2 hours ago" },
    { id: 2, title: "Space Exploration", artist: "Cosmic Sound", duration: "4:20", plays: 890, lastPlayed: "1 day ago" },
    { id: 3, title: "Digital Dreams", artist: "Circuit Bay", duration: "3:15", plays: 567, lastPlayed: "3 days ago" }
  ];

  const albums = [
    { id: 1, title: "Future Sounds", artist: "Tech Beats", tracks: 12, year: 2024, image: "/api/placeholder/80/80" },
    { id: 2, title: "Cosmic Journey", artist: "Cosmic Sound", tracks: 10, year: 2023, image: "/api/placeholder/80/80" },
    { id: 3, title: "Electronic Vibes", artist: "Circuit Bay", tracks: 8, year: 2024, image: "/api/placeholder/80/80" }
  ];

  const playlists = [
    { id: 1, title: "My Favorites", tracks: 45, lastUpdated: "Today", image: "/api/placeholder/80/80" },
    { id: 2, title: "Workout Mix", tracks: 32, lastUpdated: "Yesterday", image: "/api/placeholder/80/80" },
    { id: 3, title: "Chill Vibes", tracks: 28, lastUpdated: "3 days ago", image: "/api/placeholder/80/80" }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Library</h1>
        <Input
          type="search"
          placeholder="Search your library..."
          className="max-w-sm bg-zinc-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="mb-6 bg-zinc-800">
          <TabsTrigger value="songs" className="flex items-center gap-2">
            <Music2 className="w-4 h-4" /> Songs
          </TabsTrigger>
          <TabsTrigger value="albums" className="flex items-center gap-2">
            <Album className="w-4 h-4" /> Albums
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <ListMusic className="w-4 h-4" /> Playlists
          </TabsTrigger>
        </TabsList>

        {/* Songs Tab */}
        <TabsContent value="songs">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="grid grid-cols-12 text-sm text-gray-400 pb-2 border-b border-zinc-700">
              <div className="col-span-5">Title</div>
              <div className="col-span-3">Artist</div>
              <div className="col-span-2 text-center"><Clock className="w-4 h-4 inline" /></div>
              <div className="col-span-2">Last Played</div>
            </div>
            {recentSongs.map(song => (
              <div key={song.id} className="grid grid-cols-12 items-center py-3 hover:bg-zinc-700 rounded-lg">
                <div className="col-span-5 flex items-center gap-3">
                  <button className="p-2 rounded-full hover:bg-green-600">
                    <Play className="w-4 h-4" />
                  </button>
                  {song.title}
                </div>
                <div className="col-span-3">{song.artist}</div>
                <div className="col-span-2 text-center">{song.duration}</div>
                <div className="col-span-2 flex items-center justify-between">
                  {song.lastPlayed}
                  <button className="p-2 rounded-full hover:bg-zinc-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Albums Tab */}
        <TabsContent value="albums">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map(album => (
              <Card key={album.id} className="bg-zinc-800 flex">
                <img 
                  src={album.image} 
                  alt={album.title}
                  className="w-20 h-20 object-cover"
                />
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg">{album.title}</CardTitle>
                  <div className="text-sm text-gray-400">
                    {album.artist} • {album.year}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {album.tracks} tracks
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="p-2 rounded-full bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-zinc-700">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Playlists Tab */}
        <TabsContent value="playlists">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Create Playlist Card */}
            <Card className="bg-zinc-800 flex items-center p-4 border-2 border-dashed border-zinc-700">
              <div className="text-center w-full">
                <Plus className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-bold">Create New Playlist</h3>
              </div>
            </Card>
            
            {/* Playlist Cards */}
            {playlists.map(playlist => (
              <Card key={playlist.id} className="bg-zinc-800 flex">
                <img 
                  src={playlist.image} 
                  alt={playlist.title}
                  className="w-20 h-20 object-cover"
                />
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg">{playlist.title}</CardTitle>
                  <div className="text-sm text-gray-400">
                    {playlist.tracks} tracks
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Updated {playlist.lastUpdated}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="p-2 rounded-full bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-zinc-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryPage;