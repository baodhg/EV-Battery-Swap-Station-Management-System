import { NextResponse } from "next/server"
import { recordFeedback } from "@/lib/server/staff-store"

export async function POST(request: Request) {
  const body = await request.json()

  if (!body?.fromStaffId || !body?.subject || !body?.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const record = recordFeedback({
    fromStaffId: Number(body.fromStaffId),
    subject: String(body.subject),
    message: String(body.message),
    severity: (body.severity ?? "medium") as "low" | "medium" | "high",
  })

  return NextResponse.json(record, { status: 201 })
}

