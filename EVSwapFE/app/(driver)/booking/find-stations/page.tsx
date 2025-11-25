"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, Filter, Zap, Loader2 } from "lucide-react"
import { BookingHeader } from "@/components/shared/booking-header"
import { API_BASE_URL } from "@/lib/config"

interface Station {
  id: string
  name: string
  address: string
  available: number
  total: number
  time: string
  distance: string
  price: number
  rating: number
  status: "open" | "maintenance" | "closed"
}

// Fetcher vá»›i authentication token
const fetcher = async (url: string) => {
  const token = localStorage.getItem("token")

  console.log("Fetching:", url)
  console.log("Token exists:", !!token)

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  console.log("Response status:", res.status)

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} - ${res.statusText}`)
  }

  const data = await res.json()
  console.log("Raw data from API:", data)

  // Transform data tá»« backend format sang Station interface
  return data.map((item: any) => ({
    id: item.stationID?.toString() || Math.random().toString(),
    name: item.stationName || "Unknown Station",
    address: item.address || "No address",
    available: item.availableSlots || 5,
    total: item.totalSlots || 10,
    time: item.operatingHours || "24/7",
    distance: `${item.distanceKm?.toFixed(1) || 0} km`,
    price: item.pricePerSwap || 5,
    rating: item.rating || 4.5,
    status: (item.status?.toLowerCase() || "open") as "open" | "maintenance" | "closed",
  }))
}

const DEFAULT_LOCATION = {
  lat: 10.8751312,
  lng: 106.798143,
}

export default function FindStationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [MapComponent, setMapComponent] = useState<any>(null)
  const [userLocation] = useState(DEFAULT_LOCATION)
  const [radiusKm, setRadiusKm] = useState(5)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  // Load map component
  useEffect(() => {
    const loadMap = async () => {
      try {
        const module = await import("@/components/driver/nearby-stations-map")
        setMapComponent(() => module.default)
      } catch (err) {
        console.error("Failed to load map:", err)
      }
    }
    loadMap()
  }, [])

  // Build API URL
  const apiUrl = `${API_BASE_URL}/api/stations/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radiusKm=${radiusKm}`

  // Fetch stations vá»›i authentication
  const {
    data: stations = [],
    isLoading,
    error,
    mutate,
  } = useSWR<Station[]>(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    onError: (err) => {
      console.error("SWR Error:", err)
    },
  })

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showFilterMenu && !target.closest("button")) {
        setShowFilterMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showFilterMenu])

  const filteredStations = stations
    .filter((s) => s.name && s.address)
    .filter(
      (station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <>
      <BookingHeader title="Find Stations" />

      <div className="flex-1 overflow-auto">
        <div className="flex gap-6 p-8 h-full">
          {/* Map Section - grows with content */}
          <div className="flex-1 min-h-[700px]">
            <Card className="border-0 shadow-lg overflow-hidden h-full p-0">
              {MapComponent ? (
                <div className="h-full">
                  <MapComponent onForceCenter />
                </div>
              ) : (
                <div className="p-4 text-gray-500">Loading map...</div>
              )}
            </Card>
          </div>

          {/* Stations List */}
          <div className="w-[420px] max-w-full flex flex-col shrink-0">

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3 relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent relative"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <Filter className="w-4 h-4" />
                  Filter: {radiusKm}km
                </Button>

                {/* Filter Dropdown Menu */}
                {showFilterMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[180px]">
                    <div className="text-xs font-semibold text-gray-700 mb-2 px-2">Distance Radius</div>
                    {[2, 5, 10, 20].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => {
                          setRadiusKm(radius)
                          setShowFilterMenu(false)
                          mutate() // Refresh data with new radius
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                          radiusKm === radius ? "bg-[#A2F200] text-black font-semibold" : "text-gray-700"
                        }`}
                      >
                        Within {radius}km
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">
                {isLoading ? "Loading stations..." : `Available Stations (${filteredStations.length})`}
              </h3>
                <p className="text-xs text-gray-500">Using Student Cultural House as your location</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  <strong>Failed to load stations</strong>
                  <p className="mt-1 text-xs">{error.message}</p>
                  <Button variant="outline" size="sm" onClick={() => mutate()} className="mt-2">
                    Try Again
                  </Button>
                </div>
              )}

              {isLoading && (
                <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading stations...
                </div>
              )}

              {!isLoading && filteredStations.length === 0 && !error && (
                <div className="p-4 text-center text-gray-500">No stations found within {radiusKm}km</div>
              )}

              {filteredStations.map((station) => (
                <Card key={station.id} className="p-4 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{station.name}</h4>
                      <p className="text-xs text-gray-500">{station.address}</p>
                    </div>
                    {station.status === "open" && (
                      <span className="px-2 py-1 bg-[#A2F200] text-black text-xs rounded font-medium">open</span>
                    )}
                    {station.status === "maintenance" && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded font-medium">maintenance</span>
                    )}
                    {station.status === "closed" && (
                      <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded font-medium">closed</span>
                    )}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Zap className="w-3 h-3 text-[#A2F200]" />
                      <span className="text-gray-700">
                        {station.available}/{station.total} available
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{station.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{station.distance}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-[#A2F200] text-black hover:bg-[#8fd600] h-7 px-4 text-xs"
                      onClick={() => {
                        // Store station info in localStorage for swap page
                        localStorage.setItem("selectedStation", JSON.stringify(station))
                        window.location.href = "/booking/swap"
                      }}
                    >
                      Reserve
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
