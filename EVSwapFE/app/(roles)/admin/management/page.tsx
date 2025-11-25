"use client";

import React, { useEffect, useState } from "react";
import "antd/dist/reset.css";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  message,
} from "antd";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE_URL } from "@/lib/config";

const { Option } = Select;

type StationStatus = "OPEN" | "MAINTENANCE" | "CLOSED";

type Station = {
  stationID: number;
  stationName: string;
  address: string;
  stationStatus: StationStatus;   // map với cột StationStatus
  contact?: string;               // 🆕 map với cột Contact
  openingHours?: string;          // map với cột OpeningHours
  slots?: number;                 // map với cột Slots
  latitude?: number;
  longitude?: number;
  sohAvg?: number;
};

const emptyForm: Partial<Station> = {
  stationName: "",
  address: "",
  stationStatus: "OPEN",
  contact: "",
  openingHours: "24/7",
  slots: 10,
};

export default function Page() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  const API_BASE = API_BASE_URL;

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Station | null>(null);
  const [form, setForm] = useState<Partial<Station>>(emptyForm);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StationStatus | undefined>(
    undefined
  );

  // chỉ Admin mới được vào
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        message.warning("Vui lòng đăng nhập để truy cập.");
        router.push("/signin");
      } else {
        const isAdmin = (user?.role ?? "").toString().toLowerCase() === "admin";
        if (!isAdmin) {
          message.error("Bạn không có quyền truy cập trang này.");
          router.push("/");
        }
      }
    }
  }, [isLoading, isLoggedIn, user, router]);

  if (isLoading) {
    return <p className="p-6">Đang kiểm tra quyền truy cập...</p>;
  }

  const isAdmin = (user?.role ?? "").toString().toLowerCase() === "admin";
  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  const token =
    JSON.parse(localStorage.getItem("user") || "null")?.token ||
    localStorage.getItem("token") ||
    "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchStations = async () => {
    try {
      setLoading(true);
      const url = new URL(`${API_BASE}/api/stations`);
      url.searchParams.set("page", "0");
      url.searchParams.set("size", "100");
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error("Không thể tải danh sách trạm");
      const data = await res.json();
      const list: Station[] = (Array.isArray(data) ? data : data.content) ?? [];
      setStations(list);
    } catch (e: any) {
      message.error(e?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (st: Station) => {
    setEditing(st);
    setForm({ ...st });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/stations/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Xoá trạm thất bại");
      message.success("Đã xoá trạm");
      fetchStations();
    } catch (e: any) {
      message.error(e?.message || "Không xoá được trạm");
    }
  };

  const validateForm = () => {
    if (!form.stationName || !form.address) {
      Modal.error({
        title: "Thiếu dữ liệu",
        content: "Vui lòng nhập Tên trạm và Địa chỉ.",
      });
      return false;
    }

    if (
      form.slots !== undefined &&
      (Number.isNaN(Number(form.slots)) || Number(form.slots) < 0)
    ) {
      Modal.error({
        title: "Dữ liệu không hợp lệ",
        content: "Số slots phải là số không âm.",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      stationName: form.stationName,
      address: form.address,
      stationStatus: (form.stationStatus ?? "OPEN") as StationStatus,
      contact: form.contact ?? null, // 🆕 gửi số điện thoại
      openingHours: form.openingHours,
      slots:
        form.slots !== undefined && form.slots !== null
          ? Number(form.slots)
          : undefined,
      latitude:
        form.latitude !== undefined && form.latitude !== null
          ? Number(form.latitude)
          : undefined,
      longitude:
        form.longitude !== undefined && form.longitude !== null
          ? Number(form.longitude)
          : undefined,
    };

    try {
      const res = await fetch(
        editing
          ? `${API_BASE}/api/stations/${editing.stationID}`
          : `${API_BASE}/api/stations`,
        {
          method: editing ? "PUT" : "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok)
        throw new Error(editing ? "Cập nhật thất bại" : "Thêm trạm thất bại");
      message.success(editing ? "Cập nhật thành công" : "Thêm trạm thành công");
      setIsModalOpen(false);
      fetchStations();
    } catch (e: any) {
      message.error(e?.message || "Lưu thất bại");
    }
  };

  const statusTag = (st: StationStatus) => {
    switch (st) {
      case "OPEN":
        return <Tag color="green">OPEN</Tag>;
      case "MAINTENANCE":
        return <Tag color="orange">MAINTENANCE</Tag>;
      default:
        return <Tag color="red">CLOSED</Tag>;
    }
  };

  const filtered = stations.filter((s) => {
    const bySearch =
      !search ||
      s.stationName.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase());
    const byStatus = !statusFilter || s.stationStatus === statusFilter;
    return bySearch && byStatus;
  });

  const columns = [
    { title: "Mã trạm", dataIndex: "stationID", key: "stationID", width: 80 },
    {
      title: "Tên trạm",
      dataIndex: "stationName",
      key: "stationName",
      render: (t: string) => <b>{t}</b>,
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address", ellipsis: true },
    {
      title: "Số điện thoại",
      dataIndex: "contact",
      key: "contact",
      width: 140,
      render: (v: string | undefined) => v || "--",
    },
    {
      title: "Trạng thái",
      dataIndex: "stationStatus",
      key: "stationStatus",
      filters: [
        { text: "OPEN", value: "OPEN" },
        { text: "MAINTENANCE", value: "MAINTENANCE" },
        { text: "CLOSED", value: "CLOSED" },
      ],
      onFilter: (v: any, r: Station) => r.stationStatus === v,
      render: (_: any, r: Station) => statusTag(r.stationStatus),
      width: 140,
    },
    {
      title: "Giờ hoạt động",
      dataIndex: "openingHours",
      key: "openingHours",
      width: 140,
    },
    {
      title: "Slots",
      dataIndex: "slots",
      key: "slots",
      width: 80,
      render: (v: number | undefined) =>
        v !== undefined && v !== null ? v : "/",
    },
    {
      title: "SoH (avg)",
      dataIndex: "sohAvg",
      key: "sohAvg",
      width: 110,
      render: (v: number | undefined) =>
        typeof v === "number" ? `${v.toFixed(1)}%` : "--",
    },
    {
      title: "Tác vụ",
      key: "actions",
      width: 160,
      render: (_: any, record: Station) => (
        <Space>
          <Button
            size="small"
            icon={<Pencil size={16} />}
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá trạm?"
            onConfirm={() => handleDelete(record.stationID)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button size="small" danger icon={<Trash2 size={16} />}>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-700">Quản lý trạm đổi pin</h1>
        <Space>
          <Input
            allowClear
            placeholder="Tìm theo tên/địa chỉ…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <Select
            allowClear
            placeholder="Lọc trạng thái"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            style={{ width: 180 }}
          >
            <Option value="OPEN">OPEN</Option>
            <Option value="MAINTENANCE">MAINTENANCE</Option>
            <Option value="CLOSED">CLOSED</Option>
          </Select>
          <Button onClick={fetchStations} icon={<RefreshCw size={16} />}>
            Làm mới
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: "#dc2626", borderColor: "#dc2626" }}
            icon={<Plus />}
            onClick={openAddModal}
          >
            Thêm trạm
          </Button>
        </Space>
      </div>

      <Table
        loading={loading}
        columns={columns as any}
        dataSource={filtered}
        rowKey="stationID"
        bordered
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        title={editing ? "Chỉnh sửa trạm" : "Thêm trạm mới"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Huỷ"
        okButtonProps={{
          style: { backgroundColor: "#dc2626", borderColor: "#dc2626" },
        }}
      >
        <div className="space-y-3">
          <label>Tên trạm</label>
          <Input
            value={form.stationName}
            onChange={(e) =>
              setForm({ ...form, stationName: e.target.value })
            }
          />

          <label>Địa chỉ</label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <label>Số điện thoại</label>
          <Input
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            placeholder="VD: 028-6666666"
          />

          <label>Trạng thái</label>
          <Select
            value={form.stationStatus as StationStatus}
            onChange={(v) => setForm({ ...form, stationStatus: v })}
            style={{ width: "100%" }}
          >
            <Option value="OPEN">OPEN</Option>
            <Option value="MAINTENANCE">MAINTENANCE</Option>
            <Option value="CLOSED">CLOSED</Option>
          </Select>

          <label>Giờ hoạt động</label>
          <Input
            value={form.openingHours}
            onChange={(e) =>
              setForm({ ...form, openingHours: e.target.value })
            }
            placeholder="VD: 06:00–22:00 hoặc 24/7"
          />

          <div>
            <label>Slots</label>
            <Input
              type="number"
              value={form.slots}
              onChange={(e) =>
                setForm({ ...form, slots: Number(e.target.value) })
              }
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Vĩ độ (lat)</label>
              <Input
                type="number"
                value={form.latitude}
                onChange={(e) =>
                  setForm({ ...form, latitude: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label>Kinh độ (lng)</label>
              <Input
                type="number"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
