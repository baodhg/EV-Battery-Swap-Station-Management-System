import { NextResponse } from "next/server"
import { createTransaction, listTransactions } from "@/lib/server/staff-store"

export async function GET() {
  return NextResponse.json(listTransactions())
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body?.relatedBookingId || !body?.reason) {
    return NextResponse.json({ error: "relatedBookingId and reason are required" }, { status: 400 })
  }

  const record = createTransaction({
    relatedBookingId: String(body.relatedBookingId),
    reason: String(body.reason),
  })

  return NextResponse.json(record, { status: 201 })
}

