// app/links/[id]/page.tsx
import { Metadata } from "next";
import FanLinkClient from "./FanLinkClient";

export async function generateMetadata({ params }: { params:Promise< { id: string }> }): Promise<Metadata> {
    const iparams = await params;
  const [artist, title] = iparams.id.split("__").map((s) => decodeURIComponent(s.replace(/_/g, " ")));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getlinks?name=${artist}&title=${title}`,
    { next: { revalidate: 3600 } } // cache for 1 hour
  );
  const data = await res.json();

  return {
    title: `${data.spotify?.name || title} by ${data.spotify?.artist || artist} | Singnify`,
    description:
      data.lastfm?.summary ||
      `Listen to "${title}" by ${artist} — streaming on Spotify, Apple Music, YouTube, and more.`,
    openGraph: {
      title: `${data.spotify?.name || title} by ${artist}`,
      description: `Fanlinks and info for "${title}" by ${artist}`,
      images: [data.album_cover],
    },
  };
}

export default async function FanLinkPage({ params }: { params:Promise< { id: string }> }) {
        const iparams = await params;

  const [artist, title] = iparams.id.split("__").map((s) => decodeURIComponent(s.replace(/_/g, " ")));
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getlinks?name=${artist}&title=${title}`,
    { cache: "no-store" }
  );
  const data = await res.json();

  return <FanLinkClient data={data} />;
}
