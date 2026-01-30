"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Music,
  Globe,
  Users,
  Award,
  Star,
  Menu,
  X,
  ChevronRight,
  Mail,
  Smartphone,
  Volume2,
  Headphones,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SingnifyLanding() {
  const { status } = useSession();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (status === "authenticated") router.push("/home");
  }, [status, router]);

  const heroTexts = [
    { title: "Distribute Your Music Worldwide", sub: "100+ global platforms" },
    { title: "Keep 100% Ownership", sub: "Your rights stay yours" },
    { title: "Promote Like a Pro", sub: "Built for modern artists" },
  ];

  useEffect(() => {
    const i = setInterval(
      () => setTextIndex((p) => (p + 1) % heroTexts.length),
      4000
    );
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
        
            <img
              src="https://singnify.com/assets/img/icon-large.png"
              alt="Singnify"
              className="h-8"
            />
          </div>

          <div className="hidden md:flex gap-8 items-center">
            {["Services", "Features", "Contact"].map((i) => (
              <a
                key={i}
                href={`#${i.toLowerCase()}`}
                className="text-slate-300 hover:text-cyan-400 transition"
              >
                {i}
              </a>
            ))}
            <Link
              href="/signin"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 font-semibold"
            >
              Sign In
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenu((s) => !s)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>

        {menu && (
          <div className="md:hidden bg-slate-950 border-t border-blue-500/20 px-6 py-6 space-y-4">
            {["Services", "Features", "Contact"].map((i) => (
              <a
                key={i}
                href={`#${i.toLowerCase()}`}
                className="block text-slate-300"
                onClick={() => setMenu(false)}
              >
                {i}
              </a>
            ))}
            <Link
              href="/signin"
              className="block text-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-950 to-violet-900/50" />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Singnify
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold mb-3 transition-all">
            {heroTexts[textIndex].title}
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            {heroTexts[textIndex].sub}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className="px-10 py-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition"
            >
              Start Free <ChevronRight />
            </Link>

            <button className="px-10 py-5 rounded-full border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 transition flex items-center gap-2">
              <Play /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "Global Distribution" },
              { icon: Award, title: "100% Rights" },
              { icon: Volume2, title: "Music Promotion" },
              { icon: Users, title: "Industry Access" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-8 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20 transition"
              >
                <s.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="font-bold text-xl">{s.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            Why Artists Choose{" "}
            <span className="text-cyan-400">Singnify</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              "100+ Stores",
              "Unlimited Uploads",
              "Fast Royalties",
              "Mobile Apps",
              "Publishing",
              "Licensing",
              "Executives",
              "Label Partners",
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-slate-800/50 border border-blue-500/20 rounded-xl p-5 hover:border-cyan-400/60 transition"
              >
                <Star className="text-cyan-400 w-5 h-5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 bg-slate-900 text-center">
        <h2 className="text-5xl font-bold mb-8">
          Start Your <span className="text-cyan-400">Music Journey</span>
        </h2>
        <button className="px-12 py-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 font-bold text-lg flex items-center gap-3 mx-auto hover:scale-105 transition">
          <Mail /> Contact Us
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-blue-500/20 text-center text-slate-400">
        © 2026 Singnify. All rights reserved.
      </footer>
    </div>
  );
}
