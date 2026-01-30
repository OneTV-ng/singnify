// ========================================
// FILE 1: app/links/[id]/page.tsx
// ========================================
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import FanLinkClient from "./FanLinkClient";

type Props = {
  params: Promise<{ id: string }>;
};

function parseId(slug: string) {
  const [artist, title] = slug.split("__").map((s) => 
    decodeURIComponent(s.replace(/_/g, " "))
  );
  return { artist, title };
}

async function getSongData(artist: string, title: string) {
  const apiUrl = `https://sv2.1tv.ng/api/getlinks?name=${encodeURIComponent(
    artist
  )}&title=${encodeURIComponent(title)}`;
  
  const res = await fetch(apiUrl, { 
    cache: "no-store",
    next: { revalidate: 0 }
  });
  
  if (!res.ok) throw new Error("Failed to fetch song data");
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { artist, title } = parseId(id);
  
  try {
    const data = await getSongData(artist, title);
    const cover =
      data?.spotify?.album?.image ||
      data?.album_cover ||
      "https://singnify.com/assets/default-cover.jpg";

    return {
      title: `${title} by ${artist} | Singnify`,
      description: `Listen to "${title}" by ${artist} on your favorite music platform.`,
      openGraph: { 
        type: "music.song",
        images: [{ url: cover, width: 1200, height: 630 }],
        title: `${title} by ${artist}`,
        description: `Listen to "${title}" by ${artist} on your favorite music platform.`,
      },
      twitter: { 
        card: "summary_large_image", 
        images: [cover],
        title: `${title} by ${artist}`,
      },
    };
  } catch {
    return {
      title: `${title} by ${artist} | Singnify`,
      description: `Listen to "${title}" by ${artist} on your favorite music platform.`,
    };
  }
}

export default async function SongPage({ params }: Props) {
  const { id } = await params;
  const { artist, title } = parseId(id);

  let songData: any = null;
  let error = false;

  try {
    songData = await getSongData(artist, title);
  } catch (err) {
    error = true;
    console.error("Error fetching song data:", err);
  }

  if (error || !songData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black text-white">
        <div className="text-center p-6 max-w-md">
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-2xl font-bold mb-2">Song Not Found</h1>
          <p className="text-neutral-400 mb-6">
            We couldn't load the data for this song. Please try again later.
          </p>
          <Link 
            href="https://singnify.com"
            className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold transition-colors"
          >
            Go to Singnify
          </Link>
        </div>
      </div>
    );
  }

  return <FanLinkClient songData={songData} artist={artist} title={title} />;
}

