import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY!;

// 🔹 Helper: Get Spotify Token
async function getSpotifyToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Failed to get Spotify token");
  const data = await res.json();
  return data.access_token as string;
}

// 🔹 Helper: Search Spotify Track
async function searchSpotifyTrack(token: string, artist: string, title: string) {
  const q = `track:${title} artist:${artist}`;
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to search Spotify track");

  const data = await res.json();
  const item = data.tracks?.items?.[0];
  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    artist: item.artists.map((a: any) => a.name).join(", "),
    album: item.album.name,
    album_cover: item.album.images?.[0]?.url || null,
    spotify_url: item.external_urls.spotify,
    preview_url: item.preview_url,
    release_date: item.album.release_date,
    duration_ms: item.duration_ms,
    popularity: item.popularity,
  };
}

// 🔹 Helper: Get Last.fm Info
async function getLastFMInfo(artist: string, title: string) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(
    artist
  )}&track=${encodeURIComponent(title)}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to get Last.fm data");

  const data = await res.json();
  if (!data.track) return null;

  return {
    listeners: data.track.listeners,
    playcount: data.track.playcount,
    lastfm_url: data.track.url,
    tags: data.track.toptags?.tag?.map((t: any) => t.name) || [],
    summary: data.track.wiki?.summary || null,
    content: data.track.wiki?.content || null,
  };
}

// 🔹 Helper: Get Apple Music Info (via iTunes Search)
async function getAppleMusicInfo(artist: string, title: string) {
  const query = encodeURIComponent(`${artist} ${title}`);
  const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to get Apple Music data");

  const data = await res.json();
  const item = data.results?.[0];
  if (!item) return null;

  return {
    name: item.trackName,
    artist: item.artistName,
    album: item.collectionName,
    album_cover: item.artworkUrl100?.replace("100x100bb.jpg", "600x600bb.jpg"),
    preview_url: item.previewUrl,
    apple_music_url: item.trackViewUrl,
    release_date: item.releaseDate,
    country: item.country,
    genre: item.primaryGenreName,
  };
}

// 🔹 Helper: Generate YouTube Music Search Link (no API key)
function generateYouTubeLink(artist: string, title: string) {
  const searchQuery = encodeURIComponent(`${artist} ${title} official audio`);
  return {
    youtube_url: `https://www.youtube.com/results?search_query=${searchQuery}`,
    youtube_music_url: `https://music.youtube.com/search?q=${searchQuery}`,
  };
}

// 🔹 Main API Handler
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("name");
    const title = searchParams.get("title");

    if (!artist || !title) {
      return NextResponse.json(
        { error: "Missing 'name' or 'title' parameter" },
        { status: 400 }
      );
    }

    const spotifyToken = await getSpotifyToken();

    const [spotify, lastfm, apple] = await Promise.all([
      searchSpotifyTrack(spotifyToken, artist, title),
      getLastFMInfo(artist, title),
      getAppleMusicInfo(artist, title),
    ]);

    const youtube = generateYouTubeLink(artist, title);
    const album_cover =
      spotify?.album_cover || apple?.album_cover || null;

    const result = {
      query: { artist, title },
      spotify,
      apple,
      youtube,
      lastfm,
      album_cover,
      fanlinks: {
        spotify: spotify?.spotify_url,
        apple: apple?.apple_music_url,
        lastfm: lastfm?.lastfm_url,
        youtube: youtube.youtube_url,
        youtube_music: youtube.youtube_music_url,
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching track info:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

