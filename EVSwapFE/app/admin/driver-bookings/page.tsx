"use client"

import { useEffect, useState } from "react"

interface DriverBooking {
  bookingId: number
  driverName: string
  carModel: string
  customerName: string
  date: string
  status: string
}

export default function DriverBookingPage() {
  const [bookings, setBookings] = useState<DriverBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>("")

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080"

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      // read token from localStorage (may be set on login)
      const token =
        JSON.parse(localStorage.getItem("user") || "null")?.token ||
        localStorage.getItem("token") ||
        ""

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers,
      })
      if (!res.ok) throw new Error(`API Error ${res.status}`)
      const data = await res.json()
      setBookings(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchBookings()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  if (loading) return <div className="p-6 text-gray-600">Đang tải danh sách booking...</div>
  if (error)
    return (
      <div className="p-6 text-red-600 space-y-3">
        <div className="font-medium">Lỗi tải dữ liệu: {error}</div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchBookings()}
            className="mt-2 inline-block bg-[#7241CE] text-white px-3 py-1 rounded"
          >
            Thử lại
          </button>
          {/* If unauthorized, offer sign in */}
          {/401|Unauthorized/i.test(error) && (
            <a href="/signin" className="mt-2 inline-block bg-white border border-gray-200 text-gray-800 px-3 py-1 rounded">
              Đăng nhập
            </a>
          )}
        </div>
      </div>
    )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách Booking của Tài xế</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Tìm theo tên tài xế..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 border rounded"
          />
          <button
            onClick={() => fetchBookings()}
            className="inline-block bg-[#7241CE] text-white px-3 py-1 rounded"
          >
            Làm mới
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">#</th>
              <th className="px-4 py-2 text-left border-b">Tài xế</th>
              <th className="px-4 py-2 text-left border-b">Xe</th>
              <th className="px-4 py-2 text-left border-b">Khách hàng</th>
              <th className="px-4 py-2 text-left border-b">Ngày</th>
              <th className="px-4 py-2 text-left border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Không có booking nào.
                </td>
              </tr>
            ) : (
              bookings
                .filter((b) => !search || b.driverName.toLowerCase().includes(search.toLowerCase()))
                .map((b) => (
                  <tr key={b.bookingId} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border-b">{b.bookingId}</td>
                    <td className="px-4 py-2 border-b">{b.driverName}</td>
                    <td className="px-4 py-2 border-b">{b.carModel}</td>
                    <td className="px-4 py-2 border-b">{b.customerName}</td>
                    <td className="px-4 py-2 border-b">{b.date}</td>
                    <td
                      className={`px-4 py-2 border-b font-medium ${
                        b.status === "Completed" ? "text-green-600" : b.status === "Pending" ? "text-yellow-600" : "text-gray-600"
                      }`}
                    >
                      {b.status}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
