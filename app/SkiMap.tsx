"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import skiData from "../data/skigebiete.json";
import { kiBild } from "../lib/kreativ";

const icon = L.divIcon({
  html: "📍",
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

type Gebiet = (typeof skiData.gebiete)[0];

function KarteSchliessen({ onClose }: { onClose: () => void }) {
  useMapEvents({ click: onClose });
  return null;
}

export default function SkiMap() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Gebiet | null>(null);
  const [bild, setBild] = useState<string | null>(null);
  const [laedt, setLaedt] = useState(false);

  async function markerKlick(g: Gebiet) {
    setAusgewaehlt(g);
    setBild(null);
    setLaedt(true);
    try {
      const url = await kiBild(
        `Beeindruckende Bergsicht auf das Skigebiet ${g.name} in ${g.land}, schneebedeckte Gipfel, blauer Winterhimmel, Panorama`
      );
      setBild(url);
    } catch {
      // Kein Bild — kein Problem, wir zeigen einfach die Infos
    } finally {
      setLaedt(false);
    }
  }

  return (
    <div className="relative" style={{ height: "calc(100vh - 80px)" }}>
      <MapContainer
        center={[46.5, 10.5]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        <KarteSchliessen onClose={() => { setAusgewaehlt(null); setBild(null); }} />
        {skiData.gebiete.map((g) => (
          <Marker
            key={g.id}
            position={[g.lat, g.lng]}
            icon={icon}
            eventHandlers={{ click: () => markerKlick(g) }}
          />
        ))}
      </MapContainer>

      {ausgewaehlt && (
        <div className="absolute bottom-6 left-1/2 z-[1000] w-80 -translate-x-1/2 rounded-2xl bg-white shadow-xl overflow-hidden">
          {/* KI-Bild */}
          <div className="h-40 bg-ice flex items-center justify-center">
            {laedt && (
              <p className="text-sm text-brand animate-pulse">🎨 KI malt gerade…</p>
            )}
            {bild && (
              <img src={bild} alt={ausgewaehlt.name} className="h-full w-full object-cover" />
            )}
            {!laedt && !bild && (
              <span className="text-4xl">🏔️</span>
            )}
          </div>

          <div className="p-5">
            <button
              className="absolute right-3 top-3 text-white/80 hover:text-white text-lg"
              onClick={() => { setAusgewaehlt(null); setBild(null); }}
            >
              ✕
            </button>
            <h2 className="pr-6 text-lg font-black text-night">{ausgewaehlt.name}</h2>
            <p className="mt-1 text-sm font-medium text-brand">{ausgewaehlt.land}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-ice px-3 py-2 text-center">
                <div className="text-xl font-black text-night">{ausgewaehlt.pistenKm}</div>
                <div className="text-xs text-night/60">Pisten-km</div>
              </div>
              <div className="rounded-lg bg-ice px-3 py-2 text-center">
                <div className="text-xl font-black text-night">{ausgewaehlt.hoeheMeter}</div>
                <div className="text-xs text-night/60">Höhe (m)</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-night/70">✨ {ausgewaehlt.highlight}</p>
          </div>
        </div>
      )}
    </div>
  );
}
