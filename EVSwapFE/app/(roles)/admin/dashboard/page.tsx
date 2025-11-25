"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Card, Spin } from "antd";
import { RefreshCw } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

export default function AdminDashboardPage() {
  const API_BASE = API_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStations: 0,
    totalStaff: 0,
    totalBookings: 0,
    activeStations: 0,
  });

  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const token =
    JSON.parse(localStorage.getItem("user") || "null")?.token ||
    localStorage.getItem("token") ||
    "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // --- Giả lập dữ liệu thống kê nếu API chưa có ---
  const fakeStats = {
    totalStations: 15,
    totalStaff: 40,
    totalBookings: 1250,
    activeStations: 12,
  };

  const fakeChartData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
    values: [200, 450, 300, 600, 500, 700],
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      // Gọi API thật nếu backend có endpoint thống kê
      // const res = await fetch(`${API_BASE}/api/admin/dashboard`, { headers });
      // if (!res.ok) throw new Error("Không thể tải thống kê");
      // const data = await res.json();

      // Dùng giả lập trong khi chờ backend
      setStats(fakeStats);
      setLabels(fakeChartData.labels);
      setChartData(fakeChartData.values);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Biểu đồ ----
  const lineData = {
    labels,
    datasets: [
      {
        label: "Số lượt đổi pin theo tháng",
        data: chartData,
        borderColor: "#7241CE",
        backgroundColor: "rgba(114,65,206,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ["OPEN", "MAINTENANCE", "CLOSED"],
    datasets: [
      {
        label: "Trạng thái trạm",
        data: [12, 2, 1],
        backgroundColor: ["#16a34a", "#f59e0b", "#dc2626"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
  };

  // ---- Giao diện chính ----
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#7241CE]">
          Bảng điều khiển Admin
        </h1>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Cards thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-md border-l-4 border-[#7241CE]">
              <h2 className="text-gray-500">Tổng số trạm</h2>
              <p className="text-3xl font-bold">{stats.totalStations}</p>
            </Card>
            <Card className="shadow-md border-l-4 border-green-600">
              <h2 className="text-gray-500">Trạm đang hoạt động</h2>
              <p className="text-3xl font-bold">{stats.activeStations}</p>
            </Card>
            <Card className="shadow-md border-l-4 border-amber-500">
              <h2 className="text-gray-500">Nhân viên</h2>
              <p className="text-3xl font-bold">{stats.totalStaff}</p>
            </Card>
            <Card className="shadow-md border-l-4 border-red-600">
              <h2 className="text-gray-500">Lượt đổi pin</h2>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
            </Card>
          </div>

          {/* Biểu đồ thống kê */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card title="Thống kê lượt đổi pin (6 tháng gần nhất)">
              <Line data={lineData} options={options} />
            </Card>
            <Card title="Tình trạng các trạm đổi pin">
              <Bar data={barData} options={options} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
