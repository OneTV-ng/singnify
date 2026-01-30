/**
 * Artist Browser API Service
 * Handles discovery and search functionality
 */

export interface Artist {
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
  Facebook?: string | null;
  Twitter?: string | null;
  Instagram?: string | null;
  YouTube?: string | null;
}

export interface DiscoverResponse {
  status: 'success' | 'error';
  message: string;
  introductions?: Artist[];
  result?: {
    artists?: Artist[];
    tracks?: any[];
    music?: any[];
  };
}

export interface DiscoverParams {
  passkey?: string;
  genre?: string;
  country?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'trending' | 'plays' | 'followers' | 'newest';
}

const API_CONFIG = {
  baseUrl: process.env.SINGNIFY_API_URL || 'https://singnify.com/api/v2/php',
  endpoints: {
    discover: '/discover.php',
    showListings: '/show-listings.php',
    displayCharts: '/display-charts.php',
    displayGenres: '/display-genres.php',
  },
};

/**
 * Fetch artists from discovery endpoint
 */
export async function discoverArtists(params: DiscoverParams = {}): Promise<Artist[]> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.discover}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(params.passkey && { 'Authorization': `Bearer ${params.passkey}` }),
      },
      body: JSON.stringify({
        genre: params.genre,
        country: params.country,
        search: params.search,
        limit: params.limit || 50,
        offset: params.offset || 0,
        sortBy: params.sortBy || 'trending',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DiscoverResponse = await response.json();

    if (data.status === 'success') {
      // Handle different response structures
      const artists = data.introductions || data.result?.artists || [];
      return artists.map(formatArtist);
    }

    console.error('Discovery failed:', data.message);
    return [];
  } catch (error) {
    console.error('Error discovering artists:', error);
    return [];
  }
}

/**
 * Search artists by query
 */
export async function searchArtists(query: string, passkey?: string): Promise<Artist[]> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.discover}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(passkey && { 'Authorization': `Bearer ${passkey}` }),
      },
      body: JSON.stringify({
        search: query,
        limit: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DiscoverResponse = await response.json();

    if (data.status === 'success') {
      const artists = data.introductions || data.result?.artists || [];
      return artists.map(formatArtist);
    }

    return [];
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
}

/**
 * Fetch artists by genre
 */
export async function getArtistsByGenre(genre: string, passkey?: string): Promise<Artist[]> {
  return discoverArtists({ genre, passkey });
}

/**
 * Fetch trending artists
 */
export async function getTrendingArtists(limit: number = 20, passkey?: string): Promise<Artist[]> {
  return discoverArtists({ sortBy: 'trending', limit, passkey });
}

/**
 * Fetch new artists
 */
export async function getNewArtists(limit: number = 20, passkey?: string): Promise<Artist[]> {
  return discoverArtists({ sortBy: 'newest', limit, passkey });
}

/**
 * Fetch top artists by plays
 */
export async function getTopArtists(limit: number = 20, passkey?: string): Promise<Artist[]> {
  return discoverArtists({ sortBy: 'plays', limit, passkey });
}

/**
 * Fetch available genres
 */
export async function getGenres(passkey?: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.displayGenres}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(passkey && { 'Authorization': `Bearer ${passkey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.genres) {
      return data.genres;
    }

    // Fallback genres if API doesn't provide them
    return [
      'All',
      'Electronic',
      'Hip Hop',
      'Pop',
      'R&B',
      'Rock',
      'Afrobeat',
      'Jazz',
      'Synthwave',
      'Dubstep',
      'Indie Pop',
      'Country',
      'Reggae',
      'Classical',
    ];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return ['All', 'Electronic', 'Hip Hop', 'Pop', 'R&B', 'Rock'];
  }
}

/**
 * Get artist details by ID
 */
export async function getArtistById(artistId: string, passkey?: string): Promise<Artist | null> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.showListings}`, {
      method: 'GET',
      headers: {
        ...(passkey && { 'Authorization': `Bearer ${passkey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Find the specific artist
    const artists = data.artists || data.listings || [];
    const artist = artists.find((a: any) => a.ID === artistId);

    if (artist) {
      return formatArtist(artist);
    }

    return null;
  } catch (error) {
    console.error('Error fetching artist details:', error);
    return null;
  }
}

/**
 * Format raw artist data from API
 */
function formatArtist(rawArtist: any): Artist {
  return {
    ID: rawArtist.ID || '',
    Username: rawArtist.Username || '',
    StageName: rawArtist.StageName || rawArtist.Username || 'Unknown Artist',
    Picture: rawArtist.Picture || '/placeholder-artist.jpg',
    Country: rawArtist.Country || 'Unknown',
    RecordLabel: rawArtist.RecordLabel || 'Independent',
    IsVerified: rawArtist.IsVerified || '0',
    About: rawArtist.About || 'No bio available',
    Genre: rawArtist.Genre || 'Various',
    TotalPlays: formatNumber(rawArtist.TotalPlays || rawArtist.Plays || '0'),
    Followers: formatNumber(rawArtist.Followers || '0'),
    TracksCount: rawArtist.TracksCount || rawArtist.Tracks || '0',
    Facebook: rawArtist.Facebook || null,
    Twitter: rawArtist.Twitter || null,
    Instagram: rawArtist.Instagram || null,
    YouTube: rawArtist.YouTube || null,
  };
}

/**
 * Format numbers for display (e.g., 1000 -> 1K)
 */
function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
}

/**
 * Client-side filtering for artists
 */
export function filterArtists(
  artists: Artist[],
  filters: {
    search?: string;
    genre?: string;
    country?: string;
    verified?: boolean;
  }
): Artist[] {
  let filtered = [...artists];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      artist =>
        artist.StageName.toLowerCase().includes(query) ||
        artist.Username.toLowerCase().includes(query) ||
        artist.Genre?.toLowerCase().includes(query) ||
        artist.Country.toLowerCase().includes(query) ||
        artist.RecordLabel.toLowerCase().includes(query)
    );
  }

  if (filters.genre && filters.genre !== 'All') {
    filtered = filtered.filter(artist => artist.Genre === filters.genre);
  }

  if (filters.country) {
    filtered = filtered.filter(artist => artist.Country === filters.country);
  }

  if (filters.verified) {
    filtered = filtered.filter(artist => artist.IsVerified === '1');
  }

  return filtered;
}

/**
 * Client-side sorting for artists
 */
export function sortArtists(
  artists: Artist[],
  sortBy: 'trending' | 'plays' | 'followers' | 'newest' | 'a-z'
): Artist[] {
  const sorted = [...artists];

  switch (sortBy) {
    case 'plays':
      return sorted.sort((a, b) => {
        const playsA = parseFloat(a.TotalPlays?.replace(/[KM]/g, '') || '0');
        const playsB = parseFloat(b.TotalPlays?.replace(/[KM]/g, '') || '0');
        return playsB - playsA;
      });

    case 'followers':
      return sorted.sort((a, b) => {
        const followersA = parseFloat(a.Followers?.replace(/[KM]/g, '') || '0');
        const followersB = parseFloat(b.Followers?.replace(/[KM]/g, '') || '0');
        return followersB - followersA;
      });

    case 'a-z':
      return sorted.sort((a, b) => a.StageName.localeCompare(b.StageName));

    case 'trending':
    case 'newest':
    default:
      return sorted;
  }
}

/**
 * Get unique countries from artists list
 */
export function getUniqueCountries(artists: Artist[]): string[] {
  const countries = artists.map(a => a.Country).filter(Boolean);
  return [...new Set(countries)].sort();
}

/**
 * Get unique genres from artists list
 */
export function getUniqueGenres(artists: Artist[]): string[] {
  const genres = artists.map(a => a.Genre).filter((g): g is string => Boolean(g));
  return ['All', ...new Set(genres)].sort();
}
/**
 * Cache management for better performance
 */
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}

export default {
  discoverArtists,
  searchArtists,
  getArtistsByGenre,
  getTrendingArtists,
  getNewArtists,
  getTopArtists,
  getGenres,
  getArtistById,
  filterArtists,
  sortArtists,
  getUniqueCountries,
  getUniqueGenres,
  getCachedData,
  setCachedData,
  clearCache,
};