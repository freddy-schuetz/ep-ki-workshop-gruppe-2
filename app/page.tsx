"use client";

import dynamic from "next/dynamic";

const SkiMap = dynamic(() => import("./SkiMap"), { ssr: false });

const FLOCKEN = ["❄️", "🌨️", "❄️", "❄️", "🌨️", "❄️", "❄️", "🌨️", "❄️", "❄️"];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-snow">
      {/* Schneeflocken */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {FLOCKEN.map((f, i) => (
          <span
            key={i}
            className="absolute animate-bounce text-xl opacity-60"
            style={{
              left: `${(i * 11) % 100}%`,
              top: `${(i * 17) % 40}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Header */}
      <header className="bg-brand px-6 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5">
            <span className="text-2xl font-black text-brand">E</span>
            <span className="text-2xl font-black text-brand-accent">&amp;</span>
            <span className="text-2xl font-black text-brand">P</span>
            <span className="ml-1 text-xs font-semibold text-night/60 leading-tight">
              Reisen<br />Events
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">📍 E&amp;P Skigebiete</h1>
            <p className="text-xs text-white/70">Klick auf einen Marker für alle Infos</p>
          </div>
          <p className="text-xs font-bold text-white/70 text-right">
            Viel Schnee<br />für wenig Flocken
          </p>
        </div>
      </header>

      <div className="flex-1">
        <SkiMap />
      </div>
    </main>
  );
}
