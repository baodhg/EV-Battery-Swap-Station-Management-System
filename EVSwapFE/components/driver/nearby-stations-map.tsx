"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { API_BASE_URL } from "@/lib/config";

// Fix icon default của Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});

const stationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

export default function NearbyStationsMap() {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserPosition([lat, lng]);

          try {
            const res = await fetch(
              `${API_BASE_URL}/api/stations/nearby?lat=${lat}&lng=${lng}&radiusKm=5`
            );
            const data = await res.json();
            setStations(data);
          } catch (err) {
            console.error("Error fetching stations:", err);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Unable to get location:", err);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, [mounted]);

  if (!mounted || loading) return <p className="text-center">Loading map...</p>;
  if (!userPosition) return <p>Unable to determine your location.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">📍 Nearby EV Stations</h2>

      <MapContainer
        center={userPosition}
        zoom={13}
        style={{ height: "1000px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        <Marker position={userPosition} icon={userIcon}>
          <Popup>🧍 You are here</Popup>
        </Marker>

        {stations.map((s) => (
          <Marker
            key={s.stationID}
            position={[s.latitude, s.longitude]}
            icon={stationIcon}
          >
            <Popup>
              <b>{s.stationName}</b>
              <br />
              {s.address}
              <br />
              ⚡ {s.distanceKm?.toFixed(2)} km
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}