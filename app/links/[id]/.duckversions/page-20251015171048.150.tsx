import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

// Helper to decode and split slug
function parseId(slug: string) {
  const [artist, title] = slug.split("__").map((s) => decodeURIComponent(s.replace(/_/g, " ")));
  return { artist, title };
}

// Dynamic metadata for SEO and social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { artist, title } = parseId(id);

  return {
    title: `${title} by ${artist} | Fanlinks — Singnify`,
    description: `Listen to "${title}" by ${artist} across Spotify, Apple Music, and YouTube — powered by Singnify.`,
    openGraph: {
      title: `${title} by ${artist}`,
      description: `Stream "${title}" by ${artist} on your favorite platform.`,
      url: `https://sv2.1tv.ng/links/${id}`,
      siteName: "Singnify",
      type: "music.song",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} by ${artist}`,
      description: `Stream "${title}" by ${artist} on Spotify, Apple Music, and YouTube.`,
    },
  };
}

async function getSongData(artist: string, title: string) {
  const apiUrl = `https://sv2.1tv.ng/api/getlinks?name=${encodeURIComponent(
    artist
  )}&title=${encodeURIComponent(title)}`;

  const res = await fetch(apiUrl, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch song data");

  return res.json();
}

export default async function SongPage({ params }: Props) {
  const { id } = await params;
  const { artist, title } = parseId(id);

  let songData;
  try {
    songData = await getSongData(artist, title);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-center p-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Error loading song data</h1>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { spotify, apple, youtube, album_cover, query } = songData || {};

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        {album_cover ? (
          <Image
            src={album_cover}
            alt={`${artist} - ${title}`}
            width={300}
            height={300}
            className="rounded-xl shadow-lg mx-auto mb-6"
          />
        ) : (
          <div className="w-[300px] h-[300px] bg-gray-800 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-gray-400">No Cover Art</span>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <h2 className="text-xl text-gray-400 mb-8">{artist}</h2>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          {spotify?.spotify_url && (
            <Link
              href={spotify.spotify_url}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
              target="_blank"
            >
              Listen on Spotify
            </Link>
          )}
          {apple?.apple_music_url && (
            <Link
              href={apple.apple_music_url}
              className="px-4 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition"
              target="_blank"
            >
              Listen on Apple Music
            </Link>
          )}
          {youtube?.youtube_music_url && (
            <Link
              href={youtube.youtube_music_url}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
              target="_blank"
            >
              Listen on YouTube
            </Link>
          )}
        </div>

        <footer className="mt-10 text-gray-500 text-sm">
          © 2025 <Link href="https://singnify.com" className="hover:text-white">Singnify.com</Link> — All rights reserved.
        </footer>
      </div>
    </main>
  );
}
