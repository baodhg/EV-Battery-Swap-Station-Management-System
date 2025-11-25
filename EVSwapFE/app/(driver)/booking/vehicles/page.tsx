"use client"

import { useState } from "react"
import { VehicleForm } from "@/components/driver/vehicle-form"
import { VehicleList } from "@/components/driver/vehicle-list"
import { BookingHeader } from "@/components/shared/booking-header"

export default function VehiclePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleVehicleAdded = () => {
    // Trigger refresh cá»§a VehicleList
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <>
      <BookingHeader title="Vehicles" />

      <div className="flex-1 overflow-auto p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicle Management</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form thÃªm xe */}
            <div>
              <VehicleForm onVehicleAdded={handleVehicleAdded} />
            </div>

            {/* Danh sÃ¡ch xe */}
            <div>
              <VehicleList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
