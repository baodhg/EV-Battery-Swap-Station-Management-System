"use client"

import { Card } from "@/components/ui/card"
import { BookingHeader } from "@/components/booking-header"

export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <BookingHeader title="Reports" />

      <div className="p-8">
        <Card className="bg-white p-12 text-center">
          <p className="text-gray-600">Reports feature coming soon</p>
        </Card>
      </div>
    </div>
  )
}
