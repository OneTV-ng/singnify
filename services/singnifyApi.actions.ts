'use server';

/**
 * Server actions for Singnify API
 * These run on the server, avoiding CORS issues
 */

import { getSingnifyApiClient } from './singnifyApi.service';
import { getDiscoverWithCache } from './discoverCache.service';
import {
  getDiscoverIndexWithCache,
  getCachedDiscoverType,
  getCachedDiscoverTypes,
  getDiscoverIndexStats,
  clearDiscoverIndexCache
} from './discoverIndexCache.service';

/**
 * Server action to fetch artists - avoids CORS issues
 */
export async function fetchArtistsAction(token?: string): Promise<any[]> {
  console.log('🖥️ Server Action: Fetching artists from API...');
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    const artistsData = await apiClient.getArtists();
    console.log('✅ Server Action: Artists fetched successfully', artistsData?.length || 0);
    return artistsData || [];
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching artists:', err.message);
    throw new Error(err.message || 'Failed to fetch artists');
  }
}

/**
 * Server action to fetch discovery data
 */
export async function fetchDiscoveryAction(type: string = 'most recent', token?: string): Promise<any> {
  console.log(`🖥️ Server Action: Fetching discovery data with type: ${type}`);
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    const data = await apiClient.getDiscovery(type);
    console.log('✅ Server Action: Discovery data fetched successfully');
    return data;
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching discovery:', err.message);
    throw new Error(err.message || 'Failed to fetch discovery');
  }
}

/**
 * Server action to fetch discovery with caching (updated daily, serves cache first)
 * For no-type discover (full featured page) - WITH TOKEN
 */
export async function fetchDiscoveryCachedAction(token?: string): Promise<any> {
  console.log('🖥️ Server Action: Fetching discovery with cache (WITH TOKEN)');
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    // Get discover with smart caching
    const data = await getDiscoverWithCache(async () => {
      console.log('📡 Fetching fresh discover data from API (with token) - FULL discover');
      // Pass empty string for type to get FULL discover with introductions
      return apiClient.getDiscovery('');
    });

    console.log('✅ Server Action: Discovery data retrieved (cached or fresh) - WITH TOKEN');
    return data;
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching cached discovery (with token):', err.message);
    throw new Error(err.message || 'Failed to fetch discovery');
  }
}

/**
 * Server action to fetch discovery with caching WITHOUT token
 * Better for open discover APIs that don't require authentication
 */
export async function fetchDiscoveryCachedActionNoToken(): Promise<any> {
  console.log('🔍 Server Action: Fetching discovery with cache (NO TOKEN - UNAUTHENTICATED)');
  try {
    const apiClient = getSingnifyApiClient();
    // Explicitly clear any existing token - discover as unauthenticated user
    apiClient.clearToken();
    console.log('🔐 Fetching discover without authentication (token cleared)');

    // Get discover with smart caching
    const data = await getDiscoverWithCache(async () => {
      console.log('📡 Fetching fresh discover data from API (no token) - FULL discover');
      // Pass empty string for type to get FULL discover with introductions
      return apiClient.getDiscovery('');
    });

    console.log('✅ Server Action: Discovery data retrieved (cached or fresh) - NO TOKEN');
    console.log('📊 Discover Data Summary (no token):', {
      hasIntroductions: !!data?.introductions,
      introductionsCount: data?.introductions?.length || 0,
      hasResult: !!data?.result,
      resultKeys: data?.result ? Object.keys(data.result) : [],
    });
    return data;
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching cached discovery (no token):', err.message);
    throw new Error(err.message || 'Failed to fetch discovery');
  }
}

/**
 * Server action to fetch genres
 */
export async function fetchGenresAction(token?: string): Promise<string[]> {
  console.log('🖥️ Server Action: Fetching genres from API...');
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    const genresData = await apiClient.getAllGenres();
    console.log('✅ Server Action: Genres fetched successfully', genresData?.length || 0);
    return genresData || [];
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching genres:', err.message);
    throw new Error(err.message || 'Failed to fetch genres');
  }
}

/**
 * Server action to search content (with optional token)
 */
export async function searchContentAction(query: string, token?: string): Promise<any> {
  console.log(`🖥️ Server Action: Searching for: "${query}" (WITH TOKEN)`);
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    const results = await apiClient.searchContent(query);
    console.log('✅ Server Action: Search completed successfully');
    console.log('📊 Full API Response:', results);

    // Extract result array if API returned object with result property
    const searchArray = results?.result || results;
    const itemCount = Array.isArray(searchArray) ? searchArray.length : 0;
    console.log(`🔍 Search Items Found: ${itemCount}`);
    console.log('📋 Search Array Sample:', Array.isArray(searchArray) ? searchArray.slice(0, 2) : searchArray);

    return searchArray;
  } catch (err: any) {
    console.error('❌ Server Action: Error searching (with token):', err.message);
    throw new Error(err.message || 'Failed to search');
  }
}

/**
 * Server action to search content WITHOUT token (no auth required)
 * Better for open search APIs that don't require authentication
 */
export async function searchContentActionNoToken(query: string): Promise<any> {
  console.log(`🔍 Server Action: Searching for: "${query}" (NO TOKEN - UNAUTHENTICATED)`);
  try {
    const apiClient = getSingnifyApiClient();
    // Explicitly clear any existing token - search as unauthenticated user
    apiClient.clearToken();
    console.log('🔐 Searching without authentication (token cleared)');

    const results = await apiClient.searchContent(query);
    console.log('✅ Server Action: Search completed successfully (no token)');
    console.log('📊 Full API Response (unauthenticated):', results);

    // Extract result array if API returned object with result property
    const searchArray = results?.result || results;
    const itemCount = Array.isArray(searchArray) ? searchArray.length : 0;
    console.log(`🔍 Search Items Found (no token): ${itemCount}`);
    console.log('📋 Search Array Sample (no token):', Array.isArray(searchArray) ? searchArray.slice(0, 3) : searchArray);

    return searchArray;
  } catch (err: any) {
    console.error('❌ Server Action: Error searching (no token):', err.message);
    throw new Error(err.message || 'Failed to search');
  }
}

/**
 * Server action to fetch top tracks
 */
export async function fetchTopTracksAction(token?: string): Promise<any[]> {
  console.log('🖥️ Server Action: Fetching top tracks from API...');
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    const tracksData = await apiClient.getTopTracks();
    console.log('✅ Server Action: Top tracks fetched successfully', tracksData?.length || 0);
    return tracksData || [];
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching top tracks:', err.message);
    throw new Error(err.message || 'Failed to fetch top tracks');
  }
}

/**
 * Server action to fetch music by genre
 */
export async function fetchMusicByGenreAction(genreName: string, token?: string): Promise<any[]> {
  console.log(`🖥️ Server Action: Fetching tracks for genre: "${genreName}"`);
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    const tracksData = await apiClient.getMusicByGenre(genreName);
    console.log('✅ Server Action: Genre tracks fetched successfully', tracksData?.length || 0);
    return tracksData || [];
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching genre tracks:', err.message);
    throw new Error(err.message || 'Failed to fetch genre tracks');
  }
}

/**
 * Server action to fetch listings
 */
export async function fetchListingsAction(token?: string): Promise<any> {
  console.log('🖥️ Server Action: Fetching listings from API...');
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    const listingsData = await apiClient.getListings();
    console.log('✅ Server Action: Listings fetched successfully');
    return listingsData;
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching listings:', err.message);
    throw new Error(err.message || 'Failed to fetch listings');
  }
}

/**
 * Server action to fetch discover data for multiple types
 * For showcase/platform pages
 */
export async function fetchDiscoverMultipleTypesAction(
  types: string[],
  token?: string
): Promise<Record<string, any>> {
  console.log(`🎬 Server Action: Fetching discover for ${types.length} types...`);
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    const results: Record<string, any> = {};

    // Fetch discover data for each type in sequence
    for (const type of types) {
      try {
        console.log(`📡 Fetching discover for type: "${type}"`);
        const data = await apiClient.getDiscovery(type);
        results[type] = data;
        console.log(`✅ Got discover for type: "${type}"`);
      } catch (typeErr: any) {
        console.warn(`⚠️ Failed to fetch discover for type "${type}":`, typeErr.message);
        results[type] = null; // Store null for failed types
      }
    }

    console.log(`✅ Server Action: Multi-type discover fetched successfully`);
    return results;
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching multi-type discover:', err.message);
    throw new Error(err.message || 'Failed to fetch discover for multiple types');
  }
}

/**
 * Server action to fetch discover with index caching (type=null for all data)
 * Organizes discover data by types and caches it for 24 hours
 * Returns indexed cache with methods to retrieve specific types
 */
export async function fetchDiscoveryCachedIndexAction(token?: string): Promise<Record<string, any>> {
  console.log('🖥️ Server Action: Fetching discover with index cache (NO TYPE - FULL DISCOVER)');
  try {
    const apiClient = getSingnifyApiClient();
    if (token) {
      apiClient.setToken(token);
    }

    // Get discover with smart index caching
    const indexedData = await getDiscoverIndexWithCache(async () => {
      console.log('📡 Fetching fresh full discover data from API for index caching');
      // Pass empty string for type to get FULL discover with all categories
      return apiClient.getDiscovery('');
    });

    console.log('✅ Server Action: Discover index cached and retrieved successfully');
    return indexedData;
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching cached discover index:', err.message);
    throw new Error(err.message || 'Failed to fetch discover index');
  }
}

/**
 * Server action to fetch discover with index caching WITHOUT token
 * Organizes discover data by types and caches it for 24 hours
 */
export async function fetchDiscoveryCachedIndexActionNoToken(): Promise<Record<string, any>> {
  console.log('🔍 Server Action: Fetching discover with index cache (NO TOKEN - FULL DISCOVER)');
  try {
    const apiClient = getSingnifyApiClient();
    apiClient.clearToken();
    console.log('🔐 Fetching discover without authentication for index caching');

    // Get discover with smart index caching
    const indexedData = await getDiscoverIndexWithCache(async () => {
      console.log('📡 Fetching fresh full discover data from API (no token) for index caching');
      // Pass empty string for type to get FULL discover with all categories
      return apiClient.getDiscovery('');
    });

    console.log('✅ Server Action: Discover index cached and retrieved successfully (no token)');
    return indexedData;
  } catch (err: any) {
    console.error('❌ Server Action: Error fetching cached discover index (no token):', err.message);
    throw new Error(err.message || 'Failed to fetch discover index');
  }
}

/**
 * Server action to get a specific type from the discover index cache
 * Must call fetchDiscoveryCachedIndexAction first to build the index
 */
export async function getDiscoverTypeCachedAction(type: string): Promise<any | null> {
  console.log(`🔍 Server Action: Retrieving cached discover type: "${type}"`);
  try {
    const data = await getCachedDiscoverType(type);

    if (data) {
      console.log(`✅ Retrieved cached discover type "${type}"`);
      const count = Array.isArray(data) ? data.length : 0;
      console.log(`📊 Type "${type}" contains ${count} items`);
    } else {
      console.log(`⚠️ Discover type "${type}" not found in cache`);
    }

    return data;
  } catch (err: any) {
    console.error(`❌ Error getting cached discover type "${type}":`, err.message);
    throw new Error(`Failed to get discover type "${type}"`);
  }
}

/**
 * Server action to get all available types from the discover index cache
 */
export async function getDiscoverAvailableTypesAction(): Promise<string[]> {
  console.log('📋 Server Action: Getting available discover types from cache');
  try {
    const types = await getCachedDiscoverTypes();
    console.log(`✅ Retrieved ${types.length} available discover types:`, types);
    return types;
  } catch (err: any) {
    console.error('❌ Error getting available discover types:', err.message);
    throw new Error('Failed to get available discover types');
  }
}

/**
 * Server action to get statistics about the discover index cache
 */
export async function getDiscoverIndexStatsAction(): Promise<any> {
  console.log('📊 Server Action: Getting discover index cache statistics');
  try {
    const stats = await getDiscoverIndexStats();
    console.log('✅ Cache Statistics:', stats);
    return stats;
  } catch (err: any) {
    console.error('❌ Error getting discover index stats:', err.message);
    throw new Error('Failed to get discover index statistics');
  }
}

/**
 * Server action to clear the discover index cache
 * Useful for manual refresh or maintenance
 */
export async function clearDiscoverIndexCacheAction(): Promise<void> {
  console.log('🗑️ Server Action: Clearing discover index cache');
  try {
    await clearDiscoverIndexCache();
    console.log('✅ Discover index cache cleared successfully');
  } catch (err: any) {
    console.error('❌ Error clearing discover index cache:', err.message);
    throw new Error('Failed to clear discover index cache');
  }
}
