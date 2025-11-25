"use client"

import { useEffect, useState } from "react"

interface Booking {
  id: number
  driverName: string
  customerName: string
  date: string
  status: string
}

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real data from backend
    const fetchBookings = async () => {
      setLoading(true)
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ""
        const res = await fetch(`${API_BASE}/api/admin/bookings`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          // keep cache: 'no-store' for latest data if needed
          cache: "no-store",
        })

        if (!res.ok) {
          // handle unauthorized / server errors gracefully
          console.error("Failed to fetch bookings", res.status)
          setBookings([])
        } else {
          const data = await res.json()
          // Expecting an array of bookings from the API
          setBookings(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return <div className="p-6">Đang tải danh sách booking...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Danh sách Booking</h1>

      <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tài xế</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Khách hàng</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Ngày</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition">
              <td className="border border-gray-300 px-4 py-2">{booking.id}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.driverName}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.customerName}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.date}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
