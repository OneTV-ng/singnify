import { Metadata } from 'next';
import Image from 'next/image';

type Props = {
  params: { id: string };
};

// Helper to parse slugified id: artist__song
function parseId(id: string) {
  const parts = id.split('__');
  const artist = decodeURIComponent(parts[0].replace(/-/g, ' '));
  const title = decodeURIComponent(parts[1]?.replace(/-/g, ' '));
  return { artist, title };
}

// Generate metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artist, title } = parseId(params.id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getlinks?name=${artist}&title=${title}`,
    { cache: 'no-store' }
  );
  const data = await res.json();

  const track = data.combined || {};
  const image = track.album_image || '/default-cover.jpg';

  return {
    title: `${track.name || title} — ${artist}`,
    description:
      track.wiki ||
      `Listen to ${title} by ${artist} on Singnify — stream, share, and explore more fan links.`,
    openGraph: {
      title: `${track.name || title} — ${artist}`,
      description: track.wiki || 'Available on Spotify, Last.fm and more.',
      images: [{ url: image }],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/links/${params.id}`,
      siteName: 'Singnify',
      type: 'music.song',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${track.name || title} — ${artist}`,
      description: track.wiki || 'Discover and stream on Singnify.',
      images: [image],
    },
  };
}

export default async function FanlinkPage({ params }: Props) {
  const { artist, title } = parseId(params.id);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getlinks?name=${artist}&title=${title}`,
    { cache: 'no-store' }
  );
  const data = await res.json();

  if (!data.success) {
    return (
      <div className="p-10 text-center text-red-500">
        <h1>❌ Track not found</h1>
        <p>Please check artist name or title.</p>
      </div>
    );
  }

  const track = data.combined;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        <Image
          src={track.album_image}
          alt={track.name}
          width={400}
          height={400}
          className="mx-auto rounded-2xl shadow-lg"
        />
        <h1 className="text-3xl font-bold mt-6">{track.name}</h1>
        <h2 className="text-lg text-gray-400">{artist}</h2>
        <p className="text-sm mt-2 text-gray-500">{track.album} ({track.release_date})</p>

        <div className="flex justify-center gap-4 mt-6">
          {track.spotify_url && (
            <a
              href={track.spotify_url}
              target="_blank"
              className="px-4 py-2 bg-green-600 rounded-full hover:bg-green-700"
            >
              🎧 Listen on Spotify
            </a>
          )}
          {data.lastfm?.url && (
            <a
              href={data.lastfm.url}
              target="_blank"
              className="px-4 py-2 bg-red-600 rounded-full hover:bg-red-700"
            >
              ❤️ View on Last.fm
            </a>
          )}
        </div>

        {track.wiki && (
          <div className="mt-8 text-gray-300 text-sm leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: track.wiki }} />
          </div>
        )}

        <div className="mt-12 text-xs text-gray-600">
          © 2025 <a href="https://singnify.com" className="underline">Singnify.com</a>
        </div>
      </div>
    </main>
  );
}
