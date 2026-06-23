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
          <img
            src="https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=100063511363168"
            alt="E&P Reisen Logo"
            className="h-12 w-12 rounded-lg object-contain bg-white p-1"
          />
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
