"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import skiData from "../data/skigebiete.json";

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
        <KarteSchliessen onClose={() => setAusgewaehlt(null)} />
        {skiData.gebiete.map((g) => (
          <Marker
            key={g.id}
            position={[g.lat, g.lng]}
            icon={icon}
            eventHandlers={{ click: () => setAusgewaehlt(g) }}
          />
        ))}
      </MapContainer>

      {ausgewaehlt && (
        <div className="absolute bottom-6 left-1/2 z-[1000] w-80 -translate-x-1/2 rounded-2xl bg-white p-5 shadow-xl">
          <button
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
            onClick={() => setAusgewaehlt(null)}
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
      )}
    </div>
  );
}
