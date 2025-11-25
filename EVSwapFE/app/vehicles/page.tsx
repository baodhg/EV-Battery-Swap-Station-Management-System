"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/api" // ✅ import đúng

interface Vehicle {
  id?: number
  vin: string
  vehicleModel: string
  batteryType: string
  userId?: number
  userName?: string
}

export default function VehiclePage() {
  const API_BASE = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080",
    []
  )

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<Vehicle>({
    vin: "",
    vehicleModel: "",
    batteryType: "",
    userId: 0,
    userName: "",
  })

  const { user } = useAuth()

  const loadVehicles = async () => {
    try {
      // ✅ Gán kiểu rõ ràng để TS hiểu response
      const res = await apiClient.get<Vehicle[]>("/api/vehicles")
      setVehicles(res.data)
    } catch (err) {
      console.error("Lỗi load danh sách xe:", err)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await apiClient.put(`/api/vehicles/${editing.id}`, form)
      } else {
        await apiClient.post("/api/vehicles", form)
      }
      setEditing(null)
      setAdding(false)
      setForm({ vin: "", vehicleModel: "", batteryType: "", userId: 0, userName: "" })
      loadVehicles()
    } catch (err) {
      console.error("Lỗi lưu xe:", err)
      alert("Không thể lưu thông tin xe.")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa xe này?")) {
      try {
        await apiClient.delete(`/api/vehicles/${id}`)
        loadVehicles()
      } catch (err) {
        console.error("Lỗi xóa xe:", err)
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý xe điện</h1>
        <Button onClick={() => setAdding(true)}>+ Thêm xe</Button>
      </div>

      {(adding || editing) && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-white p-4 rounded-xl shadow border border-gray-200"
        >
          <Input
            name="vin"
            placeholder="VIN"
            value={form.vin}
            onChange={(e) => setForm({ ...form, vin: e.target.value })}
            required
          />
          <Input
            name="vehicleModel"
            placeholder="Model xe"
            value={form.vehicleModel}
            onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
            required
          />
          <Input
            name="batteryType"
            placeholder="Loại pin"
            value={form.batteryType}
            onChange={(e) => setForm({ ...form, batteryType: e.target.value })}
            required
          />
          <Input
            name="userName"
            placeholder="Tên người dùng"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />
          <Input
            type="number"
            name="userId"
            placeholder="ID người dùng"
            value={form.userId ?? ""}
            onChange={(e) => setForm({ ...form, userId: Number(e.target.value) })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setAdding(false)
                setEditing(null)
              }}
            >
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      )}

      {/* Danh sách xe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {vehicles.map((v) => (
          <Card key={v.id} className="p-4">
            <CardContent>
              <p><b>VIN:</b> {v.vin}</p>
              <p><b>Model:</b> {v.vehicleModel}</p>
              <p><b>Battery:</b> {v.batteryType}</p>
              <p><b>User:</b> {v.userName} (ID: {v.userId})</p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditing(v)
                    setForm(v)
                    setAdding(false)
                  }}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(v.id!)}
                >
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
