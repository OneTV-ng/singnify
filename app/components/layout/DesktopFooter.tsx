"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function AppFooter() {
  return (
<footer className="ml-0 md:ml-[135px] relative border-t border-blue-500/20 bg-slate-950 text-slate-300">
      {/* subtle background glow */}
      <div className=" pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        {/* Top grid */}
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://singnify.com/assets/img/icon-large.png"
                alt="Singnify"
                width={160}
                height={70}
                priority
              />
           
            </Link>

            <p className="mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
              A global music streaming and distribution platform empowering
              artists to reach international audiences and grow sustainably.
            </p>

            {/* Store buttons */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <StoreBadge
                href="https://play.google.com/store/apps/details?id=com.nextxtar.app"
                src="https://singnify.com/assets/images/google-play.svg"
                alt="Google Play"
              />
              <StoreBadge
                href="https://apps.apple.com/app/id1544401047"
                src="https://singnify.com/assets/images/app-store.svg"
                alt="App Store"
              />
            </div>
          </div>

          {/* Columns */}
          <FooterColumn
            title="Resources"
            links={[
              { label: "Artists", href: "/discover/artists" },
              { label: "Top Charts", href: "/discover/charts" },
              { label: "Genres", href: "/discover/genres" },
              { label: "Press", href: "/press" },
              { label: "About Us", href: "/about" },
              { label: "Sign In", href: "/signin" },
              { label: "Sign Up", href: "/signup" },
            ]}
          />

          <FooterColumn
            title="Your Singnify"
            links={[
              { label: "Profile", href: "/member/profile" },
              { label: "Albums", href: "/artist/songs#albums" },
              { label: "Tracks", href: "/artist/songs#tracks" },
              { label: "Playlists", href: "/artist/songs#playlist" },
              { label: "Liked", href: "/artist/songs#liked" },
              { label: "Following", href: "/artist/songs#following" },
            ]}
          />

          <FooterColumn
            title="Help"
            links={[
              { label: "FAQ", href: "/faq" },
              { label: "Support", href: "/support" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms" },
              {
                label: "Distribution & Licensing",
                href: "/publishing-licensing",
              },
            ]}
          />
        </div>

        {/* QR section */}
        <div className="mt-20 grid gap-10 md:grid-cols-2">
          <QRCard
            label="Android App"
            src="https://singnify.com/assets/img/android-qr.jpeg"
          />
          <QRCard
            label="iOS App"
            src="https://singnify.com/assets/img/ios-qr.jpeg"
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-blue-500/20 pt-8 md:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Singnify. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <SocialIcon
              href="https://www.facebook.com/singnifymusic/"
              icon={<Facebook size={18} />}
            />
            <SocialIcon
              href="https://twitter.com/Singnify"
              icon={<Twitter size={18} />}
            />
            <SocialIcon
              href="https://www.instagram.com/Singnify"
              icon={<Instagram size={18} />}
            />
            <SocialIcon
              href="https://www.youtube.com/channel/UChgNR3asChkPAYs0KKPMi3Q"
              icon={<Youtube size={18} />}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- sub components ---------- */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h4>
      <ul className="space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="transition-colors hover:text-cyan-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QRCard({ label, src }: { label: string; src: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-blue-500/20 bg-slate-900 p-6 shadow-lg hover:border-cyan-400/50 transition">
      <Image src={src} alt={label} width={220} height={220} />
      <span className="mt-4 text-sm font-medium text-white">{label}</span>
    </div>
  );
}

function SocialIcon({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-blue-500/20 p-2 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-400 hover:shadow hover:shadow-cyan-500/20"
    >
      {icon}
    </a>
  );
}

function StoreBadge({
  href,
  src,
  alt,
}: {
  href: string;
  src: string;
  alt: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block transition hover:scale-105 hover:drop-shadow-lg"
    >
      <Image src={src} alt={alt} width={150} height={44} />
    </a>
  );
}
