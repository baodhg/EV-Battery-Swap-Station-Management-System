
"use client";

import { useState } from "react";

export interface DriverBooking {
  bookingId: number;
  driverName: string;
  carModel: string;
  customerName: string;
  date: string;
  status: string;
}

interface Props {
  title: string;
  bookings: DriverBooking[];
  onReload?: () => void;
}

export function DriverBookingsTable({ title, bookings, onReload }: Props) {
  const [search, setSearch] = useState("");

  const filtered = bookings.filter(
    (b) =>
      !search ||
      b.driverName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Tìm theo tên tài xế..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 border rounded"
          />
          {onReload && (
            <button
              onClick={onReload}
              className="inline-block bg-[#7241CE] text-white px-3 py-1 rounded"
            >
              Làm mới
            </button>
          )}
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
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Không có booking nào.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr
                  key={b.bookingId}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 border-b">{b.bookingId}</td>
                  <td className="px-4 py-2 border-b">{b.driverName}</td>
                  <td className="px-4 py-2 border-b">{b.carModel}</td>
                  <td className="px-4 py-2 border-b">{b.customerName}</td>
                  <td className="px-4 py-2 border-b">{b.date}</td>
                  <td
                    className={`px-4 py-2 border-b font-medium ${
                      b.status === "Completed"
                        ? "text-green-600"
                        : b.status === "Pending"
                        ? "text-yellow-600"
                        : "text-gray-600"
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
  );
}
