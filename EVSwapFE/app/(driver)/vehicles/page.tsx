"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/api" // âœ… import Ä‘Ãºng

interface Vehicle {
  id?: number
  vin: string
  vehicleModel: string
  batteryType: string
  userId?: number
  userName?: string
}

export default function VehiclePage() {
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
      // âœ… GÃ¡n kiá»ƒu rÃµ rÃ ng Ä‘á»ƒ TS hiá»ƒu response
      const res = await apiClient.get<Vehicle[]>("/api/driver/vehicles")
      setVehicles(res.data)
    } catch (err) {
      console.error("Lá»—i load danh sÃ¡ch xe:", err)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await apiClient.put(`/api/driver/vehicles/${editing.id}`, form)
      } else {
        await apiClient.post("/api/driver/vehicles", form)
      }
      setEditing(null)
      setAdding(false)
      setForm({ vin: "", vehicleModel: "", batteryType: "", userId: 0, userName: "" })
      loadVehicles()
    } catch (err) {
      console.error("Lá»—i lÆ°u xe:", err)
      alert("KhÃ´ng thá»ƒ lÆ°u thÃ´ng tin xe.")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a xe nÃ y?")) {
      try {
        await apiClient.delete(`/api/driver/vehicles/${id}`)
        loadVehicles()
      } catch (err) {
        console.error("Lá»—i xÃ³a xe:", err)
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quáº£n lÃ½ xe Ä‘iá»‡n</h1>
        <Button onClick={() => setAdding(true)}>+ ThÃªm xe</Button>
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
            placeholder="Loáº¡i pin"
            value={form.batteryType}
            onChange={(e) => setForm({ ...form, batteryType: e.target.value })}
            required
          />
          <Input
            name="userName"
            placeholder="TÃªn ngÆ°á»i dÃ¹ng"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />
          <Input
            type="number"
            name="userId"
            placeholder="ID ngÆ°á»i dÃ¹ng"
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
              Há»§y
            </Button>
            <Button type="submit">LÆ°u</Button>
          </div>
        </form>
      )}

      {/* Danh sÃ¡ch xe */}
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
                  Sá»­a
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(v.id!)}
                >
                  XÃ³a
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
