'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { fetchArtistsAction, fetchListingsAction } from '@/services/singnifyApi.actions';
import {
  Search,
  SlidersHorizontal,
  Play,
  Heart,
  Share2,
  Music,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  Users,
  Disc,
  Radio,
  Headphones,
  ChevronDown,
  X,
  Filter,
  Grid3x3,
  LayoutGrid,
  List,
  AlertCircle,
} from 'lucide-react';

// Types
interface Artist {
  ID: string;
  Username: string;
  StageName: string;
  Picture: string;
  Country: string;
  RecordLabel: string;
  IsVerified: string;
  About: string;
  Genre?: string;
  TotalPlays?: string;
  Followers?: string;
  TracksCount?: string;
}

interface DiscoverResponse {
  status: string;
  message: string;
  introductions?: Artist[];
  result?: {
    artists?: Artist[];
    tracks?: any[];
  };
}

// Default genres that can be overridden by API data
const defaultGenres = ['All', 'Electronic', 'Hip Hop', 'Pop', 'R&B', 'Rock', 'Afrobeat', 'Jazz', 'Synthwave', 'Dubstep', 'Indie Pop'];
const sortOptions = ['Trending', 'Most Played', 'New Artists', 'Most Followers', 'A-Z'];

export default function ArtistBrowser() {
  const { data: session } = useSession();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'featured'>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>(defaultGenres);

  // Fetch artists from API when session loads
  useEffect(() => {
    if (session?.accessToken) {
      fetchArtists();
    }
  }, [session]);

  // Filter and search artists
  useEffect(() => {
    let filtered = artists;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        artist =>
          artist.StageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artist.Username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artist.Genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artist.Country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(artist => artist.Genre === selectedGenre);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Most Played':
          return parseFloat(b.TotalPlays || '0') - parseFloat(a.TotalPlays || '0');
        case 'Most Followers':
          return parseFloat(b.Followers || '0') - parseFloat(a.Followers || '0');
        case 'A-Z':
          return a.StageName.localeCompare(b.StageName);
        default:
          return 0;
      }
    });

    setFilteredArtists(filtered);
  }, [searchQuery, selectedGenre, sortBy, artists]);

  async function fetchArtists() {
    setIsLoading(true);
    try {
      const token = (session as any)?.accessToken || (session as any)?.user?.Token || '';

      console.log('🎨 Fetching artists and listings...');
      const [artistsData, listingsData] = await Promise.all([
        fetchArtistsAction(token),
        fetchListingsAction(token).catch(() => null)
      ]);
      console.log('✅ Artists Response:', artistsData);
      console.log('✅ Listings Response:', listingsData);

      // Enrich data with defaults for missing fields
      const enrichedArtists = artistsData.map((artist: any) => ({
        ...artist,
        Genre: artist.Genre || 'Unknown',
        TotalPlays: artist.TotalPlays || '0',
        Followers: artist.Followers || '0',
        TracksCount: artist.TracksCount || '0',
      }));

      console.log('📊 Enriched Artists Count:', enrichedArtists.length);
      setArtists(enrichedArtists);

      // Use listings genres if available, otherwise extract from artists
      let uniqueGenres = defaultGenres;
      if (listingsData?.genres?.length) {
        uniqueGenres = ['All', ...listingsData.genres];
        console.log('🏷️ Using Listings Genres:', uniqueGenres);
      } else {
        uniqueGenres = ['All', ...new Set(
          enrichedArtists
            .map((a: any) => a.Genre)
            .filter((g: string) => g && g !== 'Unknown')
        )];
        console.log('🏷️ Extracted Genres from Artists:', uniqueGenres);
      }
      setGenres(uniqueGenres);

      setError(null);
    } catch (err: any) {
      console.error('❌ Error fetching artists:', err);
      setError(err.message || 'Failed to load artists');
      setArtists([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0a0a0f] dark:via-[#111118] dark:to-[#0a0a0f]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 dark:from-orange-600 dark:via-rose-600 dark:to-purple-700"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTE2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter">
              DISCOVER
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-rose-300 text-transparent bg-clip-text">
                NEW ARTISTS
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 font-medium max-w-2xl mx-auto">
              Explore the world's most talented independent artists and rising stars
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search by artist name, genre, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-16 py-6 text-lg bg-white dark:bg-gray-900 border-2 border-white/20 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 dark:focus:ring-orange-500/30 focus:border-orange-500 dark:text-white transition-all shadow-2xl"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    GENRE
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          selectedGenre === genre
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    SORT BY
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => setSortBy(option)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          sortBy === option
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Mode Toggle & Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              {filteredArtists.length} Artists
            </h2>
            {selectedGenre !== 'All' && (
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-bold">
                {selectedGenre}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <button
              onClick={() => setViewMode('featured')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'featured'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            {/* Featured View */}
            {viewMode === 'featured' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {filteredArtists.map((artist, index) => (
                  <FeaturedArtistCard
                    key={artist.ID}
                    artist={artist}
                    index={index}
                    onHover={setHoveredArtist}
                    isHovered={hoveredArtist === artist.ID}
                  />
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArtists.map((artist, index) => (
                  <GridArtistCard key={artist.ID} artist={artist} index={index} />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredArtists.map((artist, index) => (
                  <ListArtistCard key={artist.ID} artist={artist} index={index} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && filteredArtists.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-900/20 dark:to-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-orange-500 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              No Artists Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Featured Artist Card Component
function FeaturedArtistCard({ artist, index, onHover, isHovered }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => onHover(artist.ID)}
      onHoverEnd={() => onHover(null)}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 shadow-lg hover:shadow-2xl"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative sm:w-2/5 h-64 sm:h-auto overflow-hidden">
          <motion.img
            src={artist.Picture}
            alt={artist.StageName}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Play Button Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-orange-500 ml-1" fill="currentColor" />
            </button>
          </motion.div>

          {/* Verified Badge */}
          {artist.IsVerified === '1' && (
            <div className="absolute top-4 right-4 bg-orange-500 rounded-full p-2 shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {artist.StageName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">@{artist.Username}</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-2">
            {artist.About}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{artist.Country}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Music className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{artist.Genre}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xl font-black text-gray-900 dark:text-white">{artist.TotalPlays}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-bold">PLAYS</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-gray-900 dark:text-white">{artist.Followers}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-bold">FOLLOWERS</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-gray-900 dark:text-white">{artist.TracksCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-bold">TRACKS</div>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 rounded-xl transition-colors"
              >
                <Heart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 rounded-xl transition-colors"
              >
                <Share2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Grid Artist Card Component
function GridArtistCard({ artist, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all shadow-lg hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={artist.Picture}
          alt={artist.StageName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {artist.IsVerified === '1' && (
          <div className="absolute top-3 right-3 bg-orange-500 rounded-full p-1.5 shadow-lg">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-black text-white mb-1 truncate">{artist.StageName}</h3>
          <p className="text-sm text-white/80 truncate">@{artist.Username}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Music className="w-3 h-3" />
            {artist.Genre}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {artist.Country}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-gray-900 dark:text-white">{artist.TotalPlays} plays</span>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors">
              <Play className="w-4 h-4 text-orange-500" />
            </button>
            <button className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors">
              <Heart className="w-4 h-4 text-orange-500" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// List Artist Card Component
function ListArtistCard({ artist, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all shadow-md hover:shadow-lg"
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative flex-shrink-0">
          <img
            src={artist.Picture}
            alt={artist.StageName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
          />
          {artist.IsVerified === '1' && (
            <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1.5 shadow-lg">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-1 truncate">
            {artist.StageName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">@{artist.Username}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <Music className="w-4 h-4 text-orange-500" />
              {artist.Genre}
            </span>
            <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-orange-500" />
              {artist.Country}
            </span>
            <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <Headphones className="w-4 h-4 text-orange-500" />
              {artist.TotalPlays} plays
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 rounded-xl transition-all shadow-lg"
          >
            <Play className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}