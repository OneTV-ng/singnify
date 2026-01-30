'use client';

import React, { useEffect, useState } from 'react';
import { Play, Heart, Share2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { fetchDiscoveryCachedIndexActionNoToken, getDiscoverTypeCachedAction } from '@/services/singnifyApi.actions';

interface TrackItem {
  id: string;
  track_name?: string;
  title?: string;
  image?: string;
  thumb_image?: string;
  artist?: { name: string } | string;
  label?: string;
  description?: string;
}

interface DiscoverCategory {
  key: string;
  displayName: string;
  color: string;
  items: TrackItem[];
}

export default function ShowcasePage() {
  const [categories, setCategories] = useState<DiscoverCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiscoverIndex = async () => {
      try {
        setLoading(true);
        console.log('📡 Fetching discover index...');

        // Fetch the discover index with caching
        const indexData = await fetchDiscoveryCachedIndexActionNoToken();

        console.log('✅ Discover index received, type:', typeof indexData);
        console.log('✅ Index keys:', indexData ? Object.keys(indexData).slice(0, 10) : 'no data');

        if (!indexData || typeof indexData !== 'object') {
          setError('Invalid data format received');
          return;
        }

        // Transform index data into categories
        const discoverCategories: DiscoverCategory[] = [];

        // Map of known categories with display names and colors
        const categoryConfig: Record<string, { displayName: string; color: string }> = {
          'introductions': { displayName: '🌟 Featured Picks', color: 'from-pink-500 to-rose-600' },
          'category_1': { displayName: '🔥 Trending Now', color: 'from-orange-500 to-red-600' },
          'category_2': { displayName: '💎 Featured Collections', color: 'from-purple-500 to-indigo-600' },
          'category_3': { displayName: '🎵 New Releases', color: 'from-blue-500 to-cyan-600' },
          'category_4': { displayName: '⭐ Popular Picks', color: 'from-green-500 to-emerald-600' },
          'category_5': { displayName: '🎶 Mood Tracks', color: 'from-yellow-500 to-amber-600' },
        };

        // Process each type in the index
        Object.entries(indexData).forEach(([key, data]) => {
          // Skip metadata and empty keys
          if (key.startsWith('_') || !data) return;

          // Only process arrays
          if (!Array.isArray(data)) {
            console.warn(`⚠️ Skipping ${key}: not an array`);
            return;
          }

          // Only process non-empty arrays
          if (data.length === 0) {
            console.warn(`⚠️ Skipping ${key}: empty array`);
            return;
          }

          const config = categoryConfig[key] || {
            displayName: key.replace('category_', 'Category ').replace(/_/g, ' '),
            color: 'from-gray-500 to-gray-700'
          };

          discoverCategories.push({
            key,
            displayName: config.displayName,
            color: config.color,
            items: data as TrackItem[]
          });

          console.log(`✅ Added category ${key}: ${data.length} items`);
        });

        if (discoverCategories.length === 0) {
          setError('No categories found in discover data');
          return;
        }

        setCategories(discoverCategories);
        console.log(`✅ Successfully loaded ${discoverCategories.length} categories`);
      } catch (err: any) {
        console.error('❌ Error loading discover index:', err);
        console.error('❌ Error details:', err?.message || err);
        setError(`Failed to load showcase data: ${err?.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadDiscoverIndex();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading showcase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Music Showcase
          </h1>
          <p className="text-gray-400 text-lg">
            Discover curated collections and trending music from our library
          </p>
        </div>

        {/* Categories */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No categories available</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <CategorySection key={category.key} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({ category }: { category: DiscoverCategory }) {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Show only first 12 items per category
  const displayItems = category.items.slice(0, 12);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-3xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
          {category.displayName}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {displayItems.map((item, index) => (
          <TrackCard key={`${category.key}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function TrackCard({ item }: { item: TrackItem }) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Determine display properties
  const title = item.track_name || item.title || 'Unknown Track';
  const artist = typeof item.artist === 'string' ? item.artist : item.artist?.name || item.label || 'Unknown Artist';
  const imageUrl = item.image || item.thumb_image || '/assets/images/default-album.png';

  return (
    <div
      className="flex-shrink-0 w-48 h-56 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-48 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
        {/* Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Overlay with play button */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <button className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors transform hover:scale-110">
              <Play className="w-6 h-6 text-white fill-white" />
            </button>
          </div>
        )}

        {/* Like button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 truncate">
        <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{artist}</p>
      </div>
    </div>
  );
}
