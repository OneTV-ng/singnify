import { NextResponse } from 'next/server'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const LASTFM_API_KEY = process.env.LASTFM_API_KEY!

// 🟢 1. Get Spotify access token
async function getSpotifyToken(): Promise<string> {
  const body = new URLSearchParams({ grant_type: 'client_credentials' })
  const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Failed to get Spotify token')
  const data = await res.json()
  return data.access_token
}

// 🟢 2. Search Spotify track
async function searchSpotifyTrack(token: string, artist: string, track: string) {
  const q = `track:${track} artist:${artist}`
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = await res.json()
  const item = data.tracks?.items?.[0]
  if (!item) return null

  return {
    id: item.id,
    name: item.name,
    artists: item.artists.map((a: any) => a.name),
    spotify_url: item.external_urls.spotify,
    preview_url: item.preview_url,
    album: {
      name: item.album.name,
      image: item.album.images?.[0]?.url,
    },
  }
}

// 🟢 3. Get Last.fm info
async function getLastFmInfo(artist: string, track: string) {
  const url = new URL('https://ws.audioscrobbler.com/2.0/')
  url.search = new URLSearchParams({
    method: 'track.getInfo',
    api_key: LASTFM_API_KEY,
    artist,
    track,
    format: 'json',
  }).toString()

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()
  const t = data.track
  if (!t) return null

  return {
    name: t.name,
    artist: t.artist?.name || artist,
    lastfm_url: t.url,
    listeners: t.listeners,
    playcount: t.playcount,
    tags: t.toptags?.tag?.map((tag: any) => tag.name) || [],
  }
}

// 🟢 4. Get universal fanlinks from Song.Link (Odesli)
async function getUniversalFanlinks(spotifyUrl?: string, artist?: string, track?: string) {
  if (!spotifyUrl && (!artist || !track)) return null

  const base = spotifyUrl
    ? `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}`
    : `https://api.song.link/v1-alpha.1/links?artistName=${encodeURIComponent(
        artist!
      )}&title=${encodeURIComponent(track!)}`

  const res = await fetch(base, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()

  const links: Record<string, string> = {}
  if (data.linksByPlatform) {
    for (const [platform, obj] of Object.entries<any>(data.linksByPlatform)) {
      links[platform] = obj.url
    }
  }

  return {
    pageUrl: data.pageUrl,
    linksByPlatform: links,
  }
}

// 🟢 5. API Route Handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const artist = searchParams.get('name')
  const track = searchParams.get('title')

  if (!artist || !track) {
    return NextResponse.json({ error: 'Missing ?name=artist&title=song' }, { status: 400 })
  }

  try {
    const token = await getSpotifyToken()
    const spotifyData = await searchSpotifyTrack(token, artist, track)
    const [lastfmData, odesliData] = await Promise.all([
      getLastFmInfo(artist, track),
      getUniversalFanlinks(spotifyData?.spotify_url, artist, track),
    ])

    return NextResponse.json({
      success: true,
      artist,
      track,
      spotify: spotifyData,
      lastfm: lastfmData,
      fanlinks: odesliData?.linksByPlatform || {},
      songlink_page: odesliData?.pageUrl,
    })
  } catch (err: any) {
    console.error('Error fetching fanlinks:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
