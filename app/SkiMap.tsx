"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import skiData from "../data/skigebiete.json";

// Leaflet-Standard-Icon-Fix für Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function SkiMap() {
  return (
    <MapContainer
      center={[46.5, 10.5]}
      zoom={6}
      style={{ height: "calc(100vh - 80px)", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      {skiData.gebiete.map((g) => (
        <Marker key={g.id} position={[g.lat, g.lng]} icon={icon}>
          <Popup>
            <strong>{g.name}</strong>
            <br />
            {g.land}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
