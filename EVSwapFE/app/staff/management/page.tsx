"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Edit2, Trash2, Send } from "lucide-react";
import { BookingHeader } from "@/components/booking-header";

type StaffRole = "manager" | "technician" | "support";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: StaffRole;
  status: "active" | "inactive";
  joinDate: string;
  permissions: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token =
    JSON.parse(localStorage.getItem("user") || "null")?.token ||
    localStorage.getItem("token") ||
    "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API Error ${res.status}`);
  }
  return (await res.json()) as T;
}

export default function StaffManagementPage() {
  const [selectedRole, setSelectedRole] = useState<StaffRole | "all">("all");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roleDescriptions: Record<
    StaffRole,
    { title: string; description: string; color: string }
  > = {
    manager: {
      title: "Manager",
      description: "Full access to all features and staff management",
      color: "bg-purple-100 text-purple-800",
    },
    technician: {
      title: "Technician",
      description: "Can perform swaps and update booking status",
      color: "bg-blue-100 text-blue-800",
    },
    support: {
      title: "Support",
      description: "Can view customer info and handle inquiries",
      color: "bg-green-100 text-green-800",
    },
  };

  const filteredStaff =
    selectedRole === "all"
      ? staffMembers
      : staffMembers.filter((m) => m.role === selectedRole);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: chỉnh path đúng với BE của bạn, ví dụ /api/staff hoặc /api/admin/staff
      const data = await api<StaffMember[]>("/api/staff");
      setStaffMembers(data);
    } catch (err: any) {
      console.error("Fetch staff error:", err);
      setError(err.message ?? "Không thể tải danh sách staff");

      // fallback: dữ liệu demo cho UI vẫn hiển thị
      setStaffMembers([
        {
          id: 1,
          name: "John Manager",
          email: "john@evswap.com",
          role: "manager",
          status: "active",
          joinDate: "2024-01-15",
          permissions: [
            "View all bookings",
            "Manage staff",
            "View reports",
            "Edit settings",
            "Approve transactions",
            "Access analytics",
          ],
        },
        {
          id: 2,
          name: "Sarah Technician",
          email: "sarah@evswap.com",
          role: "technician",
          status: "active",
          joinDate: "2024-02-20",
          permissions: [
            "View assigned bookings",
            "Update swap status",
            "Report issues",
            "View own performance",
          ],
        },
        {
          id: 3,
          name: "Mike Support",
          email: "mike@evswap.com",
          role: "support",
          status: "active",
          joinDate: "2024-03-10",
          permissions: [
            "View customer info",
            "Handle inquiries",
            "Create support tickets",
            "View FAQ",
          ],
        },
        {
          id: 4,
          name: "Lisa Technician",
          email: "lisa@evswap.com",
          role: "technician",
          status: "inactive",
          joinDate: "2024-01-05",
          permissions: [
            "View assigned bookings",
            "Update swap status",
            "Report issues",
            "View own performance",
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const onView = (m: StaffMember) => {
    // chỉnh route theo design của bạn
    window.location.href = `/admin/staff/${m.id}`;
  };

  const onEdit = async (m: StaffMember) => {
    const next = m.status === "active" ? "inactive" : "active";
    try {
      await api(`/api/staff/${m.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      setStaffMembers((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, status: next } : x)),
      );
    } catch (err) {
      console.error(err);
      alert("Cập nhật trạng thái staff thất bại");
    }
  };

  const onDelete = async (m: StaffMember) => {
    if (!confirm(`Xóa staff ${m.name}?`)) return;
    try {
      await api(`/api/staff/${m.id}`, { method: "DELETE" });
      setStaffMembers((prev) => prev.filter((x) => x.id !== m.id));
    } catch (err) {
      console.error(err);
      alert("Xóa staff thất bại");
    }
  };

  const sendFeedbackToAdmin = async (m: StaffMember) => {
    try {
      await api("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          fromStaffId: m.id,
          subject: `Issue by ${m.name}`,
          message: "System/transaction anomaly",
          severity: "medium",
        }),
      });
      alert("Feedback sent. You will receive directives from Admin.");
    } catch (err) {
      console.error(err);
      alert("Gửi feedback thất bại");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-gray-600">Đang tải danh sách nhân viên...</div>
    );

  return (
    <div className="flex-1 overflow-auto">
      <BookingHeader title="Staff Management" />
      <div className="p-8">
        {/* Filter */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Filter by Role
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedRole("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRole === "all"
                  ? "bg-[#7241CE] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Staff
            </button>
            {(Object.keys(roleDescriptions) as StaffRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRole === role
                    ? "bg-[#7241CE] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {roleDescriptions[role].title}
              </button>
            ))}
          </div>
        </div>

        {/* Role overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(Object.keys(roleDescriptions) as StaffRole[]).map((role) => (
            <Card key={role} className="bg-white p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-2 rounded-lg ${roleDescriptions[role].color}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {roleDescriptions[role].title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {roleDescriptions[role].description}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {staffMembers
                  .filter((m) => m.role === role)
                  .slice(0, 2)
                  .map((m) => (
                    <div key={m.id} className="text-xs text-gray-600">
                      • {m.name}
                    </div>
                  ))}
                {staffMembers.filter((m) => m.role === role).length > 2 && (
                  <div className="text-xs text-gray-500">
                    +
                    {staffMembers.filter((m) => m.role === role).length - 2} more
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Staff list */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Staff Members
        </h2>
        <div className="space-y-4">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="bg-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <Badge className={roleDescriptions[member.role].color}>
                      {roleDescriptions[member.role].title}
                    </Badge>
                    <Badge
                      className={
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Joined: {member.joinDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(member)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(member)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => onDelete(member)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => sendFeedbackToAdmin(member)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Feedback
                  </Button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3">
                  Permissions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.permissions.map((p, i) => (
                    <Badge
                      key={i}
                      className="bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-xs text-red-500">
            (Đang dùng dữ liệu demo vì gặp lỗi API: {error})
          </p>
        )}
      </div>
    </div>
  );
}
