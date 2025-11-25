import { NextResponse } from "next/server"
import { getSystemHealth } from "@/lib/server/staff-store"

export async function GET() {
  return NextResponse.json(getSystemHealth())
}

