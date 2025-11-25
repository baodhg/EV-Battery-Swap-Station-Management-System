import { NextResponse } from "next/server"
import { deleteVehicle, updateVehicle } from "@/lib/server/vehicle-store"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid vehicle id" }, { status: 400 })
  }

  const payload = await request.json()
  const record = updateVehicle(id, {
    vin: payload?.vin,
    vehicleModel: payload?.vehicleModel,
    batteryType: payload?.batteryType,
    registerInformation: payload?.registerInformation,
    userId: typeof payload?.userId === "number" ? payload.userId : undefined,
    userName: payload?.userName,
  })

  if (!record) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
  }

  return NextResponse.json(record)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid vehicle id" }, { status: 400 })
  }

  const removed = deleteVehicle(id)
  if (!removed) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

