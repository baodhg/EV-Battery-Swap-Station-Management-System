"use client";

import React, { useEffect, useMemo, useState } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl";
import type { ViewState } from "react-map-gl";
import type { Feature, LineString } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { API_BASE_URL } from "@/lib/config";
import { Navigation, Zap } from "lucide-react";

type Station = {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  distanceKm?: number;
};

const normalizeStation = (item: any): Station => {
  const distanceValue = typeof item.distanceKm === "number" ? item.distanceKm : undefined;
  return {
    id: item.stationID?.toString() || Math.random().toString(),
    name: item.stationName || "Unknown Station",
    address: item.address || "No address",
    latitude: Number(item.latitude) || 0,
    longitude: Number(item.longitude) || 0,
    distanceKm: distanceValue,
  };
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

const STUDENT_CULTURAL_HOUSE: Coordinates = {
  latitude: 10.8751312,
  longitude: 106.798143,
};

type NearbyStationsMapProps = {
  onForceCenter?: boolean;
  stations?: Station[];
  selectedStationId?: string | number | null;
  onStationSelect?: (station: Station | null) => void;
};

export default function NearbyStationsMap({
  onForceCenter,
  stations: externalStations,
  selectedStationId,
  onStationSelect,
}: NearbyStationsMapProps) {
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [mounted, setMounted] = useState(false);
  const [userPosition] = useState<Coordinates>(STUDENT_CULTURAL_HOUSE);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: STUDENT_CULTURAL_HOUSE.latitude,
    longitude: STUDENT_CULTURAL_HOUSE.longitude,
    zoom: 13,
    bearing: -20,
    pitch: 45,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [internalStations, setInternalStations] = useState<Station[]>([]);
  const stations = externalStations ?? internalStations;
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [routeFeature, setRouteFeature] = useState<Feature<LineString> | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
    if (onForceCenter) {
      setViewState((prev) => ({
        ...prev,
        latitude: STUDENT_CULTURAL_HOUSE.latitude,
        longitude: STUDENT_CULTURAL_HOUSE.longitude,
        zoom: 15,
        bearing: prev.bearing ?? -20,
        pitch: prev.pitch ?? 45,
      }));
    }
  }, [onForceCenter]);

  useEffect(() => {
    if (!mounted || externalStations) return;

    const controller = new AbortController();
    const fetchStations = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/stations/nearby?lat=${userPosition.latitude}&lng=${userPosition.longitude}&radiusKm=5`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`Failed to load stations (${res.status})`);
        }

        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : [])
          .map((item) => normalizeStation(item))
          .filter((station) => station.name && station.address && station.latitude && station.longitude);
        setInternalStations(normalized);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.warn("Error fetching stations:", err);
        }
      }
    };

    fetchStations();

    return () => {
      controller.abort();
    };
  }, [externalStations, mounted, userPosition]);

  useEffect(() => {
    if (selectedStation && !stations.some((s) => s.id === selectedStation.id)) {
      setSelectedStation(null);
      onStationSelect?.(null);
    }
  }, [onStationSelect, selectedStation, stations]);

  useEffect(() => {
    if (!selectedStationId) {
      if (selectedStation) {
        setSelectedStation(null);
        onStationSelect?.(null);
      }
      return;
    }

    if (selectedStation?.id === selectedStationId) {
      return;
    }

    const match = stations.find((s) => s.id === selectedStationId);
    if (match) {
      setSelectedStation(match);
      onStationSelect?.(match);
      setViewState((prev) => ({
        ...prev,
        latitude: match.latitude,
        longitude: match.longitude,
      }));
    }
  }, [onStationSelect, selectedStation, selectedStationId, stations]);

  const buildLineFeature = useMemo(() => {
    return (
      driver: Coordinates,
      station: Station
    ): Feature<LineString> => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [driver.longitude, driver.latitude],
          [station.longitude, station.latitude],
        ],
      },
      properties: {
        mode: "direct",
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedStation || !userPosition || !MAPBOX_TOKEN) {
      setRouteFeature(null);
      return;
    }

    const controller = new AbortController();
    const fallbackRoute = buildLineFeature(userPosition, selectedStation);
    setRouteFeature(fallbackRoute);

    const fetchRoute = async () => {
      try {
        const params = new URLSearchParams({
          geometries: "geojson",
          access_token: MAPBOX_TOKEN,
        });

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userPosition.longitude},${userPosition.latitude};${selectedStation.longitude},${selectedStation.latitude}?${params.toString()}`;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Directions request failed: ${response.status}`);
        }

        const data = await response.json();
        const coordinates: unknown = data?.routes?.[0]?.geometry?.coordinates;

        if (
          Array.isArray(coordinates) &&
          coordinates.every(
            (point) =>
              Array.isArray(point) &&
              point.length === 2 &&
              point.every((value) => typeof value === "number")
          )
        ) {
          setRouteFeature({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coordinates as [number, number][],
            },
            properties: {
              mode: "mapbox-driving",
            },
          });
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.warn("Failed to fetch driving directions", err);
        }
      }
    };

    fetchRoute();

    return () => controller.abort();
  }, [MAPBOX_TOKEN, buildLineFeature, selectedStation, userPosition]);

  if (!mounted) {
    return null;
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-6 rounded-xl border border-red-200 bg-red-50 text-red-700">
        <p>Missing `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`.</p>
        <p className="text-sm mt-2">
          Please add your Mapbox token to the environment file and restart the
          app.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border border-slate-200 bg-white/80">
      <div className="pl-4 pt-4 pb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span role="img" aria-label="pin">
            📍
          </span>
          Nearby Battery Stations
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a station to see a quick route preview from Mapbox.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Using Student Cultural House (Thu Duc City) as your current location.
        </p>
      </div>
      <div className="flex-1 min-h-[600px]">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: "100%", height: "100%" }}
          onClick={() => {
            setSelectedStation(null);
            onStationSelect?.(null);
          }}
        >
          <NavigationControl position="bottom-right" />

          {userPosition && (
            <Marker
              latitude={userPosition.latitude}
              longitude={userPosition.longitude}
              anchor="center"
            >
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" />
              </div>
            </Marker>
          )}

          <Marker
            latitude={STUDENT_CULTURAL_HOUSE.latitude}
            longitude={STUDENT_CULTURAL_HOUSE.longitude}
            anchor="center"
          >
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" />
              <span className="sr-only">Student Cultural House</span>
            </div>
          </Marker>

          {stations.map((station) => {
            const isSelected = selectedStation?.id === station.id;
            return (
              <Marker
                key={station.id}
                latitude={station.latitude}
                longitude={station.longitude}
                anchor="bottom"
              >
                <button
                  type="button"
                  aria-label={`Select ${station.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedStation(station);
                    onStationSelect?.(station);
                    setViewState((prev) => ({
                      ...prev,
                      latitude: station.latitude,
                      longitude: station.longitude,
                    }));
                  }}
                  className="relative focus:outline-none"
                >
                  {isSelected && (
                    <span className="absolute -inset-1 rounded-full bg-blue-200/50 blur-md" />
                  )}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-md transition ${
                      isSelected ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"
                    }`}
                  >
                    <Zap size={18} />
                  </div>
                </button>
              </Marker>
            );
          })}

          {routeFeature && (
            <Source id="selected-station-route" type="geojson" data={routeFeature}>
              <Layer
                id="selected-station-route-line"
                type="line"
                paint={{
                  "line-color": "#2563eb",
                  "line-width": 5,
                  "line-opacity": 0.85,
                }}
              />
            </Source>
          )}

          {selectedStation && (
            <Popup
              latitude={selectedStation.latitude}
              longitude={selectedStation.longitude}
              closeButton={false}
              closeOnClick={false}
              offset={25}
            >
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-slate-900">
                  {selectedStation.name}
                </p>
                <p className="text-slate-600">{selectedStation.address}</p>
                {typeof selectedStation.distanceKm === "number" && (
                  <p className="text-xs text-slate-500">
                    Approximately {selectedStation.distanceKm.toFixed(2)} km away
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setViewState((prev) => ({
                      ...prev,
                      latitude: selectedStation.latitude,
                      longitude: selectedStation.longitude,
                      zoom: Math.max(prev.zoom, 14),
                    }));
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 transition"
                >
                  <Navigation className="h-3 w-3" />
                  Get directions
                </button>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}