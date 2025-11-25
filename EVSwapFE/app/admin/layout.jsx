"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ArrowLeft } from "lucide-react"

export default function AdminLayout({ children }) {
  const { isLoggedIn, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Nếu chưa đăng nhập hoặc không phải admin → quay về trang chủ
    // Compare role case-insensitively to avoid redirecting valid "admin" roles
    const isAdmin = (user?.role ?? "").toString().toLowerCase() === "admin"
    if (!isLoading && (!isLoggedIn || !isAdmin)) {
      router.push("/")
    }
  }, [isLoggedIn, isLoading, user, router])

  if (isLoading) return <div className="p-6">Đang kiểm tra quyền truy cập...</div>

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
