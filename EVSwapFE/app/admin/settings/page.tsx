"use client"

import { Card } from "@/components/ui/card"
import { BookingHeader } from "@/components/booking-header"

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <BookingHeader title="Settings" />

      <div className="p-8">
        <Card className="bg-white p-12 text-center">
          <p className="text-gray-600">Settings feature coming soon</p>
        </Card>
      </div>
    </div>
  )
}
