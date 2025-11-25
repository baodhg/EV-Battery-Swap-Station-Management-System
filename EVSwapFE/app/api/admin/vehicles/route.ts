import { NextResponse } from "next/server"
import { createVehicle, listVehicles } from "@/lib/server/vehicle-store"

export async function GET() {
  return NextResponse.json(listVehicles())
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body?.vin || !body?.vehicleModel || !body?.batteryType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const record = createVehicle({
    vin: String(body.vin),
    vehicleModel: String(body.vehicleModel),
    batteryType: String(body.batteryType),
    registerInformation: body.registerInformation ? String(body.registerInformation) : undefined,
    userId: typeof body.userID === "number" ? body.userID : null,
    userName: body.userName ? String(body.userName) : undefined,
  })

  return NextResponse.json(record, { status: 201 })
}

