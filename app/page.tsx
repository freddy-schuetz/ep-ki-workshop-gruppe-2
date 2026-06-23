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
      <header className="bg-brand px-6 py-4 text-center shadow-md">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">
          Viel Schnee für wenig Flocken · #schneesüchtig
        </p>
        <h1 className="mt-1 text-3xl font-black text-white">
          📍 E&amp;P Skigebiete
        </h1>
        <p className="mt-1 text-sm text-white/80">
          Klick auf einen Marker für alle Infos
        </p>
      </header>

      <div className="flex-1">
        <SkiMap />
      </div>
    </main>
  );
}
