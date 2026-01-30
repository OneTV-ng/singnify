'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Play, Pause, Loader2,
  ChevronLeft, ChevronRight, Music, Volume2,
  AlertCircle, X
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSearch } from '@/app/context/SearchContext';
import { fetchArtistsAction, fetchDiscoveryAction, fetchDiscoveryCachedAction, fetchDiscoveryCachedActionNoToken, fetchGenresAction, fetchTopTracksAction, searchContentAction, searchContentActionNoToken, fetchMusicByGenreAction, fetchListingsAction } from '@/services/singnifyApi.actions';

interface Track {
  id: string;
  track_name: string;
  artist_name?: string;
  label?: string;
  image?: string;
  audio?: string;
  no_plays?: string;
}

interface Artist {
  id: string;
  Username: string;
  FirstName: string;
  StageName: string;
  Picture: string;
  total_tracks?: string;
  followers?: string;
}

const GENRE_COLORS: Record<string, string> = {
  'Afrobeats': 'from-orange-500 to-red-600',
  'Hip-Hop': 'from-slate-600 to-slate-800',
  'Pop': 'from-pink-500 to-rose-600',
  'Rock': 'from-amber-600 to-orange-700',
  'R&B': 'from-purple-600 to-indigo-700',
  'Gospel': 'from-amber-500 to-yellow-600',
  'Reggae': 'from-yellow-500 to-green-600',
  'Jazz': 'from-blue-600 to-cyan-600',
  'Soul': 'from-red-600 to-pink-600',
  'Electronic': 'from-indigo-600 to-purple-700',
  'Country': 'from-orange-600 to-yellow-600',
  'Latin': 'from-red-500 to-orange-600',
};

export default function BrowseContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery, setIsSearching } = useSearch();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [introductions, setIntroductions] = useState<any[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreTracks, setGenreTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchResults, setSearchResults] = useState<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const featuredScrollRef = useRef<HTMLDivElement | null>(null);
  const topTracksScrollRef = useRef<HTMLDivElement | null>(null);
  const artistsScrollRef = useRef<HTMLDivElement | null>(null);

  // Initialize data and handle search
  useEffect(() => {
    if (!session?.accessToken) return;

    const urlSearchQuery = searchParams.get('search');
    const token = (session as any)?.accessToken || (session as any)?.user?.Token || '';

    const initializeContent = async () => {
      try {
        if (urlSearchQuery) {
          // Search mode - try without token first (open search API)
          console.log('🔍 Performing search from URL:', urlSearchQuery);
          setSearchQuery(urlSearchQuery);
          setLoading(true);
          setIsSearching(true);

          try {
            // First attempt: Search without token (works better for open APIs)
            console.log('🔓 Attempting search WITHOUT token (unauthenticated)');
            const results = await searchContentActionNoToken(urlSearchQuery);
            console.log('🔎 Search Results (no token):', results);
            setSearchResults(results);
          } catch (noTokenErr: any) {
            // Fallback: Try with token if no-token search fails
            console.warn('⚠️ No-token search failed, falling back to token-based search');
            console.log('🔐 Attempting search WITH token');
            const results = await searchContentAction(urlSearchQuery, token);
            console.log('🔎 Search Results (with token):', results);
            setSearchResults(results);
          }
        } else {
          // Browse mode
          console.log('📚 Loading browse data...');
          setSearchQuery('');
          setSearchResults(null);
          setLoading(true);
          await fetchInitialData();
        }
      } catch (err: any) {
        console.error('❌ Error during initialization:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    initializeContent();
  }, [searchParams, session?.accessToken]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = (session as any)?.accessToken || (session as any)?.user?.Token || '';

      console.log('🚀 Starting Browse Page Data Fetch via Server Actions...');

      const [featured, topTracksData, genresData, artistsData, listingsData, mostRecentDiscover] = await Promise.all([
        // Try discover WITHOUT token first, fallback to WITH token
        (async () => {
          try {
            console.log('🔓 Attempting discover WITHOUT token (unauthenticated)');
            const data = await fetchDiscoveryCachedActionNoToken();
            console.log('📌 Discovery API Response (Cached - Full, NO TOKEN):', data);
            return data;
          } catch (noTokenErr: any) {
            console.warn('⚠️ No-token discover failed, falling back to token-based discover');
            try {
              console.log('🔐 Attempting discover WITH token');
              const data = await fetchDiscoveryCachedAction(token);
              console.log('📌 Discovery API Response (Cached - Full, WITH TOKEN):', data);
              return data;
            } catch (tokenErr: any) {
              console.error('❌ Both discover attempts failed:', tokenErr);
              return { introductions: [], result: { '1': [], '2': [] } };
            }
          }
        })().catch((err: any) => {
          console.error('❌ Discover IIFE Error:', err);
          return { introductions: [], result: { '1': [], '2': [] } };
        }),
        fetchTopTracksAction(token).then((data: any) => {
          console.log('📌 Top Tracks API Response:', data);
          return data;
        }).catch((err: any) => {
          console.error('❌ Top Tracks API Error:', err);
          return [];
        }),
        fetchGenresAction(token).then((data: any) => {
          console.log('📌 Genres API Response:', data);
          return data;
        }).catch((err: any) => {
          console.error('❌ Genres API Error:', err);
          return [];
        }),
        fetchArtistsAction(token).then((data: any) => {
          console.log('📌 Artists API Response:', data);
          return data;
        }).catch((err: any) => {
          console.error('❌ Artists API Error:', err);
          return [];
        }),
        fetchListingsAction(token).then((data: any) => {
          console.log('📌 Listings API Response:', data);
          return data;
        }).catch((err: any) => {
          console.error('❌ Listings API Error:', err);
          return null;
        }),
        fetchDiscoveryAction('most recent', token).then((data: any) => {
          console.log('🔥 Discover type="most recent" Response (Troubleshooting):', data);
          console.log('📊 Most Recent Items Count:', data?.result ? Object.keys(data.result).length : 0);
          return data;
        }).catch((err: any) => {
          console.error('❌ Most Recent Discovery Error:', err);
          return null;
        })
      ]);

      // Extract introductions if available
      const introductionsArray = featured.introductions || [];
      console.log('📌 Introductions:', introductionsArray.length);

      console.log('📊 Processing Featured Data:', featured);
      const result = featured.result || featured;
      const featuredArray = result['1']?.slice(0, 20) || result['2']?.slice(0, 20) || result.slice?.(0, 20) || [];
      console.log('✅ Featured Array:', featuredArray);

      console.log('📊 Processing Top Tracks:', topTracksData);
      const topTracksArray = topTracksData?.slice(0, 20) || [];
      console.log('✅ Top Tracks Array:', topTracksArray);

      console.log('📊 Processing Genres:', genresData);
      // Use listings genres if available, fallback to API genres
      const genresArray = listingsData?.genres?.slice(0, 12) || genresData?.slice(0, 12) || [];
      console.log('✅ Genres Array:', genresArray);

      console.log('📊 Processing Artists:', artistsData);
      const artistsArray = artistsData?.slice(0, 12) || [];
      console.log('✅ Artists Array:', artistsArray);

      setIntroductions(introductionsArray);
      setFeaturedTracks(featuredArray);
      setTopTracks(topTracksArray);
      setGenres(genresArray);
      setArtists(artistsArray);

      console.log('✨ Browse Page Data Loaded Successfully!');
    } catch (err: any) {
      console.error('💥 Error fetching data:', err);
      setError(err.message || 'Failed to load browse data');
    } finally {
      setLoading(false);
    }
  };


  const handleGenreClick = async (genreName: string) => {
    try {
      setSelectedGenre(genreName);
      const token = (session as any)?.accessToken || (session as any)?.user?.Token || '';

      console.log('🎵 Fetching tracks for genre:', genreName);
      const tracks = await fetchMusicByGenreAction(genreName, token);
      console.log('📝 Genre Tracks Response:', tracks);
      const genreTracksArray = tracks?.slice(0, 50) || [];
      console.log('✅ Genre Tracks Array:', genreTracksArray);
      setGenreTracks(genreTracksArray);
    } catch (err: any) {
      console.error('❌ Error fetching genre music:', err);
      console.error('Error details:', err.message || err);
    }
  };

  const handlePlayTrack = (track: Track) => {
    if (!track.audio) return;

    if (audioRef.current) {
      if (currentlyPlaying === track.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.pause();
        audioRef.current.src = track.audio;
        audioRef.current.play();
        setCurrentlyPlaying(track.id);
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentlyPlaying(null);
  };

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 400;
      const newPosition = direction === 'left'
        ? ref.current.scrollLeft - scrollAmount
        : ref.current.scrollLeft + scrollAmount;
      ref.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const formatNumber = (value: string | number | undefined): string => {
    if (!value) return '0';
    const num = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const TrackCard = ({ track }: { track: Track }) => (
    <div className="group cursor-pointer">
      <div className="relative aspect-square mb-3 rounded-md overflow-hidden bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
        {track.image ? (
          <img src={track.image} alt={track.track_name} className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
            <Music className="w-8 h-8 text-gray-400" />
          </div>
        )}

        <button
          onClick={() => handlePlayTrack(track)}
          className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-400 p-3 rounded-full text-black opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110 shadow-lg hover:shadow-xl"
        >
          {isPlaying && currentlyPlaying === track.id ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>
      </div>

      <h3 className="font-semibold text-white text-sm truncate group-hover:text-green-400 transition-colors">{track.track_name}</h3>
      <p className="text-xs text-gray-400 truncate">{track.artist_name || track.label || 'Unknown'}</p>
      {track.no_plays && (
        <p className="text-xs text-gray-500 mt-1">{formatNumber(track.no_plays)} plays</p>
      )}
    </div>
  );

  const ArtistCard = ({ artist }: { artist: Artist }) => (
    <div className="group cursor-pointer text-center">
      <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
        <img
          src={artist.Picture || '/placeholder.png'}
          alt={artist.StageName}
          className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200"
        />
        <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Play className="w-8 h-8 text-green-500 fill-current ml-1" />
        </button>
      </div>

      <h3 className="font-semibold text-white text-sm truncate group-hover:text-green-400 transition-colors">{artist.StageName || artist.FirstName}</h3>
      <p className="text-xs text-gray-400 mb-2">Artist</p>
      {artist.followers && (
        <p className="text-xs text-gray-500 mb-3">{formatNumber(artist.followers)} followers</p>
      )}
    </div>
  );

  const GenreCard = ({ genre }: { genre: string }) => {
    const colors = GENRE_COLORS[genre] || 'from-blue-600 to-indigo-700';
    return (
      <button
        onClick={() => handleGenreClick(genre)}
        className={`h-24 rounded-lg bg-gradient-to-br ${colors} hover:shadow-lg transition-all duration-200 overflow-hidden group relative cursor-pointer`}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-200" />
        <div className="h-full flex items-center justify-center px-4">
          <span className="font-semibold text-white text-center drop-shadow-md">{genre}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">


      <div className="max-w-7xl mx-auto px-8 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium text-sm">Error loading content</p>
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading your music discovery...</p>
          </div>
        ) : searchResults ? (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-4xl font-bold">Results for "{searchQuery}"</h1>
              <button
                onClick={() => {
                  setSearchResults(null);
                  setSearchQuery('');
                  setIsSearching(false);
                  // Navigate back to browse
                  window.history.replaceState({}, '', '/browse');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Handle array of tracks from search API */}
            {Array.isArray(searchResults) && searchResults.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Tracks</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {searchResults.slice(0, 50).map((track: any) => (
                    <TrackCard key={track.id || track.track_name} track={track as Track} />
                  ))}
                </div>
              </div>
            )}

            {/* Handle object structure with songs/artists */}
            {!Array.isArray(searchResults) && searchResults.songs && searchResults.songs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Songs</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {searchResults.songs.slice(0, 30).map((track: Track) => (
                    <TrackCard key={track.id} track={track} />
                  ))}
                </div>
              </div>
            )}

            {!Array.isArray(searchResults) && searchResults.artists && searchResults.artists.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {searchResults.artists.slice(0, 12).map((artist: Artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </div>
            )}

            {/* Show message when no results */}
            {((Array.isArray(searchResults) && searchResults.length === 0) ||
              (!Array.isArray(searchResults) && !searchResults.songs && !searchResults.artists)) && (
              <div className="flex flex-col items-center justify-center py-32">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : selectedGenre ? (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-4xl font-bold">{selectedGenre}</h1>
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setGenreTracks([]);
                }}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 rounded-full text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {genreTracks.map((track: Track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Introductions / Editorial */}
            {introductions.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Picks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {introductions.slice(0, 6).map((intro: any) => (
                    <div
                      key={intro.id}
                      className="group cursor-pointer rounded-lg overflow-hidden bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={intro.image || intro.thumb_image}
                          alt={intro.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play className="w-12 h-12 text-green-500 fill-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-1">{intro.title}</p>
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">{intro.middle}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{intro.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Featured */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Featured Now</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => scroll(featuredScrollRef, 'left')}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => scroll(featuredScrollRef, 'right')}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div ref={featuredScrollRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x">
                {featuredTracks.map((track) => (
                  <div key={track.id} className="flex-shrink-0 w-48 snap-start">
                    <TrackCard track={track} />
                  </div>
                ))}
              </div>
            </section>

            {/* Trending */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Trending</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => scroll(topTracksScrollRef, 'left')}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => scroll(topTracksScrollRef, 'right')}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div ref={topTracksScrollRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x">
                {topTracks.map((track) => (
                  <div key={track.id} className="flex-shrink-0 w-48 snap-start">
                    <TrackCard track={track} />
                  </div>
                ))}
              </div>
            </section>

            {/* Genres */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Browse All</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genres.map((genre) => (
                  <GenreCard key={genre} genre={genre} />
                ))}
              </div>
            </section>

            {/* Artists */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Popular Artists</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => scroll(artistsScrollRef, 'left')}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => scroll(artistsScrollRef, 'right')}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div ref={artistsScrollRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x">
                {artists.map((artist) => (
                  <div key={artist.id} className="flex-shrink-0 w-56 snap-start">
                    <ArtistCard artist={artist} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {currentlyPlaying && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-black px-4 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in">
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-semibold">Now Playing</span>
        </div>
      )}
    </div>
  );
}
