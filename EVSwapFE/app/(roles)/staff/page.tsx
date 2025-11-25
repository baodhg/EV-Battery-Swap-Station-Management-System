"use client"

import { redirect } from "next/navigation"

export default function StaffIndexPage() {
  // Redirect /staff to the queue management page
  redirect("/staff/queue")
}