import Image from "next/image";
import Link from "next/link";

// Correct props type for Next.js 15+
type Props = {
  params: Promise<{ id: string }>;
};

// Mock function for fetching song data
async function getSongData(id: string) {
  const res = await fetch(`https://sv2.1tv.ng/api/link/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch song data");
  }

  return res.json();
}

export default async function SongPage({ params }: Props) {
  const { id } = await params; // ✅ next 15.5 requires awaiting params
  let songData;

  try {
    songData = await getSongData(id);

    console.log(songData);
  } catch (error) {
    console.error("Error loading song data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Error loading song data</h1>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const { spotify, apple, youtube, album_cover, query } = songData;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <Image
        src={album_cover}
        alt={`${query.artist} - ${query.title}`}
        width={300}
        height={300}
        className="rounded-xl shadow-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{query.title}</h1>
      <h2 className="text-xl text-gray-400 mb-6">{query.artist}</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        {spotify && (
          <Link
            href={spotify.spotify_url}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
            target="_blank"
          >
            Listen on Spotify
          </Link>
        )}
        {apple && (
          <Link
            href={apple.apple_music_url}
            className="px-4 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition"
            target="_blank"
          >
            Listen on Apple Music
          </Link>
        )}
        {youtube && (
          <Link
            href={youtube.youtube_music_url}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            target="_blank"
          >
            Listen on YouTube
          </Link>
        )}
      </div>
    </div>
  );
}
