import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  // common
  User, LogOut,
  // admin
  Home, Users, BarChart, Settings, Wrench, Package,
  CreditCard, FileText, Layers, Database,
  // staff
  Calendar, Repeat, ClipboardCheck, Headphones, ShieldCheck, Truck,
  // driver
  MapPin
} from "lucide-react";

export default function Sidebar({ user, handleLogout }) {
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  // Ẩn nếu chưa đăng nhập hoặc là role không cần sidebar
  if (!user || user.role === "PATIENT") return null;

  const isActive = (path) => location.pathname === path;

  // Map role -> cấu hình hiển thị (màu nền tiêu đề + danh sách link)
  const MENU_BY_ROLE = {
    ADMIN: {
      title: "EVSwap Admin",
      headerClass: "text-slate-800",
      cardBg: "bg-slate-50",
      active: "bg-slate-200 text-slate-900 font-semibold",
      idle: "text-slate-700 hover:bg-slate-100",
      links: [
        { path: "/admin", label: "Trang chủ Admin", icon: Home },
        { path: "/admin/stations", label: "Quản lý trạm", icon: Wrench },
        { path: "/admin/batteries", label: "Kho pin (SoH)", icon: Package },
        { path: "/admin/operations", label: "Vận hành & điều phối", icon: Layers },
        { path: "/admin/transactions", label: "Giao dịch đổi/thuê", icon: CreditCard },
        { path: "/admin/customers", label: "Khách hàng", icon: Users },
        { path: "/admin/reports", label: "Báo cáo / Thống kê", icon: BarChart },
        { path: "/admin/logs", label: "Nhật ký hệ thống", icon: Database },
        { path: "/admin/settings", label: "Cấu hình hệ thống", icon: Settings },
        { path: "/admin/docs", label: "Tài liệu / Biểu mẫu", icon: FileText },
      ],
    },

    STAFF: {
      title: "EVSwap Staff",
      headerClass: "text-emerald-800",
      cardBg: "bg-emerald-50",
      active: "bg-emerald-200 text-emerald-900 font-semibold",
      idle: "text-emerald-800 hover:bg-emerald-100",
      links: [
        { path: "/staff", label: "Trang Nhân viên", icon: Home },
        { path: "/staff/queue", label: "Hàng đợi / Lịch hẹn", icon: Calendar },
        { path: "/staff/swaps", label: "Thao tác đổi pin", icon: Repeat },
        { path: "/staff/returns", label: "Nhận pin trả về", icon: ClipboardCheck },
        { path: "/staff/inventory", label: "Tồn kho pin tại trạm", icon: Package },
        { path: "/staff/customers", label: "Khách tại trạm", icon: Users },
        { path: "/staff/dispatch", label: "Điều phối / Vận chuyển", icon: Truck },
        { path: "/staff/safety", label: "An toàn & kiểm định", icon: ShieldCheck },
        { path: "/staff/support", label: "Hỗ trợ / Sự cố", icon: Headphones },
      ],
    },

    DRIVER: {
      title: "EVSwap Driver",
      headerClass: "text-blue-800",
      cardBg: "bg-blue-50",
      active: "bg-blue-200 text-blue-900 font-semibold",
      idle: "text-blue-800 hover:bg-blue-100",
      links: [
        { path: "/driver", label: "Trang chủ Tài xế", icon: Home },
        { path: "/driver/book", label: "Đặt lịch đổi pin", icon: Calendar },
        { path: "/driver/search", label: "Tra cứu trạm & pin", icon: MapPin },
        { path: "/driver/payments", label: "Thanh toán & gói thuê", icon: CreditCard },
        { path: "/driver/history", label: "Lịch sử giao dịch", icon: FileText },
        { path: "/driver/support", label: "Hỗ trợ & Phản hồi", icon: Headphones },
        { path: "/driver/settings", label: "Cài đặt tài khoản", icon: Settings },
      ],
    },
  };

  // Phòng trường hợp role viết thường/khác
  const roleKey = String(user.role || "").toUpperCase();
  const cfg = MENU_BY_ROLE[roleKey];
  if (!cfg) return null;

  return (
    <div className={`h-screen w-64 ${cfg.cardBg} shadow-lg flex flex-col p-4 fixed left-0 top-0 z-30`}>
      <h2 className={`${cfg.headerClass} text-2xl font-bold mb-6`}>{cfg.title}</h2>

      <div className="flex flex-col gap-3 flex-1">
        {cfg.links.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive(path) ? cfg.active : cfg.idle
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </div>

      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => setShowLogout(v => !v)}
        title="Hiện/ẩn đăng xuất"
      >
        <User className={`w-6 h-6 ${cfg.headerClass}`} />
        <span className={`font-medium ${cfg.headerClass}`}>{user.fullName}</span>

        {showLogout && (
          <button
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            className="ml-auto flex items-center gap-1 text-red-600 hover:underline text-sm"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        )}
      </div>
    </div>
  );
}
