"use client"

import { MapPin, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function StationFinderSection() {
  const router = useRouter()

  const handleViewFullMap = () => {
    router.push("/map")
  }

  return (
    <section id="stations" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Find Stations Near You</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our growing network covers major cities and highways
          </p>
        </div>
      </div>

      <div className="bg-[#7241CE]/10 py-16 md:py-24 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/abstract-map-with-location-pins-and-roads.jpg"
            alt=""
            className="w-full h-full object-cover blur-sm"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[450px]">
            <div className="w-20 h-20 bg-[#A2F200] rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive Station Map</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Find the nearest station with real-time availability status
            </p>
            <Button
              onClick={handleViewFullMap}
              className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold"
            >
              View Full Map
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-[#7241CE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#7241CE]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">City Center</h3>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-[#A2F200]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#A2F200]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Shopping Mall Station</h3>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Airport Station</h3>
            <p className="text-gray-600 text-sm">Maintenance mode</p>
          </div>
        </div>
      </div>
    </section>
  )
}
