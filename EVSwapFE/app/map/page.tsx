"use client"

import { BookingHeader } from "@/components/booking-header"
import NearbyStationsMap from "@/components/NearbyStationsMap"
import { useState, useEffect } from "react"

export default function MapPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <BookingHeader title="Station Map" />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <BookingHeader title="Station Map" />
      <div className="flex-1 overflow-hidden">
        <NearbyStationsMap />
      </div>
    </div>
  )
}
