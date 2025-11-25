"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  DollarSign,
  Clock,
  Users,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { BookingHeader } from "@/components/booking-header";
import { useAuth } from "@/hooks/use-auth";
import { Result } from "antd";

type BookingStatus =
  | "pending"
  | "staff-in-progress"
  | "confirmed"
  | "completed"
  | "cancelled";

type Booking = {
  id: number;
  time: string;
  name: string;
  vehicle: string;
  bookingId: string;
  status: BookingStatus;
};

export default function AdminQueuePage() {
  // ====== SOFT GUARD (không redirect) ======
  const { user, isLoggedIn, isLoading, authChecked } = useAuth();
  const isAdmin = (user?.role ?? "").toString().toLowerCase() === "admin";

  if (!authChecked || isLoading) {
    return <p className="p-6">Đang kiểm tra quyền truy cập…</p>;
  }
  if (!isLoggedIn) {
    return (
      <Result
        status="warning"
        title="401"
        subTitle="Bạn cần đăng nhập để xem trang này."
        extra={
          <a href="/signin">
            <Button>Đăng nhập</Button>
          </a>
        }
      />
    );
  }
  if (!isAdmin) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang Admin."
        extra={
          <a href="/">
            <Button variant="outline">Về trang chủ</Button>
          </a>
        }
      />
    );
  }
  // ==========================================

  const API_BASE = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080",
    []
  );

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Demo data (fallback)
  const demo: Booking[] = [
    {
      id: 1,
      time: "15:30",
      name: "Alex Chen",
      vehicle: "Tesla Model 3",
      bookingId: "SA-2024-001",
      status: "pending",
    },
    {
      id: 2,
      time: "16:00",
      name: "Sarah Kim",
      vehicle: "BMW iX3",
      bookingId: "SA-2024-002",
      status: "staff-in-progress",
    },
    {
      id: 3,
      time: "16:30",
      name: "Mike Johnson",
      vehicle: "Nissan Leaf",
      bookingId: "SA-2024-003",
      status: "confirmed",
    },
    {
      id: 4,
      time: "17:00",
      name: "Emily Davis",
      vehicle: "Tesla Model Y",
      bookingId: "SA-2024-004",
      status: "confirmed",
    },
  ];

  const fetchToday = async () => {
    try {
      setLoading(true);
      // const token = localStorage.getItem("token")
      //   || JSON.parse(localStorage.getItem("user")||"null")?.token || "";
      // const res = await fetch(`${API_BASE}/api/admin/bookings/today`, {
      //   headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      // });
      // if (!res.ok) throw new Error("Không tải được danh sách");
      // const data = (await res.json()) as Booking[];
      // setBookings(data);
      setBookings(demo); // fallback demo
    } catch {
      setBookings(demo); // fallback nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">pending</Badge>;
      case "staff-in-progress":
        return <Badge className="bg-blue-100 text-blue-800">in-progress</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">confirmed</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAssign = (b: Booking) =>
    console.log("Assign staff for", b.bookingId);
  const handleStart = (b: Booking) => console.log("Start swap", b.bookingId);
  const handleDone = (b: Booking) => console.log("Complete swap", b.bookingId);
  const handleCancel = (b: Booking) => console.log("Cancel booking", b.bookingId);

  return (
    <div className="flex-1 overflow-auto">
      <BookingHeader title="Admin Queue" />
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Today's Swaps"
            value="47"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Revenue"
            value="$1,175"
          />
          <StatCard icon={<Clock className="w-6 h-6" />} label="Avg Time" value="2.8m" />
          <StatCard icon={<Users className="w-6 h-6" />} label="Rating" value="4.8" />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Low Battery"
            value="3"
          />
          <StatCard
            icon={<Wrench className="w-6 h-6" />}
            label="Maintenance"
            value="1"
          />
        </div>

        {/* Bookings */}
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Today's Bookings</h2>
            <p className="text-sm text-gray-600">
              Manage customer reservations and walk-ins
            </p>
          </div>

          <Card className="bg-white">
            {loading ? (
              <div className="p-6 text-sm text-gray-500">Đang tải…</div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">Không có booking hôm nay</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {booking.time}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {booking.status}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {booking.name}
                        </h3>
                        <p className="text-sm text-gray-600">{booking.vehicle}</p>
                        <p className="text-xs text-gray-500 mt-1">{booking.bookingId}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(booking.status)}

                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            className="px-4"
                            onClick={() => handleAssign(booking)}
                          >
                            Assign
                          </Button>
                          <Button
                            className="bg-[#7241CE] text-white hover:bg-[#5a2fa0] px-6"
                            onClick={() => handleStart(booking)}
                          >
                            Start Swap
                          </Button>
                          <Button
                            variant="outline"
                            className="px-4"
                            onClick={() => handleCancel(booking)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}

                      {booking.status === "staff-in-progress" && (
                        <>
                          <Button
                            variant="outline"
                            className="px-4"
                            onClick={() => handleCancel(booking)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-[#7241CE] text-white hover:bg-[#5a2fa0] px-6"
                            onClick={() => handleDone(booking)}
                          >
                            Complete
                          </Button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <>
                          <Button
                            variant="outline"
                            className="px-4"
                            onClick={() => handleAssign(booking)}
                          >
                            Assign
                          </Button>
                          <Button
                            className="bg-[#7241CE] text-white hover:bg-[#5a2fa0] px-6"
                            onClick={() => handleStart(booking)}
                          >
                            Start Swap
                          </Button>
                          <Button
                            variant="outline"
                            className="px-4"
                            onClick={() => handleCancel(booking)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="bg-white p-6 text-center">
      <div className="flex justify-center mb-3 text-[#7241CE]">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-2">{label}</div>
    </Card>
  );
}
