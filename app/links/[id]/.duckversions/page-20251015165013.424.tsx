import { Metadata } from "next";
import FanLinkClient from "./FanLinkClient";

type Props = {
  params: Promise<{ id: string }>;
};

async function getTrackData(artist: string, title: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getlinks?name=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("API fetch failed");
    return await res.json();
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; // 👈 FIX: await the promise
  const [artist, title] = id.split("__").map((s) => decodeURIComponent(s.replace(/_/g, " ")));

  const data = await getTrackData(artist, title);

  if (!data) {
    return {
      title: `${title} by ${artist} | Singnify`,
      description: `Listen to ${title} by ${artist} on major streaming platforms.`,
    };
  }

  return {
    title: `${data.spotify?.name || title} by ${data.spotify?.artist || artist} | Singnify`,
    description:
      data.lastfm?.summary ||
      `Stream ${data.spotify?.name || title} by ${data.spotify?.artist || artist} — available on Spotify, Apple Music, and more.`,
    openGraph: {
      title: `${data.spotify?.name || title} by ${data.spotify?.artist || artist}`,
      description: "Fanlinks and details for this track on Singnify.",
      images: [data.album_cover],
    },
  };
}

export default async function FanLinkPage({ params }: Props) {
  const { id } = await params; // 👈 FIX: await again here
  const [artist, title] = id.split("__").map((s) => decodeURIComponent(s.replace(/_/g, " ")));
  const data = await getTrackData(artist, title);

  if (!data) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">Error loading song data</h1>
        <p className="text-gray-400 mt-2">Please try again later.</p>
      </div>
    );
  }

  return <FanLinkClient data={data} />;
}
