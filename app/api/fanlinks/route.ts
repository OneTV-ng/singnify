// app/api/fanlink/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Spotify API credentials - Get from environment variables or fallback
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '8c5d48d5f65745e1a95229faecf39303';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'b394eb67b4c147dc8fd1e15b4b9f1821';

// In-memory token cache (consider using Redis for production)
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get Spotify API access token (with caching)
 */
async function getSpotifyToken(): Promise<string | null> {
  // Check if cached token is still valid
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      console.error('Failed to get Spotify token:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.access_token) {
      // Cache token (expires in 1 hour, we'll refresh 5 minutes early)
      cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 300) * 1000,
      };
      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return null;
  }
}

/**
 * Search Spotify by track name and artist (returns URL and metadata)
 */
async function searchSpotifyByName(
  name: string,
  artistName: string,
  type: 'track' | 'album' = 'track'
): Promise<{ url: string; metadata: any } | null> {
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const query = encodeURIComponent(`${type}:${name} artist:${artistName}`);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=1`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    if (type === 'track' && data.tracks?.items?.[0]) {
      const track = data.tracks.items[0];
      return {
        url: track.external_urls.spotify,
        metadata: {
          id: track.id,
          uri: track.uri,
          name: track.name,
          artists: track.artists,
          album: {
            name: track.album.name,
            images: track.album.images,
            releaseDate: track.album.release_date,
          },
          duration_ms: track.duration_ms,
          explicit: track.explicit,
          isrc: track.external_ids?.isrc,
          popularity: track.popularity,
        }
      };
    }
    
    if (type === 'album' && data.albums?.items?.[0]) {
      const album = data.albums.items[0];
      return {
        url: album.external_urls.spotify,
        metadata: {
          id: album.id,
          uri: album.uri,
          name: album.name,
          artists: album.artists,
          images: album.images,
          releaseDate: album.release_date,
          totalTracks: album.total_tracks,
          upc: album.external_ids?.upc,
        }
      };
    }

    return null;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
}

/**
 * Search Spotify by ISRC (returns URL and metadata)
 */
async function searchSpotifyByISRC(isrc: string): Promise<{ url: string; metadata: any } | null> {
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const query = encodeURIComponent(`isrc:${isrc}`);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.tracks?.items?.[0]) {
      const track = data.tracks.items[0];
      return {
        url: track.external_urls.spotify,
        metadata: {
          id: track.id,
          uri: track.uri,
          name: track.name,
          artists: track.artists,
          album: {
            name: track.album.name,
            images: track.album.images,
            releaseDate: track.album.release_date,
          },
          duration_ms: track.duration_ms,
          explicit: track.explicit,
          isrc: track.external_ids?.isrc,
          popularity: track.popularity,
        }
      };
    }

    return null;
  } catch (error) {
    console.error('Error searching Spotify by ISRC:', error);
    return null;
  }
}

/**
 * Search Spotify by UPC (searches for album, then gets first track with metadata)
 */
async function searchSpotifyByUPC(upc: string): Promise<{ url: string; metadata: any } | null> {
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    // Search for album by UPC
    const query = encodeURIComponent(`upc:${upc}`);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    // If we found an album, get its URL or first track
    if (data.albums?.items?.[0]) {
      const album = data.albums.items[0];
      const albumId = album.id;
      
      // Get album tracks
      const tracksUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=1`;
      const tracksResponse = await fetch(tracksUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (tracksResponse.ok) {
        const tracksData = await tracksResponse.json();
        
        if (tracksData.items?.[0]) {
          const track = tracksData.items[0];
          return {
            url: track.external_urls.spotify,
            metadata: {
              id: track.id,
              uri: track.uri,
              name: track.name,
              artists: track.artists,
              album: {
                name: album.name,
                images: album.images,
                releaseDate: album.release_date,
              },
              duration_ms: track.duration_ms,
              explicit: track.explicit,
              upc: album.external_ids?.upc,
            }
          };
        }
      }
      
      // Fallback to album URL
      return {
        url: album.external_urls.spotify,
        metadata: {
          id: album.id,
          uri: album.uri,
          name: album.name,
          artists: album.artists,
          images: album.images,
          releaseDate: album.release_date,
          totalTracks: album.total_tracks,
          upc: album.external_ids?.upc,
        }
      };
    }

    return null;
  } catch (error) {
    console.error('Error searching Spotify by UPC:', error);
    return null;
  }
}

/**
 * Get platform links from song.link API (maximum coverage)
 */
async function getSongLinkData(spotifyUrl: string, countryCode: string = 'US'): Promise<any> {
  try {
    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}&userCountry=${countryCode}&songIfSingle=true`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error('Song.link API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Extract all available links
    const links: Record<string, string> = {};
    const platformDetails: Record<string, any> = {};
    
    // Extract from linksByPlatform (primary source)
    if (data.linksByPlatform) {
      Object.entries(data.linksByPlatform).forEach(([platform, linkInfo]: [string, any]) => {
        if (linkInfo.url) {
          links[platform] = linkInfo.url;
          
          // Store additional platform details
          platformDetails[platform] = {
            url: linkInfo.url,
            nativeAppUriMobile: linkInfo.nativeAppUriMobile,
            nativeAppUriDesktop: linkInfo.nativeAppUriDesktop,
            entityUniqueId: linkInfo.entityUniqueId,
          };
        }
      });
    }

    // Extract from entitiesByUniqueId for additional metadata
    const entities: Record<string, any> = {};
    if (data.entitiesByUniqueId) {
      Object.entries(data.entitiesByUniqueId).forEach(([uniqueId, entity]: [string, any]) => {
        entities[uniqueId] = {
          id: entity.id,
          type: entity.type,
          title: entity.title,
          artistName: entity.artistName,
          thumbnailUrl: entity.thumbnailUrl,
          thumbnailWidth: entity.thumbnailWidth,
          thumbnailHeight: entity.thumbnailHeight,
          apiProvider: entity.apiProvider,
          platforms: entity.platforms || [],
        };
      });
    }

    // Include the universal song.link page URL
    if (data.pageUrl) {
      links.songLink = data.pageUrl;
      links.odesli = data.pageUrl; // Odesli is the alternative name
    }

    // Try to extract any missed platforms from entities
    Object.values(entities).forEach((entity: any) => {
      if (entity.platforms && Array.isArray(entity.platforms)) {
        entity.platforms.forEach((platform: string) => {
          // If we don't have this platform yet, try to construct a link
          if (!links[platform] && entity.id) {
            const platformUrls: Record<string, string> = {
              'spotify': `https://open.spotify.com/track/${entity.id}`,
              'appleMusic': `https://music.apple.com/us/album/${entity.id}`,
              'youtube': `https://www.youtube.com/watch?v=${entity.id}`,
              'youtubeMusic': `https://music.youtube.com/watch?v=${entity.id}`,
              'deezer': `https://www.deezer.com/track/${entity.id}`,
              'soundcloud': entity.id,
            };
            
            if (platformUrls[platform] && !links[platform]) {
              // Only add if we have a valid URL pattern
              if (platformUrls[platform].startsWith('http')) {
                links[platform] = platformUrls[platform];
              }
            }
          }
        });
      }
    });

    return {
      success: true,
      links,
      spotifyUrl,
      platformDetails,
      entities,
      metadata: {
        pageUrl: data.pageUrl,
        entityUniqueId: data.entityUniqueId,
      },
      rawData: data, // Include full response for debugging
    };
  } catch (error) {
    console.error('Error fetching song.link data:', error);
    return null;
  }
}

/**
 * Main API handler
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get query parameters
    const trackName = searchParams.get('trackName');
    const albumName = searchParams.get('albumName');
    const artistName = searchParams.get('artistName');
    const isrc = searchParams.get('isrc');
    const upc = searchParams.get('upc');
    const countryCode = searchParams.get('countryCode') || 'US';

    let spotifyResult: { url: string; metadata: any } | null = null;

    // Determine search method based on provided parameters
    if (isrc) {
      // Search by ISRC (highest priority for accuracy)
      spotifyResult = await searchSpotifyByISRC(isrc);
    } else if (upc) {
      // Search by UPC
      spotifyResult = await searchSpotifyByUPC(upc);
    } else if (trackName && artistName) {
      // Search by track name and artist
      spotifyResult = await searchSpotifyByName(trackName, artistName, 'track');
    } else if (albumName && artistName) {
      // Search by album name and artist
      spotifyResult = await searchSpotifyByName(albumName, artistName, 'album');
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide either: (trackName OR albumName) + artistName, OR isrc, OR upc' 
        },
        { status: 400 }
      );
    }

    if (!spotifyResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Could not find the track/album on Spotify' 
        },
        { status: 404 }
      );
    }

    // Get links from song.link API
    const result = await getSongLinkData(spotifyResult.url, countryCode);

    if (!result) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch platform links' 
        },
        { status: 500 }
      );
    }

    // Merge Spotify metadata with song.link data
    return NextResponse.json({
      ...result,
      spotify: spotifyResult.metadata,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler (alternative method with body parameters)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { trackName, albumName, artistName, isrc, upc, countryCode = 'US' } = body;

    let spotifyResult: { url: string; metadata: any } | null = null;

    // Determine search method based on provided parameters
    if (isrc) {
      spotifyResult = await searchSpotifyByISRC(isrc);
    } else if (upc) {
      spotifyResult = await searchSpotifyByUPC(upc);
    } else if (trackName && artistName) {
      spotifyResult = await searchSpotifyByName(trackName, artistName, 'track');
    } else if (albumName && artistName) {
      spotifyResult = await searchSpotifyByName(albumName, artistName, 'album');
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide either: (trackName OR albumName) + artistName, OR isrc, OR upc' 
        },
        { status: 400 }
      );
    }

    if (!spotifyResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Could not find the track/album on Spotify' 
        },
        { status: 404 }
      );
    }

    // Get links from song.link API
    const result = await getSongLinkData(spotifyResult.url, countryCode);

    if (!result) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch platform links' 
        },
        { status: 500 }
      );
    }

    // Merge Spotify metadata with song.link data
    return NextResponse.json({
      ...result,
      spotify: spotifyResult.metadata,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}