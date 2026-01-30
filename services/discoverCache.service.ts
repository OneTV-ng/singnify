'use server';

import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const DISCOVER_CACHE_FILE = path.join(CACHE_DIR, 'discover-cache.json');
const DISCOVER_CACHE_META_FILE = path.join(CACHE_DIR, 'discover-cache-meta.json');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheMeta {
  lastUpdated: number;
  hash: string;
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
 * Get cached discover data
 */
export async function getCachedDiscover(): Promise<any | null> {
  try {
    await ensureCacheDir();
    const data = await fs.readFile(DISCOVER_CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.warn('⚠️ No discover cache found');
    return null;
  }
}

/**
 * Get cache metadata
 */
async function getCacheMeta(): Promise<CacheMeta | null> {
  try {
    const data = await fs.readFile(DISCOVER_CACHE_META_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

/**
 * Save discover data to cache
 */
async function saveDiscoverCache(data: any): Promise<void> {
  try {
    await ensureCacheDir();

    const hash = generateHash(data);
    const meta: CacheMeta = {
      lastUpdated: Date.now(),
      hash
    };

    await Promise.all([
      fs.writeFile(DISCOVER_CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8'),
      fs.writeFile(DISCOVER_CACHE_META_FILE, JSON.stringify(meta, null, 2), 'utf-8')
    ]);

    console.log('✅ Discover cache saved successfully');
  } catch (err: any) {
    console.error('❌ Error saving discover cache:', err);
  }
}

/**
 * Check if cache needs update
 */
async function isCacheExpired(): Promise<boolean> {
  const meta = await getCacheMeta();
  if (!meta) return true;

  const age = Date.now() - meta.lastUpdated;
  const isExpired = age > CACHE_DURATION;

  if (isExpired) {
    console.log(`⏰ Cache expired (${Math.round(age / 60000)} minutes old)`);
  }

  return isExpired;
}

/**
 * Get discover data - returns cached while fetching fresh
 */
export async function getDiscoverWithCache(
  fetchFresh: () => Promise<any>
): Promise<any> {
  try {
    // Get cached data immediately
    const cached = await getCachedDiscover();
    const expired = await isCacheExpired();

    console.log(`📦 Cache status: ${cached ? 'EXISTS' : 'MISSING'}, ${expired ? 'EXPIRED' : 'FRESH'}`);

    // Return cached data first
    if (cached) {
      console.log('🔄 Serving from cache');

      // Fetch fresh data in background if expired
      if (expired) {
        console.log('🔃 Updating cache in background...');
        fetchFresh()
          .then(async (freshData) => {
            const hash = generateHash(freshData);
            const meta = await getCacheMeta();

            // Only save if data is different
            if (meta?.hash !== hash) {
              console.log('🔄 New data detected, updating cache');
              await saveDiscoverCache(freshData);
            } else {
              console.log('✓ Cache is still current');
              // Update timestamp to reset 24hr timer
              await fs.writeFile(
                DISCOVER_CACHE_META_FILE,
                JSON.stringify({
                  lastUpdated: Date.now(),
                  hash
                }, null, 2),
                'utf-8'
              );
            }
          })
          .catch((err) => {
            console.error('❌ Background update failed:', err);
          });
      }

      return cached;
    }

    // No cache - fetch fresh data
    console.log('📥 No cache found, fetching fresh data...');
    const freshData = await fetchFresh();

    // Save to cache for next time
    await saveDiscoverCache(freshData);

    return freshData;
  } catch (err: any) {
    console.error('❌ Error in getDiscoverWithCache:', err);

    // Fallback to cached data
    const cached = await getCachedDiscover();
    if (cached) {
      console.log('⚠️ Error occurred, falling back to cache');
      return cached;
    }

    throw err;
  }
}

/**
 * Clear cache (useful for manual refresh)
 */
export async function clearDiscoverCache(): Promise<void> {
  try {
    await Promise.all([
      fs.unlink(DISCOVER_CACHE_FILE).catch(() => {}),
      fs.unlink(DISCOVER_CACHE_META_FILE).catch(() => {})
    ]);
    console.log('🗑️ Discover cache cleared');
  } catch (err) {
    console.error('❌ Error clearing cache:', err);
  }
}
