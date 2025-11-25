"use client"

import type React from "react"
import { useState } from "react"
import { Menu, Home, User, History, Zap, LifeBuoy, MapPin, Package, Car, ClipboardList } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function BookingSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <div
      className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-[#7241CE]">EV Driver</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {[
          {
            icon: <MapPin className="w-5 h-5" />,
            label: "Find Stations",
            path: "/booking/find-stations",
          },
          {
            icon: <Zap className="w-5 h-5" />,
            label: "Swap",
            path: "/booking/swap",
          },
          {
            icon: <History className="w-5 h-5" />,
            label: "History",
            path: "/booking/history",
          },
          {
            icon: <Package className="w-5 h-5" />,
            label: "Packages",
            path: "/booking/packages",
          },
          {
            icon: <Car className="w-5 h-5" />,
            label: "Vehicles",
            path: "/booking/vehicles",
          },
          {
            icon: <ClipboardList className="w-5 h-5" />,
            label: "Reports",
            path: "/booking/report",
          },
          {
            icon: <User className="w-5 h-5" />,
            label: "Profile",
            path: "/booking/profile",
          },
          {
            icon: <LifeBuoy className="w-5 h-5" />,
            label: "Support",
            path: "/booking/support",
          },
        ].map((item) => (
        <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={isActive(item.path)}
          sidebarOpen={sidebarOpen}
            onClick={() => router.push(item.path)}
        />
        ))}
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      )}
    </div>
  )
}

function NavItem({
  icon,
  label,
  active,
  sidebarOpen,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  sidebarOpen: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        active ? "bg-[#7241CE]/20 text-[#7241CE] border border-[#7241CE]" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </button>
  )
}
