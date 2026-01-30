// app/links/[id]/FanLinkClient.tsx
"use client";

import Image from "next/image";

export default function FanLinkClient({ data }: { data: any }) {
  const { spotify, apple, youtube, lastfm, album_cover, fanlinks } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white flex flex-col items-center p-6">
      <Image
        src={album_cover || "/default_cover.jpg"}
        alt={spotify?.name || "Album cover"}
        width={240}
        height={240}
        className="rounded-2xl shadow-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{spotify?.name || "Unknown Song"}</h1>
      <h2 className="text-lg text-gray-400 mb-6">{spotify?.artist}</h2>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {fanlinks.spotify && (
          <a
            href={fanlinks.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-center font-semibold"
          >
            Listen on Spotify
          </a>
        )}
        {fanlinks.apple && (
          <a
            href={fanlinks.apple}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-700 p-3 rounded-xl text-center font-semibold"
          >
            Listen on Apple Music
          </a>
        )}
        {fanlinks.youtube && (
          <a
            href={fanlinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 p-3 rounded-xl text-center font-semibold"
          >
            Watch on YouTube
          </a>
        )}
        {fanlinks.lastfm && (
          <a
            href={fanlinks.lastfm}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-600 hover:bg-yellow-700 p-3 rounded-xl text-center font-semibold"
          >
            View on Last.fm
          </a>
        )}
      </div>

      <footer className="mt-10 text-gray-500 text-sm text-center">
        © 2025 <a href="https://singnify.com" className="hover:underline">Singnify.com</a>. All rights reserved.
      </footer>
    </div>
  );
}
