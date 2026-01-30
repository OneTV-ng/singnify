import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

type Props = { params: { id: string } };

// 🧩 Parse slug: artist__title → Burna Boy, City Boys
function parseId(id: string) {
  const [artistSlug, titleSlug] = id.split('__');
  const artist = decodeURIComponent(artistSlug.replace(/_/g, ' '));
  const title = decodeURIComponent(titleSlug.replace(/_/g, ' '));
  return { artist, title };
}

// 🧠 Generate SEO metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artist, title } = parseId(params.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sv2.1tv.ng';

  const res = await fetch(`${baseUrl}/api/getlinks?name=${artist}&title=${title}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const track = data.spotify || {};
  const cover = track.album_cover || data.album_cover || '/default-cover.jpg';

  return {
    title: `${track.name || title} — ${artist}`,
    description: `Stream "${track.name || title}" by ${artist} on Spotify, Apple Music, YouTube & more — powered by Singnify.`,
    openGraph: {
      title: `${track.name || title} — ${artist}`,
      description: `Listen to ${artist} now on Singnify Fanlinks.`,
      images: [{ url: cover }],
      type: 'music.song',
      url: `${baseUrl}/links/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${track.name || title} — ${artist}`,
      description: `Find all streaming links for ${artist} on Singnify.`,
      images: [cover],
    },
  };
}

// 🖼️ Premium Fanlink Page
export default async function FanlinkPage({ params }: Props) {
  const { artist, title } = parseId(params.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sv2.1tv.ng';

  const res = await fetch(`${baseUrl}/api/getlinks?name=${artist}&title=${title}`, {
    cache: 'no-store',
  });
  const data = await res.json();

  if (!data || !data.spotify)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
        <h1 className="text-2xl font-bold mb-2">Track Not Found</h1>
        <p>Could not find {artist} - {title}</p>
      </div>
    );

  const { spotify, apple, youtube, lastfm, fanlinks } = data;
  const cover = data.album_cover || spotify.album_cover;

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* 🌆 Background Blur */}
      <div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          backgroundImage: `url(${cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(60px)',
        }}
      />

      {/* 🌟 Glass Card */}
      <div className="relative z-10 flex flex-col items-center text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 w-[90%] sm:w-[420px] animate-fade-in">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-6">
          <Image
            src={cover}
            alt={spotify.name}
            fill
            className="object-cover rounded-2xl shadow-lg"
            priority
          />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{spotify.name}</h1>
        <h2 className="text-lg text-gray-300">{spotify.artist}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {spotify.album} • {new Date(spotify.release_date).getFullYear()}
        </p>

        {/* 🌐 Fanlink Buttons */}
        <div className="flex flex-col w-full mt-8 gap-3">
          {fanlinks.spotify && (
            <Link
              href={fanlinks.spotify}
              target="_blank"
              className="transition-all bg-green-600/80 hover:bg-green-500 text-white py-3 rounded-full font-medium hover:shadow-[0_0_20px_#1DB95466] duration-300"
            >
              🎧 Listen on Spotify
            </Link>
          )}
          {fanlinks.apple && (
            <Link
              href={fanlinks.apple}
              target="_blank"
              className="transition-all bg-pink-600/80 hover:bg-pink-500 py-3 rounded-full font-medium hover:shadow-[0_0_20px_#FA2A5566] duration-300"
            >
              🍎 Play on Apple Music
            </Link>
          )}
          {fanlinks.youtube && (
            <Link
              href={fanlinks.youtube}
              target="_blank"
              className="transition-all bg-red-600/80 hover:bg-red-500 py-3 rounded-full font-medium hover:shadow-[0_0_20px_#FF000066] duration-300"
            >
              ▶️ Watch on YouTube
            </Link>
          )}
          {fanlinks.youtube_music && (
            <Link
              href={fanlinks.youtube_music}
              target="_blank"
              className="transition-all bg-red-500/80 hover:bg-red-400 py-3 rounded-full font-medium hover:shadow-[0_0_20px_#FF336666] duration-300"
            >
              🎵 YouTube Music
            </Link>
          )}
          {fanlinks.lastfm && (
            <Link
              href={fanlinks.lastfm}
              target="_blank"
              className="transition-all bg-yellow-600/80 hover:bg-yellow-500 py-3 rounded-full font-medium hover:shadow-[0_0_20px_#FFBB0066] duration-300"
            >
              ❤️ View on Last.fm
            </Link>
          )}
        </div>

        {/* 📜 Summary */}
        {lastfm.summary && (
          <div className="mt-8 text-sm text-gray-300 leading-relaxed max-h-48 overflow-y-auto scrollbar-none">
            <p dangerouslySetInnerHTML={{ __html: lastfm.summary }} />
          </div>
        )}

        {/* 🪪 Footer */}
        <div className="mt-12 text-xs text-gray-500">
          © 2025{' '}
          <Link href="https://singnify.com" className="hover:text-white underline">
            Singnify.com
          </Link>
        </div>
      </div>

      {/* ✨ Animation Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
