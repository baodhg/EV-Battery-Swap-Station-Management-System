import { NextResponse } from "next/server"
import { listStaffMembers, StaffMemberRecord } from "@/lib/server/staff-store"

export async function GET() {
  return NextResponse.json(listStaffMembers())
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<StaffMemberRecord>
  if (!body.name || !body.email || !body.role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const record: StaffMemberRecord = {
    id: Date.now(),
    name: body.name,
    email: body.email,
    role: body.role,
    status: body.status ?? "active",
    joinDate: new Date().toISOString().slice(0, 10),
    permissions: body.permissions ?? [],
  }

  listStaffMembers().push(record)
  return NextResponse.json(record, { status: 201 })
}

