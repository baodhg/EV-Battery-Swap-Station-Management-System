"use client"

import { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Clock, Filter, Zap, Loader2, Navigation, Info } from "lucide-react"
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
  distanceKm: number
  latitude: number
  longitude: number
  contact?: string
  price: number
  rating: number
  status: "open" | "maintenance" | "closed"
}

type StationInventoryItem = {
  inventoryId: number
  inventoryStatus: string | null
  batteryId: number | string | null
  batteryName?: string | null
  batteryStatus?: string | null
  batteryType?: string | null
  capacity?: number | null
  model?: string | null
  usageCount?: number | null
  borrowStatus?: string | null
}

type StationInventoryResponse = {
  stationId: number
  stationName: string
  stationStatus: string | null
  totalSlots: number
  totalInventories: number
  statusCounters: Record<string, number>
  page: number
  size: number
  totalItems: number
  totalPages: number
  items: StationInventoryItem[]
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

  const searchParam = (() => {
    try {
      return new URL(url).searchParams.get("search")?.toLowerCase() ?? ""
    } catch {
      return ""
    }
  })()

  // Transform data tá»« backend format sang Station interface
  const mapped = data
    .map((item: any) => {
      const distanceValue = typeof item.distanceKm === "number" ? item.distanceKm : 0
      return {
        id: item.stationID?.toString() || Math.random().toString(),
        name: item.stationName || "Unknown Station",
        address: item.address || "No address",
        available: item.availableSlots || 5,
        total: item.totalSlots || 10,
        time: item.operatingHours || "24/7",
        distance: `${distanceValue.toFixed(1)} km`,
        distanceKm: distanceValue,
        latitude: Number(item.latitude) || 0,
        longitude: Number(item.longitude) || 0,
        contact: item.contact || item.phoneNumber || item.hotline,
        price: item.pricePerSwap || 5,
        rating: item.rating || 4.5,
        status: (item.status?.toLowerCase() || "open") as "open" | "maintenance" | "closed",
      }
    })
    .filter((station: Station) => station.name && station.address && station.latitude && station.longitude)

  if (!searchParam) {
    return mapped
  }

  return mapped.filter(
    (station: Station) =>
      station.name.toLowerCase().includes(searchParam) ||
      station.address.toLowerCase().includes(searchParam),
  )
}

const authorizedJsonFetcher = async (url: string) => {
  const token = localStorage.getItem("token")

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} - ${res.statusText}`)
  }

  return res.json()
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
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailStation, setDetailStation] = useState<Station | null>(null)
  const [focusedStationId, setFocusedStationId] = useState<string | number | null>(null)
  const [inventoryPageIndex, setInventoryPageIndex] = useState(0)
  const inventoryPageSize = 12
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<string[]>([])
  const [selectedInventory, setSelectedInventory] = useState<StationInventoryItem | null>(null)

  const formatStatusLabel = (value?: string | null) => {
    if (!value) return "Unknown"
    return value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const getInventoryStatusColor = (value?: string | null) => {
    const normalized = value?.toLowerCase() ?? "unknown"
    if (["available", "active", "new", "ready"].includes(normalized)) return "text-emerald-600"
    if (["maintenance", "retired", "pending"].includes(normalized)) return "text-amber-500"
    if (["damaged", "fault", "error"].includes(normalized)) return "text-rose-500"
    return "text-slate-500"
  }

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
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({
      lat: String(userLocation.lat),
      lng: String(userLocation.lng),
      radiusKm: String(radiusKm),
    })
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim())
    }
    return `${API_BASE_URL}/api/stations/nearby?${params.toString()}`
  }, [radiusKm, searchQuery, userLocation.lat, userLocation.lng])

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

  const inventoryApiUrl = useMemo(() => {
    if (!detailStation) return null
    const params = new URLSearchParams({
      page: String(inventoryPageIndex),
      size: String(inventoryPageSize),
    })
    inventoryStatusFilter.forEach((status) => params.append("status", status))
    return `${API_BASE_URL}/api/stations/${detailStation.id}/inventory?${params.toString()}`
  }, [detailStation, inventoryPageIndex, inventoryPageSize, inventoryStatusFilter])

  const {
    data: stationInventory,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useSWR<StationInventoryResponse>(inventoryApiUrl, authorizedJsonFetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    if (!detailStation) {
      setInventoryPageIndex(0)
      setInventoryStatusFilter([])
      setSelectedInventory(null)
      return
    }
    setInventoryPageIndex(0)
    setSelectedInventory(null)
  }, [detailStation])

  useEffect(() => {
    if (!stationInventory?.items?.length) {
      setSelectedInventory(null)
      return
    }

    setSelectedInventory((prev) => {
      if (!prev) {
        return stationInventory.items[0]
      }
      const stillExists = stationInventory.items.find((item) => item.inventoryId === prev.inventoryId)
      return stillExists ?? stationInventory.items[0]
    })
  }, [stationInventory])

  const handleViewDetails = (station: Station) => {
    setDetailStation(station)
    setDetailOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <BookingHeader title="Find Stations" />

      <div className="flex-1 overflow-hidden">
        <div className="flex gap-6 p-8 h-full overflow-hidden">
          {/* Map Section - grows with content */}
          <div className="flex-1 min-h-0">
            <Card className="border-0 shadow-lg overflow-hidden h-full min-h-[700px] p-0">
              {MapComponent ? (
                <div className="h-full">
                  <MapComponent
                    onForceCenter
                    stations={stations}
                    selectedStationId={focusedStationId ?? undefined}
                    onStationSelect={(station: Station | null) => setFocusedStationId(station?.id ?? null)}
                  />
                </div>
              ) : (
                <div className="p-4 text-gray-500">Loading map...</div>
              )}
            </Card>
          </div>

          {/* Stations List */}
          <div className="w-[420px] max-w-full flex flex-col shrink-0 h-full">
            <Card className="flex flex-col h-full overflow-hidden">
              <div className="pr-4 pl-4 pb-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {isLoading ? "Loading stations..." : `Available Stations (${stations.length})`}
                  </h3>
                  <p className="text-xs text-gray-500 text-right">
                    Using Student Cultural House as your location
                  </p>
                </div>

                <div>
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
                      {[5, 10].map((radius) => (
                          <button
                            key={radius}
                            onClick={() => {
                              setRadiusKm(radius)
                              setShowFilterMenu(false)
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
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pl-4 pr-4">
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

                {!isLoading && stations.length === 0 && !error && (
                  <div className="p-4 text-center text-gray-500">No stations found within {radiusKm}km</div>
                )}

                {stations.map((station) => (
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

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => handleViewDetails(station)}
                        >
                          <Info className="w-3 h-3" />
                          View Details
                        </Button>
                      </div>
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
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open)
          if (!open) {
            setDetailStation(null)
            setSelectedInventory(null)
            setInventoryStatusFilter([])
            setInventoryPageIndex(0)
          }
        }}
      >
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>{detailStation?.name ?? "Station details"}</DialogTitle>
            <DialogDescription>
              {detailStation
                ? stationInventory
                  ? `${stationInventory.totalInventories} inventory slots • ${detailStation.address}`
                  : `Loading inventory • ${detailStation.address}`
                : "Select a station to see more information."}
            </DialogDescription>
          </DialogHeader>

          {detailStation && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 uppercase tracking-wide">
                  <span>Station inventory layout</span>
                  <span>{stationInventory?.totalItems ?? detailStation.total ?? 0} tracked slots</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={inventoryStatusFilter.length === 0 ? "default" : "outline"}
                    onClick={() => {
                      setInventoryStatusFilter([])
                      setInventoryPageIndex(0)
                    }}
                  >
                    All ({stationInventory?.totalItems ?? 0})
                  </Button>
                  {Object.entries(stationInventory?.statusCounters ?? {}).map(([statusKey, count]) => {
                    const normalized = statusKey?.toUpperCase?.() ?? "UNKNOWN"
                    const isActive = inventoryStatusFilter.includes(normalized)
                    return (
                      <Button
                        key={normalized}
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        className={isActive ? "bg-[#A2F200] text-black hover:bg-[#8fd600]" : undefined}
                        onClick={() => {
                          setInventoryStatusFilter((prev) => {
                            if (prev.includes(normalized)) {
                              return prev.filter((item) => item !== normalized)
                            }
                            return [...prev, normalized]
                          })
                          setInventoryPageIndex(0)
                        }}
                      >
                        {normalized.replace(/_/g, " ")} ({count})
                      </Button>
                    )
                  })}
                </div>

                <div className="min-h-[320px]">
                  {inventoryError && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                      Failed to load inventory: {inventoryError.message}
                    </div>
                  )}

                  {inventoryLoading && (
                    <div className="flex items-center justify-center gap-2 text-gray-500 p-6">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading inventory...
                    </div>
                  )}

                  {!inventoryLoading && !inventoryError && stationInventory?.items?.length === 0 && (
                    <div className="p-4 text-sm text-gray-500 border rounded-lg">
                      No inventory slots match the current filter.
                    </div>
                  )}

                  {stationInventory?.items?.length ? (
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {stationInventory.items.map((item) => {
                        const isSelected = selectedInventory?.inventoryId === item.inventoryId
                        const normalizedStatus = item.inventoryStatus ?? "UNKNOWN"
                        return (
                          <button
                            key={item.inventoryId}
                            onClick={() => setSelectedInventory(item)}
                            className={`rounded-lg border p-3 text-left transition focus-visible:outline focus-visible:ring-2 flex flex-col gap-1 ${
                              isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                            }`}
                          >
                            <p className="text-xs font-semibold text-gray-700">Slot #{item.inventoryId}</p>
                            <p className={`text-[11px] uppercase font-semibold ${getInventoryStatusColor(normalizedStatus)}`}>
                              {formatStatusLabel(normalizedStatus)}
                            </p>
                            <div className="mt-1 text-[11px] text-gray-500 space-y-1">
                              <p>{item.batteryName ?? `Battery ${item.batteryId ?? "-"}`}</p>
                              <p>{item.batteryStatus ?? "Unknown state"}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                </div>

                {stationInventory && stationInventory.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 text-sm">
                    <span className="text-gray-500">
                      Page {stationInventory.page + 1} of {stationInventory.totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={stationInventory.page === 0}
                        onClick={() => setInventoryPageIndex((prev) => Math.max(prev - 1, 0))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={stationInventory.page >= stationInventory.totalPages - 1}
                        onClick={() =>
                          setInventoryPageIndex((prev) =>
                            stationInventory.page >= stationInventory.totalPages - 1 ? prev : prev + 1,
                          )
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border bg-muted/40 p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Slot details</p>
                  <h4 className="text-lg font-semibold">
                    {selectedInventory ? `Slot #${selectedInventory.inventoryId}` : "Select any slot"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {selectedInventory
                      ? selectedInventory.inventoryStatus?.toUpperCase() === "AVAILABLE"
                        ? "Available for swap now"
                        : `Status: ${formatStatusLabel(selectedInventory.inventoryStatus)}`
                      : "Tap any slot on the layout to view its status"}
                  </p>
                </div>

                {selectedInventory ? (
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Battery ID</dt>
                      <dd className="font-semibold">{selectedInventory.batteryId ?? "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Battery name</dt>
                      <dd className="font-semibold">
                        {selectedInventory.batteryName ?? `Battery ${selectedInventory.batteryId ?? "-"}`}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Battery type</dt>
                      <dd className="font-semibold">{selectedInventory.batteryType ?? "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Battery status</dt>
                      <dd className="font-semibold">{formatStatusLabel(selectedInventory.batteryStatus)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Capacity</dt>
                      <dd className="font-semibold">
                        {selectedInventory.capacity != null ? `${selectedInventory.capacity} Ah` : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Usage count</dt>
                      <dd className="font-semibold">{selectedInventory.usageCount ?? "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Borrow status</dt>
                      <dd className="font-semibold">{selectedInventory.borrowStatus ?? "—"}</dd>
                    </div>
                  </dl>
                ) : (
                  <div className="text-sm text-gray-500 border border-dashed rounded-lg p-4">
                    Select a slot on the left to load battery telemetry and logistics details.
                  </div>
                )}

                <div className="rounded-lg border bg-white/70 p-3 text-xs text-gray-500">
                  <p>Contact the station manager at {detailStation.contact ?? "0123-456-789"} if you need assistance.</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
