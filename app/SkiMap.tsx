"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
    </MapContainer>
  );
}
