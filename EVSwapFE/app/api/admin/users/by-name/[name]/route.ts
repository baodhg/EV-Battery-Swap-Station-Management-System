import { NextResponse } from "next/server"
import { findUserByName } from "@/lib/server/user-store"

export async function GET(_: Request, { params }: { params: { name: string } }) {
  const name = params.name ?? ""
  const user = findUserByName(decodeURIComponent(name))

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}

