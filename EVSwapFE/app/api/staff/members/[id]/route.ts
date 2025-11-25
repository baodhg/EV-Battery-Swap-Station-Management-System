import { NextResponse } from "next/server"
import { deleteStaffMember, updateStaffMember } from "@/lib/server/staff-store"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid staff id" }, { status: 400 })
  }

  const body = await request.json()
  const record = updateStaffMember(id, body)

  if (!record) {
    return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
  }

  return NextResponse.json(record)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid staff id" }, { status: 400 })
  }

  const removed = deleteStaffMember(id)
  if (!removed) {
    return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

