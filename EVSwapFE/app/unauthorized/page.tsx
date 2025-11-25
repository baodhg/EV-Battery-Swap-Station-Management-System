"use client"

import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">403 — Không có quyền</h1>
        <p className="text-gray-600 mb-6">Bạn không có quyền truy cập trang này. Vui lòng đăng nhập bằng tài khoản phù hợp.</p>

        <div className="flex justify-center gap-3">
          <Link href="/signin" className="px-4 py-2 bg-[#7241CE] text-white rounded">Đăng nhập</Link>
          <Link href="/" className="px-4 py-2 border rounded">Về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}
