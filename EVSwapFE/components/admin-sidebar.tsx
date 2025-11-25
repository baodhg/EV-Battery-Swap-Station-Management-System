"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export function AdminSidebar() {
  const { logout, user } = useAuth()

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
  <h2 className="text-lg font-semibold mb-1">Battery Swap Station Management</h2>
    
      <ul className="space-y-3">
        <li><Link href="/admin" className="hover:text-yellow-300">🏠 Admin</Link></li>
        <li><Link href="/admin/driver-bookings" className="hover:text-yellow-300">🚘 Booking Management</Link></li>
  <li><Link href="/admin/management" className="hover:text-yellow-300">⚙️ System Management</Link></li>
  <li><Link href="/admin/vehicle" className="hover:text-yellow-300">🚗 Vehicle</Link></li>
      </ul>

      {/* Extra shortcut button to return to site home */}
      <div className="mt-4">
        <Link
          href="/"
          className="block text-center bg-white text-gray-800 px-3 py-2 rounded hover:bg-gray-100 font-medium"
        >
          🏠 Home
        </Link>
      </div>

      <div className="mt-10 border-t border-gray-600 pt-4">
        <p className="text-sm mb-2">👤 {user?.fullName || user?.username}</p>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Log Out
        </button>
        
      </div>
    </aside>
  )
}
