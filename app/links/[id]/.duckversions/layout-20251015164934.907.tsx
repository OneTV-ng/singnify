// app/links/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artist Fanlinks | Singnify",
  description: "Discover and stream your favorite artists across Spotify, Apple Music, YouTube, and more.",
  openGraph: {
    title: "Singnify Fanlinks",
    description: "Official artist links and info across all major streaming platforms.",
    siteName: "Singnify",
    type: "website",
    url: "https://singnify.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Singnify Fanlinks",
    description: "Find all official artist streaming links in one place.",
  },
  metadataBase: new URL("https://singnify.com"),
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        {children}
      </body>
    </html>
  );
}
