"use client";

import dynamic from "next/dynamic";

const SkiMap = dynamic(() => import("./SkiMap"), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="p-4 text-center">
        <h1 className="text-3xl font-black text-night">📍 E&amp;P Skigebiete</h1>
      </header>
      <div className="flex-1">
        <SkiMap />
      </div>
    </main>
  );
}
