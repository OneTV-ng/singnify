
// ========================================
// FILE 2: app/links/[id]/FanLinkClient.tsx
// ========================================
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";


function firstCapitalize(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
// Platform configuration with FFM.to CDN logos
const PLATFORMS = [
  { 
    key: "spotify", 
    name: "Spotify", 
    logo: "https://assets.ffm.to/images/logo/music-service_spotify.png",
    color: "bg-[#1DB954]"
  },
  { 
    key: "apple_music", 
    name: "Apple Music", 
    logo: "https://assets.ffm.to/images/logo/music-service_applemusic_listen.png",
    color: "bg-[#fa57c1]"
  },
  { 
    key: "apple", 
    name: "Apple Music", 
    logo: "https://assets.ffm.to/images/logo/music-service_applemusic_listen.png",
    color: "bg-[#fa57c1]"
  },
  { 
    key: "itunes", 
    name: "iTunes Store", 
    logo: "https://assets.ffm.to/images/logo/music-service_itunes.png",
    color: "bg-[#fa57c1]"
  },
  { 
    key: "youtube_music", 
    name: "YouTube Music", 
    logo: "https://assets.ffm.to/images/logo/music-service_youtubemusic.png",
    color: "bg-[#FF0000]"
  },
  { 
    key: "youtube", 
    name: "YouTube", 
    logo: "https://assets.ffm.to/images/logo/music-service_youtube.png",
    color: "bg-[#FF0000]"
  },
  { 
    key: "deezer", 
    name: "Deezer", 
    logo: "https://assets.ffm.to/images/logo/music-service_deezer.png",
    color: "bg-[#a238ff]"
  },
  { 
    key: "tidal", 
    name: "Tidal", 
    logo: "https://assets.ffm.to/images/logo/music-service_tidal.png",
    color: "bg-black"
  },
  { 
    key: "audiomack", 
    name: "Audiomack", 
    logo: "https://assets.ffm.to/images/logo/music-service_audiomack.png",
    color: "bg-[#ffa400]"
  },
  { 
    key: "amazon_music", 
    name: "Amazon Music", 
    logo: "https://assets.ffm.to/images/logo/music-service_amazonmusic.png",
    color: "bg-[#FF9900]"
  },
  { 
    key: "amazon", 
    name: "Amazon Store", 
    logo: "https://assets.ffm.to/images/logo/music-service_amazon.png",
    color: "bg-[#FF9900]"
  },
  { 
    key: "soundcloud", 
    name: "SoundCloud", 
    logo: "https://assets.ffm.to/images/logo/music-service_soundcloud.png",
    color: "bg-[#FF5500]"
  },
  { 
    key: "pandora", 
    name: "Pandora", 
    logo: "https://assets.ffm.to/images/logo/music-service_pandora.png",
    color: "bg-[#3668ff]"
  },
];

interface FanLinkClientProps {
  songData: any;
  artist: string;
  title: string;
}

export default function FanLinkClient({ songData, artist, title }: FanLinkClientProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [dominantColor, setDominantColor] = useState("59, 130, 246");

  const { spotify, fanlinks } = songData;
  const coverImage = spotify?.album?.image || songData.album_cover || "https://singnify.com/assets/default-cover.jpg";
  
  // Get YouTube URL for preview
  const youtubeUrl = fanlinks?.youtube || fanlinks?.youtube_music || "";
  const youtubeId = youtubeUrl.includes("watch?v=") 
    ? youtubeUrl.split("watch?v=")[1]?.split("&")[0]
    : youtubeUrl.split("youtu.be/")[1]?.split("?")[0] || "";

  // Extract dominant color from image
  useEffect(() => {
    const extractColor = async () => {
      try {
        const img = document.createElement("img");
        img.crossOrigin = "Anonymous";
        img.src = coverImage;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let r = 0, g = 0, b = 0;

          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }

          const pixelCount = data.length / 4;
          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          setDominantColor(`${r}, ${g}, ${b}`);
        };
      } catch (err) {
        console.error("Color extraction failed:", err);
      }
    };

    extractColor();
  }, [coverImage]);

  const availablePlatforms = PLATFORMS.filter((p) => fanlinks?.[p.key]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 40%, rgba(${dominantColor}, 0.4), transparent 60%), radial-gradient(circle at 70% 60%, rgba(${dominantColor}, 0.3), transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <Image
          src={coverImage}
          alt="Background"
          fill
          className="object-cover blur-3xl opacity-20"
          priority
        />
      </div>

      {/* Fixed width centered container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Cover Picture with YouTube Preview */}
          <div 
            className="relative w-full h-60 bg-cover bg-center cursor-pointer group"
            style={{ backgroundImage: `url(${coverImage})` }}
            onMouseEnter={() => setShowVideo(true)}
            onMouseLeave={() => setShowVideo(false)}
          >
            {/* Play Triangle Overlay */}
            {!showVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-l-[40px] border-l-red-600 ml-2 drop-shadow-2xl transition-transform group-hover:scale-110" />
              </div>
            )}
            
            {/* YouTube Iframe */}
            {showVideo && youtubeId && (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          {/* Song Header */}
          <div className="bg-[#272525] text-white px-4 py-3 flex items-center gap-3">
            <Image
              src="https://app.singnify.com/images/icon-large.png"
              alt="Singnify Logo"
             width={130}
    height={0} // height will auto-scale based on intrinsic ratio
    className="h-auto w-auto max-w-[130px] object-contain"
            />
            <div>
              <p className="font-semibold text-base leading-tight">{firstCapitalize(title)}</p>
              <p className="text-xs text-gray-400">{firstCapitalize(artist)}</p>
            </div>
          </div>

          {/* Platform Links */}
          <ul className="divide-y divide-gray-200">
            {availablePlatforms.map((platform) => {
              const url = fanlinks?.[platform.key];
              return (
                <li 
                  key={platform.key}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <a 
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 flex-1"
                  >
                    <Image
                      src={platform.logo}
                      alt={`${platform.name} Logo`}
                    width={0}
    height={80} // height will auto-scale based on intrinsic ratio
  className="w-auto h-[80px] object-contain"                    />
                    <span className="text-sm font-medium text-gray-800 hidden sm:inline">
                      {/**platform.name*/}
                    </span>
                  </a>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 bg-white border border-gray-300 hover:bg-green-600 hover:text-white hover:border-green-600 text-gray-800 text-sm font-semibold rounded transition-colors"
                  >
                    Play
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-4 text-center text-xs text-gray-600">
            <p className="mb-2">
              By using this service you agree to our<br />
              <Link 
                href="https://singnify.com/terms" 
                className="text-gray-800 hover:underline"
              >
                Privacy Policy and Terms Of Use
              </Link>
            </p>
            <footer>
              <p>
                &copy; 2025{" "}
                <Link 
                  href="https://singnify.com" 
                  className="text-gray-800 hover:underline font-semibold"
                >
                  Singnify.com
                </Link>
                . All Rights Reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}