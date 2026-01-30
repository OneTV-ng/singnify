"use client";
import { useEffect, useState } from "react";

interface ClientRadioControlsProps {
  streamUrl: string;
  initialTheme?: "dark" | "light";
}

export default function ClientRadioControls({
  streamUrl,
  initialTheme = "dark",
}: ClientRadioControlsProps) {
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  const [track, setTrack] = useState({ title: "Live DJ", sub: "Singnify Radio • Global Stream" });

  useEffect(() => {
    const saved = localStorage.getItem("singcast-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
    else setTheme("light");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("singcast-theme", theme);
  }, [theme]);

  // Poll ICY metadata every 15 seconds
  useEffect(() => {
    async function fetchIcy() {
      try {
        const res = await fetch("/api/icy-meta");
        const data = await res.json();
        if (data.title) setTrack({ title: data.title, sub: `${data.name} • ${data.genre}` });
      } catch (err) {
        console.warn("ICY fetch failed:", err);
      }
    }

    fetchIcy(); // initial fetch
    const interval = setInterval(fetchIcy, 15000); // every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <button
        aria-label="Toggle theme"
        className="self-start px-3 py-1 rounded-lg border border-gray-400 text-gray-300 hover:bg-gray-700 transition"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      <audio
        controls
        preload="none"
        className="w-full rounded-lg bg-gray-900"
        src={streamUrl}
      >
        Your browser does not support the audio element. Listen directly:{" "}
        <a href={streamUrl}>{streamUrl}</a>
      </audio>

      <div className="mt-2">
        <strong className="block text-lg text-teal-400">{track.title}</strong>
        <span className="block text-sm text-gray-400">{track.sub}</span>
      </div>
    </div>
  );
}
