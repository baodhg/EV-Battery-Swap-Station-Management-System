import { NextResponse } from "next/server"
import { listVehiclesByUser } from "@/lib/server/vehicle-store"

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  const userId = Number(params.userId)
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 })
  }

  return NextResponse.json(listVehiclesByUser(userId))
}

