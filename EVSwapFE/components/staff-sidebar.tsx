"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  LogOut,
  BarChart3,
  Users,
  Settings,
  Menu,
  Send,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

type Health = { db: string; queue: string; payments: string; version: string };

// tiện ích gọi API gọn
async function api<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export function StaffSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // === System health & directives ===
  const [health, setHealth] = useState<Health | null>(null);
  const [healthErr, setHealthErr] = useState<string | null>(null);
  const [directiveCount, setDirectiveCount] = useState(0);

  // Ping health + refresh định kỳ
  useEffect(() => {
    let mounted = true;

    const ping = () =>
      fetch("/api/system/health")
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data: Health) => {
          if (!mounted) return;
          setHealth(data);
          setHealthErr(null);
        })
        .catch((e) => {
          if (!mounted) return;
          setHealth(null);
          // Only set error for unexpected failures; 404 is expected if backend doesn't have this endpoint
          setHealthErr(/404/.test(String(e)) ? null : String(e));
        });

    ping();
    const id = setInterval(ping, 30000); // 30s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // Nhận chỉ thị từ admin qua SSE
  useEffect(() => {
    const es = new EventSource("/api/directives");
    es.onmessage = () => setDirectiveCount((n) => n + 1);
    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  const systemOk = useMemo(() => {
    if (!health) return false;
    return health.db === "ok" && health.queue === "ok" && health.payments === "ok";
  }, [health]);

  const menuItems = [
    { label: "Queue Management", href: "/staff/queue", icon: BarChart3 },
    { label: "Staff Management", href: "/staff/management", icon: Users },
    // Reports: nơi bạn đang hiển thị giao dịch + health → gắn badge chỉ thị
    { label: "Reports", href: "/staff/reports", icon: BarChart3, badge: directiveCount },
    { label: "Settings", href: "/staff/settings", icon: Settings },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Gửi phản hồi/issue lên admin
  const sendFeedback = async () => {
    const subject = window.prompt("Subject (ví dụ: System/Transaction issue):", "Operational issue");
    if (!subject) return;
    const message = window.prompt("Nội dung mô tả ngắn gọn:", "Unexpected pending status; need directive.");
    if (!message) return;
    try {
      await api("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          fromStaffId: 0, // TODO: gắn staffId thực từ auth nếu có
          subject,
          message,
          severity: "medium",
        }),
      });
      alert("Đã gửi phản hồi tới Admin. Chỉ thị sẽ hiển thị khi có.");
    } catch (e) {
      alert("Gửi phản hồi thất bại: " + String(e));
    }
  };

  // Tạo tranh chấp / báo cáo giao dịch
  const createTxDispute = async () => {
    const bookingId = window.prompt("Booking/Transaction liên quan (ID):", "BK-001");
    if (!bookingId) return;
    const reason = window.prompt("Lý do tranh chấp:", "Customer requested refund due to duplicate charge.");
    if (!reason) return;
    try {
      const res = await api<{ id: string }>("/api/transactions", {
        method: "POST",
        body: JSON.stringify({ relatedBookingId: bookingId, reason }),
      });
      alert(`Đã tạo hồ sơ giao dịch: ${res.id}`);
    } catch (e) {
      alert("Tạo tranh chấp thất bại: " + String(e));
    }
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {sidebarOpen && (
          <Link href="/staff/queue" className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-[#7241CE]">EVSwap Staff</h1>
          </Link>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* System status mini panel */}
      <div className="px-3 pt-3">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
            systemOk ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
          }`}
          title={
            health
              ? `DB: ${health.db} | Queue: ${health.queue} | Payments: ${health.payments} | v${health.version}`
              : healthErr || "No health info"
          }
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              systemOk ? "bg-green-600" : "bg-amber-600"
            }`}
          />
          {sidebarOpen ? (
            <span>{systemOk ? "System OK" : "Check system"}</span>
          ) : (
            <span className="sr-only">{systemOk ? "System OK" : "Check system"}</span>
          )}
          {!systemOk && <AlertTriangle className="w-4 h-4" />}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon as any;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-[#7241CE]/20 text-[#7241CE] border border-[#7241CE]"
                  : "text-gray-700 hover:bg-gray-100 border border-transparent"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </span>

              {/* Badge chỉ thị mới ở Reports */}
              {!!(item as any).badge && (
                <span
                  className={`text-[11px] px-2 py-[2px] rounded-full ${
                    active ? "bg-[#7241CE] text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  title="New directives"
                >
                  {(item as any).badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick actions: Feedback & Transaction Dispute */}
      <div className="px-4 pb-3 space-y-2">
        <Button
          onClick={sendFeedback}
          variant="outline"
          className="w-full flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
          title="Gửi phản hồi/issue cho Admin"
        >
          <Send className="w-4 h-4" />
          {sidebarOpen && <span>Send Feedback</span>}
        </Button>

        <Button
          onClick={createTxDispute}
          variant="outline"
          className="w-full flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
          title="Tạo tranh chấp giao dịch"
        >
          <BarChart3 className="w-4 h-4" />
          {sidebarOpen && <span>Report Transaction</span>}
        </Button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 border-red-200 bg-transparent"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
