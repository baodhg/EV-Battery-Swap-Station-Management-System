"use client";
import React, { useEffect, useState } from "react";
import { Card, Spin, Button } from "antd";
import { LineChart, BarChart } from "@/components/admin/charts";
import { RefreshCw } from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { API_BASE_URL } from "@/lib/config";

type LineData = { labels: string[]; values: number[] };
type Stats = {
  totalStations: number;
  totalStaff: number;
  totalBookings: number;
  activeStations: number;
};

export default function DashboardPage() {
  const { headers, loading: authLoading } = useAdminAuth();
  const API_BASE = API_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalStations: 0,
    totalStaff: 0,
    totalBookings: 0,
    activeStations: 0,
  });

  const [lineData, setLineData] = useState<LineData>({
    labels: [],
    values: [],
  });

  const [barData, setBarData] = useState<number[]>([0, 0, 0]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      // const res = await fetch(`${API_BASE}/api/admin/dashboard`, { headers });
      // const data = await res.json();
      // setStats(data.stats); setLineData(data.line); setBarData(data.bar);

      // mock
      setStats({
        totalStations: 15,
        totalStaff: 40,
        totalBookings: 1250,
        activeStations: 12,
      });
      setLineData({ labels: ["Jan", "Feb", "Mar"], values: [200, 300, 400] });
      setBarData([12, 2, 1]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (authLoading) return <p className="p-6">Checking Admin privileges...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-700">Admin Dashboard</h1>
        <Button icon={<RefreshCw />} onClick={fetchDashboard}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Stations">{stats.totalStations}</Card>
          <Card title="Active Stations">{stats.activeStations}</Card>
          <Card title="Staff">{stats.totalStaff}</Card>
          <Card title="Battery Swaps">{stats.totalBookings}</Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LineChart labels={lineData.labels} data={lineData.values} title="Battery Swap Trend" />
        <BarChart data={barData} labels={["OPEN", "MAINTENANCE", "CLOSED"]} title="Station Status" />
      </div>
    </div>
  );
}
