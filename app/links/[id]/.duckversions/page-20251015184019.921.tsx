import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  SiSpotify,
  SiApplemusic,
  SiYoutube,
  SiDeezer,
  SiTidal,
  SiAudiomack,
  SiAmazonmusic,
  SiSoundcloud,
} from "react-icons/si";

type Props = {
  params: Promise<{ id: string }>;
};

function parseId(slug: string) {
  const [artist, title] = slug.split("__").map((s) => decodeURIComponent(s.replace(/_/g, " ")));
  return { artist, title };
}

async function getSongData(artist: string, title: string) {
  const apiUrl = `https://sv2.1tv.ng/api/getlinks?name=${encodeURIComponent(
    artist
  )}&title=${encodeURIComponent(title)}`;
  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch song data");
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { artist, title } = parseId(id);
  const data = await getSongData(artist, title).catch(() => null);
  const cover =
    data?.spotify?.album?.image ||
    data?.album_cover ||
    "https://singnify.com/assets/default-cover.jpg";

  return {
    title: `${title} by ${artist} | Fanlink — Singnify`,
    description: `Listen to "${title}" by ${artist} across platforms.`,
    openGraph: { images: [{ url: cover, width: 1200, height: 1200 }] },
    twitter: { card: "summary_large_image", images: [cover] },
  };
}

export default async function SongPage({ params }: Props) {
  const { id } = await params;
  const { artist, title } = parseId(id);

  let songData: any = null;
  try {
    songData = await getSongData(artist, title);
  } catch {
    songData = null;
  }

  if (!songData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Error loading song data. Please try again later.</p>
      </div>
    );
  }

  const { spotify, fanlinks } = songData;
  const cover =
    spotify?.album?.image || songData.album_cover || "https://singnify.com/assets/default-cover.jpg";

  const platforms = [
    { key: "spotify", label: "Spotify", icon: <SiSpotify />, color: "bg-[#1DB954]" },
    { key: "appleMusic", label: "Apple Music", icon: <SiApplemusic />, color: "bg-[#fa57c1]" },
    { key: "youtubeMusic", label: "YouTube Music", icon: <SiYoutube />, color: "bg-[#FF0000]" },
    { key: "deezer", label: "Deezer", icon: <SiDeezer />, color: "bg-[#a238ff]" },
    { key: "tidal", label: "Tidal", icon: <SiTidal />, color: "bg-[#0A0A0A]" },
    { key: "audiomack", label: "Audiomack", icon: <SiAudiomack />, color: "bg-[#f6b21d]" },
    { key: "amazonMusic", label: "Amazon Music", icon: <SiAmazonmusic />, color: "bg-[#FF9900]" },
    { key: "soundcloud", label: "SoundCloud", icon: <SiSoundcloud />, color: "bg-[#FF5500]" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white flex flex-col items-center py-10 px-6">
      <div className="max-w-sm w-full text-center">
        <div className="relative w-52 h-52 mx-auto mb-6 rounded-full overflow-hidden shadow-lg shadow-amber-500/30">
          <Image src={cover} alt={title} fill className="object-cover" />
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <h2 className="text-lg text-gray-300 mb-8">{artist}</h2>

        <div className="flex flex-col gap-3">
          {platforms.map(({ key, label, icon, color }) => {
            const url = fanlinks?.[key];
            if (!url) return null;
            return (
              <Link
                key={key}
                href={url}
                target="_blank"
                className={`flex items-center justify-between px-5 py-3 rounded-xl ${color} hover:scale-[1.03] transition-transform`}
              >
                <div className="flex items-center gap-3 text-lg font-semibold">
                  {icon} <span>{label}</span>
                </div>
                <span className="text-sm font-medium uppercase opacity-90">Play</span>
              </Link>
            );
          })}
        </div>

        {spotify?.spotify_url && (
          <iframe
            src={`https://open.spotify.com/embed/track/${spotify.id}`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl border border-neutral-800 mt-8"
          ></iframe>
        )}

        <footer className="mt-10 text-gray-500 text-sm">
          © 2025{" "}
          <Link href="https://singnify.com" className="hover:text-white">
            Singnify.com
          </Link>{" "}
          — All rights reserved.
        </footer>
      </div>
    </main>
  );
}
