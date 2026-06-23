"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import skiData from "../data/skigebiete.json";

const icon = L.divIcon({
  html: "📍",
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
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
