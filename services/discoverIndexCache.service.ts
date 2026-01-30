'use server';

import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const DISCOVER_INDEX_CACHE_FILE = path.join(CACHE_DIR, 'discover-index-cache.json');
const DISCOVER_INDEX_META_FILE = path.join(CACHE_DIR, 'discover-index-meta.json');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface DiscoverIndexMeta {
  lastUpdated: number;
  hash: string;
  types: string[];
  totalTracks: number;
}

interface DiscoverTypeIndex {
  [type: string]: any;
}

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') {
      console.error('❌ Error creating cache directory:', err);
    }
  }
}

/**
 * Generate a hash of the data
 */
function generateHash(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString('base64').substring(0, 16);
}

/**
 * Extract and organize discover data by types
 */
function indexDiscoverByTypes(discoverData: any): { index: DiscoverTypeIndex; meta: Partial<DiscoverIndexMeta> } {
  const index: DiscoverTypeIndex = {};
  let totalTracks = 0;

  // Process result object with numbered keys (1, 2, 3, etc.)
  if (discoverData?.result && typeof discoverData.result === 'object') {
    Object.entries(discoverData.result).forEach(([key, tracks]: [string, any]) => {
      if (Array.isArray(tracks)) {
        index[`category_${key}`] = tracks;
        totalTracks += tracks.length;
      }
    });
  }

  // Add introductions as a special type
  if (discoverData?.introductions && Array.isArray(discoverData.introductions)) {
    index['introductions'] = discoverData.introductions;
  }

  // Add raw API response for reference
  if (discoverData?.status) {
    index['_meta'] = {
      status: discoverData.status,
      message: discoverData.message,
      fetchedAt: Date.now()
    };
  }

  const types = Object.keys(index).filter(k => !k.startsWith('_'));

  return {
    index,
    meta: {
      types,
      totalTracks
    }
  };
}

/**
 * Get cached discover index
 */
export async function getCachedDiscoverIndex(): Promise<DiscoverTypeIndex | null> {
  try {
    await ensureCacheDir();
    const data = await fs.readFile(DISCOVER_INDEX_CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.warn('⚠️ No discover index cache found');
    return null;
  }
}

/**
 * Get specific type from cache
 */
export async function getCachedDiscoverType(type: string): Promise<any | null> {
  try {
    const index = await getCachedDiscoverIndex();
    if (!index) return null;

    if (type in index) {
      console.log(`✅ Retrieved cached type: ${type}`);
      return index[type];
    }

    console.warn(`⚠️ Type not found in cache: ${type}`);
    return null;
  } catch (err) {
    console.error(`❌ Error retrieving cached type ${type}:`, err);
    return null;
  }
}

/**
 * Get all available types from cache
 */
export async function getCachedDiscoverTypes(): Promise<string[]> {
  try {
    const meta = await getIndexMeta();
    if (!meta?.types) {
      console.warn('⚠️ No cached types available');
      return [];
    }
    return meta.types;
  } catch (err) {
    console.error('❌ Error retrieving cached types:', err);
    return [];
  }
}

/**
 * Get index metadata
 */
async function getIndexMeta(): Promise<DiscoverIndexMeta | null> {
  try {
    const data = await fs.readFile(DISCOVER_INDEX_META_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

/**
 * Save discover index to cache
 */
async function saveDiscoverIndex(data: any): Promise<void> {
  try {
    await ensureCacheDir();

    const { index, meta } = indexDiscoverByTypes(data);
    const hash = generateHash(index);

    const fullMeta: DiscoverIndexMeta = {
      lastUpdated: Date.now(),
      hash,
      types: meta.types || [],
      totalTracks: meta.totalTracks || 0
    };

    await Promise.all([
      fs.writeFile(DISCOVER_INDEX_CACHE_FILE, JSON.stringify(index, null, 2), 'utf-8'),
      fs.writeFile(DISCOVER_INDEX_META_FILE, JSON.stringify(fullMeta, null, 2), 'utf-8')
    ]);

    console.log(`✅ Discover index cache saved: ${fullMeta.types?.length || 0} types, ${fullMeta.totalTracks} tracks`);
  } catch (err: any) {
    console.error('❌ Error saving discover index cache:', err);
  }
}

/**
 * Check if cache needs update
 */
async function isIndexCacheExpired(): Promise<boolean> {
  const meta = await getIndexMeta();
  if (!meta) return true;

  const age = Date.now() - meta.lastUpdated;
  const isExpired = age > CACHE_DURATION;

  if (isExpired) {
    console.log(`⏰ Discover index cache expired (${Math.round(age / 60000)} minutes old)`);
  }

  return isExpired;
}

/**
 * Get discover index - returns cached while fetching fresh
 * This caches the full discover response organized by types
 */
export async function getDiscoverIndexWithCache(
  fetchFresh: () => Promise<any>
): Promise<DiscoverTypeIndex> {
  try {
    // Get cached data immediately
    const cached = await getCachedDiscoverIndex();
    const expired = await isIndexCacheExpired();

    console.log(`📦 Discover index cache status: ${cached ? 'EXISTS' : 'MISSING'}, ${expired ? 'EXPIRED' : 'FRESH'}`);

    // Return cached data first
    if (cached) {
      console.log('🔄 Serving discover index from cache');

      // Fetch fresh data in background if expired
      if (expired) {
        console.log('🔃 Updating discover index in background...');
        fetchFresh()
          .then(async (freshData) => {
            const { index: newIndex } = indexDiscoverByTypes(freshData);
            const hash = generateHash(newIndex);
            const meta = await getIndexMeta();

            // Only save if data is different
            if (meta?.hash !== hash) {
              console.log('🔄 New discover data detected, updating index');
              await saveDiscoverIndex(freshData);
            } else {
              console.log('✓ Discover index is still current');
              // Update timestamp to reset 24hr timer
              await fs.writeFile(
                DISCOVER_INDEX_META_FILE,
                JSON.stringify({
                  ...meta,
                  lastUpdated: Date.now()
                }, null, 2),
                'utf-8'
              );
            }
          })
          .catch((err) => {
            console.error('❌ Background index update failed:', err);
          });
      }

      return cached;
    }

    // No cache - fetch fresh data
    console.log('📥 No discover index cache found, fetching fresh data...');
    const freshData = await fetchFresh();

    // Save to cache for next time
    await saveDiscoverIndex(freshData);

    const index = await getCachedDiscoverIndex();
    return index || {};
  } catch (err: any) {
    console.error('❌ Error in getDiscoverIndexWithCache:', err);

    // Fallback to cached data
    const cached = await getCachedDiscoverIndex();
    if (cached) {
      console.log('⚠️ Error occurred, falling back to cached discover index');
      return cached;
    }

    throw err;
  }
}

/**
 * Clear discover index cache (useful for manual refresh)
 */
export async function clearDiscoverIndexCache(): Promise<void> {
  try {
    await Promise.all([
      fs.unlink(DISCOVER_INDEX_CACHE_FILE).catch(() => {}),
      fs.unlink(DISCOVER_INDEX_META_FILE).catch(() => {})
    ]);
    console.log('🗑️ Discover index cache cleared');
  } catch (err) {
    console.error('❌ Error clearing discover index cache:', err);
  }
}

/**
 * Get cache statistics
 */
export async function getDiscoverIndexStats(): Promise<{
  cached: boolean;
  expired: boolean;
  types: string[];
  totalTracks: number;
  lastUpdated?: number;
  ageMinutes?: number;
}> {
  try {
    const cached = await getCachedDiscoverIndex();
    const meta = await getIndexMeta();
    const expired = await isIndexCacheExpired();

    const stats = {
      cached: !!cached,
      expired,
      types: meta?.types || [],
      totalTracks: meta?.totalTracks || 0,
      lastUpdated: meta?.lastUpdated,
      ageMinutes: meta ? Math.round((Date.now() - meta.lastUpdated) / 60000) : undefined
    };

    console.log('📊 Discover Index Stats:', stats);
    return stats;
  } catch (err) {
    console.error('❌ Error getting discover index stats:', err);
    return {
      cached: false,
      expired: true,
      types: [],
      totalTracks: 0
    };
  }
}
