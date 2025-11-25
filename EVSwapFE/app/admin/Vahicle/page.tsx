"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import apiClient from "@/lib/api"

interface VehicleApi {
  vehicleID: number
  userID: number | null
  vin: string
  vehicleModel: string
  batteryType: string
  registerInformation?: string
  userName?: string // lấy từ VehicleResponse backend
}

interface Vehicle {
  id: number
  userId: number | null
  vin: string
  vehicleModel: string
  batteryType: string
  registerInformation?: string
  userName?: string
}

interface UserByNameApi {
  userID: number
  userName: string
  // add more fields if you need
}

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [adding, setAdding] = useState(false)

  const [form, setForm] = useState({
    vin: "",
    vehicleModel: "",
    batteryType: "",
    registerInformation: "",
    userId: 0,
    userName: "",
  })

  // ------------------------
  // Load vehicle list
  // ------------------------
  const loadVehicles = async () => {
    try {
      const res = await apiClient.get<VehicleApi[]>("/api/vehicles")

      // res.data is unknown -> cast to VehicleApi[]
      const data = res.data as VehicleApi[]

      const mapped: Vehicle[] = data.map((v) => ({
        id: v.vehicleID,
        userId: v.userID,
        vin: v.vin,
        vehicleModel: v.vehicleModel,
        batteryType: v.batteryType,
        registerInformation: v.registerInformation,
        userName: v.userName ?? undefined, // dùng đúng userName từ backend
      }))

      setVehicles(mapped)
    } catch (err) {
      console.error("Error loading vehicle list:", err)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const resetForm = () =>
    setForm({
      vin: "",
      vehicleModel: "",
      batteryType: "",
      registerInformation: "",
      userId: 0,
      userName: "",
    })

  // ------------------------
  // Auto-fill UserID based on userName
  // ------------------------
  const handleUserNameChange = async (userName: string) => {
    setForm((prev) => ({ ...prev, userName }))

    if (!userName.trim()) return

    try {
      const res = await apiClient.get<UserByNameApi>(
        `/api/users/by-name/${userName}`
      )

      const user = res.data as UserByNameApi

      if (user) {
        setForm((prev) => ({
          ...prev,
          userId: user.userID, // set UserID từ API
        }))
      }
    } catch (err) {
      console.error("User not found:", err)
    }
  }

  // ------------------------
  // Submit create/update
  // ------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editing) {
        const payload = {
          vin: form.vin,
          vehicleModel: form.vehicleModel,
          batteryType: form.batteryType,
          registerInformation: form.registerInformation,
          userID: editing.userId, // giữ user cũ khi edit
        }
        await apiClient.put(`/api/vehicles/${editing.id}`, payload)
      } else {
        const payload = {
          vin: form.vin,
          vehicleModel: form.vehicleModel,
          batteryType: form.batteryType,
          registerInformation: form.registerInformation,
          userID: form.userId, // đã được auto-fill từ userName
        }
        await apiClient.post("/api/vehicles", payload)
      }

      setEditing(null)
      setAdding(false)
      resetForm()
      loadVehicles()
    } catch (err) {
      console.error("Error saving vehicle:", err)
      alert("Unable to save vehicle information.")
    }
  }

  // ------------------------
  // Delete
  // ------------------------
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return
    try {
      await apiClient.delete(`/api/vehicles/${id}`)
      loadVehicles()
    } catch (err) {
      console.error("Error deleting vehicle:", err)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">EV Vehicle Management</h1>
        <Button
          onClick={() => {
            setAdding(true)
            setEditing(null)
            resetForm()
          }}
        >
          + Add Vehicle
        </Button>
      </div>

      {/* Form Add/Edit */}
      {(adding || editing) && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-white p-4 rounded-xl shadow border"
        >
          <Input
            placeholder="VIN"
            value={form.vin}
            onChange={(e) => setForm({ ...form, vin: e.target.value })}
            required
          />

          <Input
            placeholder="Vehicle model"
            value={form.vehicleModel}
            onChange={(e) =>
              setForm({ ...form, vehicleModel: e.target.value })
            }
            required
          />

          <Input
            placeholder="Battery type"
            value={form.batteryType}
            onChange={(e) =>
              setForm({ ...form, batteryType: e.target.value })
            }
            required
          />

          <Input
            placeholder="Register information"
            value={form.registerInformation}
            onChange={(e) =>
              setForm({ ...form, registerInformation: e.target.value })
            }
          />

          {/* Auto-fill UserID when typing name */}
          <Input
            placeholder="User name"
            value={form.userName}
            disabled={!!editing}
            onChange={(e) => {
              if (!editing) handleUserNameChange(e.target.value)
            }}
          />

          <Input
            type="number"
            placeholder="User ID"
            value={form.userId}
            disabled
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setAdding(false)
                setEditing(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      )}

      {/* Vehicle list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {vehicles.map((v) => (
          <Card key={v.id} className="p-4">
            <CardContent>
              <p>
                <b>VIN:</b> {v.vin}
              </p>
              <p>
                <b>Model:</b> {v.vehicleModel}
              </p>
              <p>
                <b>Battery:</b> {v.batteryType}
              </p>
              <p>
                <b>Register info:</b> {v.registerInformation}
              </p>
              <p>
                <b>User:</b>{" "}
                {v.userId
                  ? `${v.userName ?? "Unknown"} (ID: ${v.userId})`
                  : "Not registered"}
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditing(v)
                    setForm({
                      vin: v.vin,
                      vehicleModel: v.vehicleModel,
                      batteryType: v.batteryType,
                      registerInformation: v.registerInformation ?? "",
                      userId: v.userId ?? 0,
                      userName: v.userName ?? "",
                    })
                    setAdding(false)
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(v.id!)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
