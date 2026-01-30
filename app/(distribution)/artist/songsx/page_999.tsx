"use client";

import React, { useState } from 'react';
import { Music, Search, Filter, Grid, List, MoreVertical, Play, Pause, Edit, Trash, Eye, Download, Plus, TrendingUp, Heart, DollarSign } from 'lucide-react';

export default function MySongsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [showDropdown, setShowDropdown] = useState<null|number>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const songs = [
    {
      id: 1,
      title: "Midnight Dreams",
      artwork: "🎵",
      streams: 12450,
      likes: 234,
      revenue: 45.30,
      status: "published",
      uploadDate: "2025-06-10"
    },
    {
      id: 2,
      title: "Electric Soul",
      artwork: "🎶",
      streams: 8920,
      likes: 156,
      revenue: 32.10,
      status: "processing",
      uploadDate: "2025-06-15"
    },
    {
      id: 3,
      title: "Neon Nights",
      artwork: "🎤",
      streams: 15670,
      likes: 412,
      revenue: 67.80,
      status: "published",
      uploadDate: "2025-06-08"
    },
    {
      id: 4,
      title: "Ocean Waves",
      artwork: "🌊",
      streams: 0,
      likes: 0,
      revenue: 0,
      status: "draft",
      uploadDate: "2025-06-16"
    },
    {
      id: 5,
      title: "Urban Jungle",
      artwork: "🏙️",
      streams: 22340,
      likes: 567,
      revenue: 89.20,
      status: "published",
      uploadDate: "2025-06-05"
    },
    {
      id: 6,
      title: "Starlight Serenade",
      artwork: "⭐",
      streams: 7860,
      likes: 189,
      revenue: 28.90,
      status: "published",
      uploadDate: "2025-06-12"
    }
  ];

  const getStatusBadge = (status:string) => {
    switch (status) {
      case 'published':
        return <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-lg text-xs">Published</span>;
      case 'processing':
        return <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-lg text-xs">Processing</span>;
      case 'draft':
        return <span className="bg-gray-600/20 text-gray-400 px-2 py-1 rounded-lg text-xs">Draft</span>;
      default:
        return null;
    }
  };

  const handleSelectSong = (songId:number) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const handleSelectAll = () => {
    setSelectedSongs(selectedSongs.length === songs.length ? [] : songs.map(song => song.id));
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Songs</h1>
            <p className="text-slate-300">Manage your music library</p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Song
          </button>
        </div>

        {/* Controls Bar */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search and Filter */}
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search songs..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <button className="bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* View Toggle and Sort */}
            <div className="flex gap-3 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Played</option>
                <option value="earnings">Highest Earning</option>
                <option value="alphabetical">A-Z</option>
              </select>
              
              <div className="flex bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedSongs.length > 0 && (
            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
              <span className="text-slate-300">{selectedSongs.length} selected</span>
              <button className="text-purple-400 hover:text-purple-300">Publish</button>
              <button className="text-slate-400 hover:text-white">Archive</button>
              <button className="text-red-400 hover:text-red-300">Delete</button>
            </div>
          )}
        </div>

        {/* Songs Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map(song => (
              <div key={song.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:bg-slate-700/50 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={() => handleSelectSong(song.id)}
                    className="text-purple-600 focus:ring-purple-500 rounded"
                  />
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === song.id ? null : song.id)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {showDropdown === song.id && (
                      <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-lg py-2 w-32 z-10">
                        <button className="w-full text-left px-3 py-1 text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button className="w-full text-left px-3 py-1 text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button className="w-full text-left px-3 py-1 text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        <button className="w-full text-left px-3 py-1 text-red-400 hover:bg-slate-700 flex items-center gap-2">
                          <Trash className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Artwork and Play Button */}
                <div className="relative mb-4">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-4xl">
                    {song.artwork}
                  </div>
                  <button className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>

                {/* Song Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">{song.title}</h3>
                  <div className="flex justify-between items-center">
                    {getStatusBadge(song.status)}
                    <span className="text-slate-400 text-sm">{song.uploadDate}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <div className="text-white font-semibold flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {song.streams.toLocaleString()}
                    </div>
                    <div className="text-slate-400 text-xs">Streams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3" />
                      {song.likes}
                    </div>
                    <div className="text-slate-400 text-xs">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {song.revenue.toFixed(2)}
                    </div>
                    <div className="text-slate-400 text-xs">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSongs.length === songs.length}
                  onChange={handleSelectAll}
                  className="text-purple-600 focus:ring-purple-500 rounded mr-3"
                />
                <span className="text-white font-medium">Select All</span>
              </label>
            </div>
            <div className="divide-y divide-slate-700">
              {filteredSongs.map(song => (
                <div key={song.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song.id)}
                      onChange={() => handleSelectSong(song.id)}
                      className="text-purple-600 focus:ring-purple-500 rounded"
                    />
                    
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-xl">
                      {song.artwork}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{song.title}</h3>
                      <p className="text-slate-400 text-sm">{song.uploadDate}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-white font-semibold">{song.streams.toLocaleString()}</div>
                        <div className="text-slate-400 text-xs">Streams</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{song.likes}</div>
                        <div className="text-slate-400 text-xs">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">${song.revenue.toFixed(2)}</div>
                        <div className="text-slate-400 text-xs">Revenue</div>
                      </div>
                      <div>
                        {getStatusBadge(song.status)}
                      </div>
                      <button className="text-slate-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
            Previous
          </button>
          <span className="text-slate-300 mx-4">Page 1 of 1</span>
          <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}