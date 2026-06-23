"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import skiData from "../data/skigebiete.json";
import { kiBild, kiText } from "../lib/kreativ";

async function fetchTemperaturen(lat: number, lng: number, bergHoehe: number) {
  const talHoehe = Math.max(800, bergHoehe - 800);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m&elevation=${bergHoehe}&temperature_unit=celsius&forecast_days=1`;
  const urlTal = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m&elevation=${talHoehe}&temperature_unit=celsius&forecast_days=1`;
  const [bergRes, talRes] = await Promise.all([fetch(url), fetch(urlTal)]);
  const [bergData, talData] = await Promise.all([bergRes.json(), talRes.json()]);
  return {
    berg: Math.round(bergData.current.temperature_2m),
    tal: Math.round(talData.current.temperature_2m),
  };
}

const icon = L.divIcon({
  html: "📍",
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

type Gebiet = (typeof skiData.gebiete)[0];

function flagge(land: string) {
  if (land.includes("Österreich")) return "🇦🇹";
  if (land.includes("Schweiz") && land.includes("Frankreich")) return "🇨🇭🇫🇷";
  if (land.includes("Schweiz")) return "🇨🇭";
  if (land.includes("Frankreich")) return "🇫🇷";
  if (land.includes("Italien")) return "🇮🇹";
  return "🏳️";
}

function KarteSchliessen({ onClose }: { onClose: () => void }) {
  useMapEvents({ click: onClose });
  return null;
}

export default function SkiMap() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Gebiet | null>(null);
  const [bilder, setBilder] = useState<(string | null)[]>([null, null]);
  const [laedt, setLaedt] = useState(false);
  const [temp, setTemp] = useState<{ berg: number; tal: number } | null>(null);
  const [slogan, setSlogan] = useState<string | null>(null);
  const [aktivBild, setAktivBild] = useState(0);

  // Automatisch zwischen Bild 1 und 2 wechseln
  useEffect(() => {
    if (!bilder[0] && !bilder[1]) return;
    const timer = setInterval(() => {
      setAktivBild((v) => (v === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, [bilder]);

  function zuruecksetzen() {
    setAusgewaehlt(null);
    setBilder([null, null]);
    setSlogan(null);
    setTemp(null);
    setAktivBild(0);
  }

  async function markerKlick(g: Gebiet) {
    setAusgewaehlt(g);
    setBilder([null, null]);
    setTemp(null);
    setSlogan(null);
    setAktivBild(0);
    setLaedt(true);

    fetchTemperaturen(g.lat, g.lng, g.hoeheMeter).then(setTemp).catch(() => {});
    kiText(
      `Schreib einen kurzen, mitreißenden Werbe-Slogan (max. 12 Wörter) für das Skigebiet "${g.name}" in ${g.land}. Highlight: ${g.highlight}. Der Slogan soll zum Reiseveranstalter E&P Reisen passen – jung, energetisch, budgetbewusst aber hochwertig. Nur den Slogan, ohne Anführungszeichen.`
    ).then(setSlogan).catch(() => {});

    // Beide Bilder parallel laden
    const [bergBild, apresSkiBild] = await Promise.allSettled([
      kiBild(`Beeindruckende Bergsicht auf das Skigebiet ${g.name} in ${g.land}, schneebedeckte Gipfel, blauer Winterhimmel, Panorama`),
      kiBild(`Junge fröhliche Menschen beim Après-Ski in ${g.name} in ${g.land}, typische Bergbar-Atmosphäre, Winterkleidung, realistisch, lebendig`),
    ]);
    setBilder([
      bergBild.status === "fulfilled" ? bergBild.value : null,
      apresSkiBild.status === "fulfilled" ? apresSkiBild.value : null,
    ]);
    setLaedt(false);
  }

  const bildLabels = ["🏔️ Bergsicht", "🎉 Après-Ski"];

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
        <KarteSchliessen onClose={zuruecksetzen} />
        {skiData.gebiete.filter((g) => g.id !== "soelden" && g.id !== "hintertux").map((g) => (
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
          {/* Bild-Slider */}
          <div className="relative h-44 bg-ice flex items-center justify-center overflow-hidden">
            {laedt && !bilder[0] && !bilder[1] && (
              <p className="text-sm text-brand animate-pulse">🎨 KI malt gerade…</p>
            )}
            {bilder.map((b, i) =>
              b ? (
                <img
                  key={i}
                  src={b}
                  alt={bildLabels[i]}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                  style={{ opacity: aktivBild === i ? 1 : 0 }}
                />
              ) : null
            )}
            {!laedt && !bilder[0] && !bilder[1] && (
              <span className="text-4xl">🏔️</span>
            )}
            {/* Label */}
            {(bilder[0] || bilder[1]) && (
              <span className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white">
                {bildLabels[aktivBild]}
              </span>
            )}
            {/* Punkte */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              {[0, 1].map((i) => (
                <button
                  key={i}
                  onClick={() => setAktivBild(i)}
                  className={`h-2 w-2 rounded-full transition-all ${aktivBild === i ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </div>

          <div className="p-5">
            <button
              className="absolute right-3 top-3 text-white/80 hover:text-white text-lg"
              onClick={zuruecksetzen}
            >
              ✕
            </button>
            <h2 className="pr-6 text-lg font-black text-night">{ausgewaehlt.name}</h2>
            <p className="mt-1 text-sm font-medium text-brand">{flagge(ausgewaehlt.land)} {ausgewaehlt.land}</p>
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
            {temp ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                  <div className="text-xl font-black text-night">{temp.berg}°C</div>
                  <div className="text-xs text-night/60">🏔️ Bergstation</div>
                </div>
                <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
                  <div className="text-xl font-black text-night">{temp.tal}°C</div>
                  <div className="text-xs text-night/60">🏘️ Talstation</div>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-night/40 animate-pulse">🌡️ Temperaturen werden geladen…</p>
            )}
            {slogan ? (
              <p className="mt-3 rounded-lg bg-brand px-3 py-2 text-center text-sm font-bold italic text-white">
                „{slogan}"
              </p>
            ) : (
              <p className="mt-3 text-xs text-night/40 animate-pulse">✍️ KI schreibt Slogan…</p>
            )}
            <p className="mt-2 text-sm text-night/70">✨ {ausgewaehlt.highlight}</p>
          </div>
        </div>
      )}
    </div>
  );
}
