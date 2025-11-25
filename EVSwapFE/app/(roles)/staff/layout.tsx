"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { StaffSidebar } from "@/components/staff/sidebar"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    // Compare role case-insensitively to avoid redirecting valid "staff" roles
    const isStaff = (user?.role ?? "").toString().toLowerCase() === "staff"
    if (!isLoading && (!isLoggedIn || !isStaff)) {
      // Mirror admin behavior: redirect to home if not authorized
      router.push("/")
    }
  }, [isLoggedIn, isLoading, user, router])

  if (isLoading) return <div className="p-6">Đang kiểm tra quyền truy cập...</div>

  return (
    <div className="flex h-screen bg-gray-50">
      <StaffSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  )
}
